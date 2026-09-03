import { useState, useCallback, useMemo, useRef } from 'react';
import * as TWEEN from '@tweenjs/tween.js';
import { App } from 'antd';

import { useMemberStore } from '@/store/member.ts';
import { useThreeStore } from '@/store/three.ts';
import { useRecordStore } from '@/store/record.ts';
import { useLotteryStore } from '@/store/lottery.ts';
import { useAwardStore } from '@/store/award.ts';
import { shuffle } from '@/utils/algorithm';
import { FINISHED, INIT, READY, RUNNING } from '@/config/constants.ts';
import { rotating, transform } from '@/utils/three';
import winnerPosition from '@/utils/three/winnerPosition.ts';
import winnerTransform from "@/utils/three/winnerTransform.ts";
import isNullish from '@/utils/isNullish.ts';

import type { Award, Member, Record } from '@/types/lottery.ts';

export function useLottery() {
  const { message } = App.useApp();

  const members = useMemberStore((state) => state.members);

  const currAwardId = useLotteryStore((state) => state.currAwardId);
  const setCurrAwardId = useLotteryStore((state) => state.setCurrAwardId);
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

  const [isAnimating, setIsAnimating] = useState(false);

  const currWinnersRef = useRef<Member[]>([]);

  const currAward = useMemo<Award | null>(() => {
    const award = awards.find((award: Award) => award.id === currAwardId) || null;

    console.log('currAward: ', award);

    return award;
  }, [currAwardId, awards]);

  const ableEnter = useMemo<boolean>(() => {
    return !isAnimating && lotteryStatus === INIT;
  }, [isAnimating, lotteryStatus]);

  const ablePlay = useMemo<boolean>(() => {
    return !isAnimating && lotteryStatus === READY && currAward !== null && !currAward.isFinished;
  }, [isAnimating, currAward, lotteryStatus]);

  const ableFinish = useMemo<boolean>(() => {
    return !isAnimating && lotteryStatus === RUNNING && currAward !== null && !currAward.isFinished;
  }, [isAnimating, currAward, lotteryStatus]);

  const ableReplay = useMemo<boolean>(() => {
    return !isAnimating && lotteryStatus === FINISHED && currAward !== null && currAward.isFinished;
  }, [isAnimating, currAward, lotteryStatus]);

  // 进入抽奖环节.
  const handleEnter = useCallback(async () => {
    if (lotteryStatus !== INIT) { return }

    if (!currAward) {
      message.warning('请选择要抽取的奖项！');
      return;
    }

    if (currAward?.isFinished) {
      message.warning('当前奖项已抽取完毕！');
      return;
    }

    setIsAnimating(true);
    setLotteryStatus(READY);

    // openingAudio.value?.play();

    await transform(scene, camera, renderer, objects, targets.sphere, 2000);
    setIsAnimating(false);
    rotating(scene, camera, renderer, 1, 60, TWEEN.Easing.Linear.None, Infinity);
  }, [lotteryStatus, currAward, setLotteryStatus, scene, camera, renderer, objects, targets.sphere, message]);

  // 开始抽取当前奖项.
  const handlePlay = useCallback(async () => {
    if (lotteryStatus !== READY) { return }

    if (!currAward) {
      message.warning('请选择要抽取的奖项！');
      return;
    }

    if (currAward?.isFinished) {
      message.warning('当前奖项已抽取完毕！');
      return;
    }

    setIsAnimating(true);
    setLotteryStatus(RUNNING);

    const excludedIds: number[] = currAward.allowRepeat ? [] : records.map(record => record.memberId);
    currWinnersRef.current = shuffle(members, currAward.count, excludedIds);

    console.log('handlePlay: ', { currAward, currWinners: currWinnersRef.current });

    await rotating(scene, camera, renderer, 5, 2, TWEEN.Easing.Cubic.In);
    setIsAnimating(false);
    rotating(scene, camera, renderer, 2, 1, TWEEN.Easing.Linear.None, Infinity);
  }, [lotteryStatus, currAward, setLotteryStatus, records, members, scene, camera, renderer, message]);

  // 停止动效并开奖.
  const handleFinish = useCallback(async () => {
    if (lotteryStatus !== RUNNING) { return }
    if (!currAward) { return }

    setIsAnimating(true);

    const currentY = scene.rotation.y;
    const TWO_PI = Math.PI * 2;
    // 1. 计算当前这不足一圈的余数（处理负数/浮点数积累）
    const remainder = ((currentY % TWO_PI) + TWO_PI) % TWO_PI;
    // 2. 顺时针补齐到下一个正对屏幕位置所需的弧度占比（0 ~ 1 圈）
    const restOfTurn = remainder > 0 ? (TWO_PI - remainder) / TWO_PI : 0;
    // 3. 最终增量圈数 = 补齐当前圈 + 减速缓冲 3 圈
    const rotations = restOfTurn + 3;
    await rotating(scene, camera, renderer, rotations, 4, TWEEN.Easing.Cubic.Out);

    setLotteryStatus(FINISHED);
    updateAward({ ...currAward, isFinished: true });

    const records: Record[] = currWinnersRef.current.map((winner) => ({
      awardId: currAward.id as number,
      memberId: winner.id as number,
    }));
    bulkCreateRecord(records);

    const positions = winnerPosition(currWinnersRef.current.length);
    await winnerTransform(scene, camera, renderer, objects, 1500, positions, currWinnersRef.current);
    setIsAnimating(false);
  }, [lotteryStatus, currAward, setLotteryStatus, updateAward, bulkCreateRecord, scene, camera, renderer, objects]);

  // 重新抽取当前奖项.
  const handleReplay = useCallback(async () => {
    if (lotteryStatus !== FINISHED) { return }
    if (!currAward) { return }

    setIsAnimating(true);
    // 更新抽奖状态.
    setLotteryStatus(READY);

    // 清除当前奖项的获奖记录.
    const winnerIds = currWinnersRef.current.map((winner) => winner.id);
    const targetRecords = records.filter(({ awardId, memberId }) => (awardId === currAward.id && winnerIds.includes(memberId)));
    const targetRecordIds = targetRecords.map((record) => record.id);
    bulkDeleteRecord(targetRecordIds as number[]);

    // 重置当前奖项为未开奖.
    updateAward({ ...currAward, isFinished: false });

    await transform(scene, camera, renderer, objects, targets.sphere, 2000, currWinnersRef.current);
    currWinnersRef.current = [];
    setIsAnimating(false);
    rotating(scene, camera, renderer, 1, 60, TWEEN.Easing.Linear.None, Infinity);
  }, [lotteryStatus, currAward, setLotteryStatus, records, bulkDeleteRecord, updateAward, scene, camera, renderer, objects, targets.sphere]);

  const handleContinue = useCallback(async () => {
    if (lotteryStatus !== FINISHED) { return }
    if (!currAward) { return }

    const unfinishAwardIds1: number[] = [];
    const unfinishAwardIds2: number[] = [];
    const currIndex = awards.findIndex(award => award.id === currAwardId);
    awards.forEach(({ id, isFinished }, index) => {
      if (!isFinished) {
        if (index > currIndex) {
          unfinishAwardIds1.push(id);
        } else if (index < currIndex) {
          unfinishAwardIds2.push(id);
        }
      }
    });

    const nextAwardId = unfinishAwardIds1[0] ?? unfinishAwardIds2[0];
    if (!isNullish(nextAwardId)) {
      setIsAnimating(true);
      setLotteryStatus(READY);
      setCurrAwardId(nextAwardId);
      await transform(scene, camera, renderer, objects, targets.sphere, 2000, currWinnersRef.current);
      currWinnersRef.current = [];
      rotating(scene, camera, renderer, 1, 60, TWEEN.Easing.Linear.None, Infinity);
    } else {
      message.warning('当前所有奖项均已抽取完毕！');
    }
    setIsAnimating(false);
  }, [lotteryStatus, currAward, setLotteryStatus, awards, currAwardId, setCurrAwardId, scene, camera, renderer, objects, targets.sphere, message]);

  return {
    ableEnter, ablePlay, ableFinish, ableReplay,
    handleEnter, handlePlay, handleFinish, handleReplay, handleContinue,
  };
}
