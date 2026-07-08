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
import { rotating, render, transform } from '@/utils/three.ts';

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

  const currAward = useMemo<Award>(() => {
    const award = awards.find((award: Award) => award.id === currAwardId);

    console.log('currAward: ', award);

    return award;
  }, [currAwardId, awards]);

  // .
  const handleEnter = useCallback(async () => {
    if (lotteryStatus !== INIT) {
      return;
    }

    setLotteryStatus(READY);

    // openingAudio.value?.play();

    await transform(objects, targets.sphere, 1000, () => { render(renderer, scene, camera) });


    // const newScene = scene.copy(scene);
    // newScene.rotation.y = 0;
    // setScene(newScene);

    await rotating(scene as THREE.Scene, 0.1, 2000, () => { render(renderer, scene, camera) });

  }, [lotteryStatus, setLotteryStatus, objects, targets, scene, camera, renderer]);

  // .
  const handlePlay = useCallback(async () => {
    if (lotteryStatus !== READY) {
      return;
    }

    if (!currAward) {
      message.warning('请选择要抽取的奖项！');
      return;
    }

    setLotteryStatus(RUNNING);

    currWinnersRef.current = shuffle(members, currAward.count);

    console.log('handlePlay: ', { currAward, currWinners: currWinnersRef.current });

    // (scene as THREE.Scene).rotation.y = 0;
    await rotating(scene as THREE.Scene, 10, 3000, () => { render(renderer, scene, camera) });
  }, [lotteryStatus, setLotteryStatus, currAward, members, message, renderer, scene, camera]);

  // 停止动效并开奖.
  const handleFinish = useCallback(async () => {
    setLotteryStatus(FINISHED);

    // TODO 开奖动效.

    updateAward({ ...currAward, isFinished: true });

    const records: Record[] = currWinnersRef.current.map((winner) => ({
      awardId: currAward.id as number,
      memberId: winner.id as number,
    }));

    bulkCreateRecord(records);

    await rotating(scene as THREE.Scene, 0, 0.1, () => { render(renderer, scene, camera) });
  }, [setLotteryStatus, currAward, updateAward, bulkCreateRecord, scene, camera, renderer]);

  // .
  const handleReplay = useCallback(async () => {
    setLotteryStatus(READY);

    const winnerIds = currWinnersRef.current.map((winner) => winner.id);

    const targetRecords = records.filter(({ awardId, memberId }) => (awardId === currAward.id && winnerIds.includes(memberId)));
    const targetRecordIds = targetRecords.map((record) => record.id);
    bulkDeleteRecord(targetRecordIds as number[]);

    updateAward({ ...currAward, isFinished: false });
  }, [setLotteryStatus, currAward, records, bulkDeleteRecord, updateAward]);

  return { handleEnter, handlePlay, handleFinish, handleReplay };
}
