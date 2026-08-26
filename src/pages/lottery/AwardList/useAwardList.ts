import { useCallback } from 'react';
import { App } from 'antd';

import { useLotteryStore } from '@/store/lottery.ts';
import { RUNNING } from '@/config/constants.ts';

import type { Award } from '@/types/lottery.ts';

export function useAwardList() {
  const { message } = App.useApp();
  const lotteryStatus = useLotteryStore((state) => state.lotteryStatus);
  const currAwardId = useLotteryStore((state) => state.currAwardId);
  const setCurrAwardId = useLotteryStore((state) => state.setCurrAwardId);

  const handleAwardClick = useCallback((award: Award) => {
    const nextAwardId = award.id as number;

    if (nextAwardId === currAwardId) { return }

    if (lotteryStatus === RUNNING) {
      message.warning('当前奖项正在抽取中，请不要切换！');
      return;
    }

    setCurrAwardId(nextAwardId);
  }, [currAwardId, lotteryStatus, message, setCurrAwardId]);

  return {
    handleAwardClick,
  };
}
