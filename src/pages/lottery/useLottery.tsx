import { useCallback, useMemo, useRef } from 'react';
import { App } from 'antd';
import * as THREE from 'three';

import { useMemberStore } from '@/store/member.ts';
import { useThreeStore } from '@/store/three.ts';
import { useRecordStore } from '@/store/record.ts';
import { useLotteryStore } from '@/store/lottery.ts';
import { useAwardStore } from '@/store/award.ts';
import { shuffle } from '@/utils/algorithm';
import { FINISHED, INIT, READY, RUNNING } from '@/config/constants.ts';
import { rotating, render, transform } from '@/utils/three';

import type { Award, Member, Record } from '@/types/lottery.ts';

export function useLottery() {
  const { message } = App.useApp();

  const members = useMemberStore((state) => state.members);

  const currAwardId = useLotteryStore((state) => state.currAwardId);
  const lotteryStatus = useLotteryStore((state) => state.lotteryStatus);
  const setLotteryStatus = useLotteryStore((state) => state.setLotteryStatus);

  const scene = useThreeStore((state) => state.scene);
  const camera = useThreeStore((state) => state.camera);
  const renderer = useThreeStore((state) => state.renderer);
  const objects = useThreeStore((state) => state.objects);
  const targets = useThreeStore((state) => state.targets);

  const records = useRecordStore((state) => state.records);
  const bulkCreateRecord = useRecordStore((state) => state.bulkCreate);
  const bulkDeleteRecord = useRecordStore((state) => state.bulkDelete);

  const awards = useAwardStore((state) => state.awards);
  const updateAward = useAwardStore((state) => state.update);

  const currWinnersRef = useRef<Member[]>([]);

  const currAward = useMemo<Award | null>(() => {
    const award = awards.find((award: Award) => award.id === currAwardId) || null;

    console.log('currAward: ', award);

    return award;
  }, [currAwardId, awards]);

  // 进入抽奖环节.
  const handleEnter = useCallback(async () => {
    if (lotteryStatus !== INIT) { return }

    setLotteryStatus(READY);

    // openingAudio.value?.play();

    await transform(scene, camera, renderer, objects, targets.sphere, 1000);

    await rotating(scene, camera, renderer, 100, 2 * 60 * 60);

  }, [lotteryStatus, setLotteryStatus, objects, targets, scene, camera, renderer]);

  // 开始抽取当前奖项.
  const handlePlay = useCallback(async () => {
    if (lotteryStatus !== READY) { return }

    if (!currAward) {
      message.warning('请选择要抽取的奖项！');
      return;
    }

    setLotteryStatus(RUNNING);

    currWinnersRef.current = shuffle(members, currAward.count);

    console.log('handlePlay: ', { currAward, currWinners: currWinnersRef.current });

    await rotating(scene, camera, renderer, 1000, 500);
  }, [lotteryStatus, setLotteryStatus, currAward, members, message, renderer, scene, camera]);

  // 停止动效并开奖.
  const handleFinish = useCallback(async () => {
    if (lotteryStatus !== RUNNING) { return }
    if (!currAward) { return }

    setLotteryStatus(FINISHED);

    // TODO 开奖动效.

    updateAward({ ...currAward, isFinished: true });

    const records: Record[] = currWinnersRef.current.map((winner) => ({
      awardId: currAward.id as number,
      memberId: winner.id as number,
    }));

    bulkCreateRecord(records);

    const currentY = scene.rotation.y; // 2. 获取当前停下的弧度值
    const TWO_PI = Math.PI * 2; // 3. 计算下一个正面的目标弧度（保证顺时针继续滑动到正面）
    const currentRounds = Math.floor(currentY / TWO_PI); // Math.ceil 确保总是往前找最近的正面；+ 1 可以在当前位置基础上再多转 1 圈作为缓冲减速
    const rotations = (currentRounds + 3);
    await rotating(scene, camera, renderer, rotations, 2);
  }, [lotteryStatus, setLotteryStatus, currAward, updateAward, bulkCreateRecord, scene, camera, renderer]);

  // 重新抽取当前奖项.
  const handleReplay = useCallback(async () => {
    if (lotteryStatus !== FINISHED) { return }
    if (!currAward) { return }

    // 更新抽奖状态.
    setLotteryStatus(READY);

    // 清除当前奖项的获奖记录.
    const winnerIds = currWinnersRef.current.map((winner) => winner.id);
    const targetRecords = records.filter(({ awardId, memberId }) => (awardId === currAward.id && winnerIds.includes(memberId)));
    const targetRecordIds = targetRecords.map((record) => record.id);
    bulkDeleteRecord(targetRecordIds as number[]);

    // 重置当前奖项为未开奖.
    updateAward({ ...currAward, isFinished: false });
  }, [lotteryStatus, setLotteryStatus, currAward, records, bulkDeleteRecord, updateAward]);

  return { currAward, handleEnter, handlePlay, handleFinish, handleReplay };
}
