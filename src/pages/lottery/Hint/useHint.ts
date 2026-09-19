import { useState, useMemo, useEffect } from 'react';

import { useLotteryStore } from '@/store/lottery.ts';
import { useAwardStore } from '@/store/award.ts';
import { FINISHED, RUNNING } from '@/config/constants.ts';

import type { Award } from '@/types/lottery.ts';

export function useHint() {
  const lotteryStatus = useLotteryStore((state) => state.lotteryStatus);
  const currAwardId = useLotteryStore((state) => state.currAwardId);
  const awards = useAwardStore((state) => state.awards);

  const [currAwardName, setCurrAwardName] = useState<string>('');
  useEffect(() => {
    const currAward = awards.find((award: Award) => award.id === currAwardId);
    const currAwardName = currAward ? currAward.name : '';
    // 配合淡入淡出效果，延迟切换名称.
    const timer = setTimeout(() => {
      setCurrAwardName(currAwardName);
    }, 350);

    return () => clearTimeout(timer);
  }, [currAwardId, awards]);

  const show = useMemo(() => {
    return lotteryStatus === RUNNING || lotteryStatus === FINISHED;
  }, [lotteryStatus]);

  const finished = useMemo(() => {
    return lotteryStatus === FINISHED;
  }, [lotteryStatus]);

  return {
    show, finished,
    currAwardName,
  };
}
