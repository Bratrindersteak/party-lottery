import { useCallback, useMemo } from 'react';
import { App } from 'antd';

import { useLotteryStore } from '@/store/lottery.ts';
import { INIT, READY } from '@/config/constants.ts';

import type { Award } from '@/types/lottery.ts';

export function useAwardList() {
  const { message } = App.useApp();
  const lotteryStatus = useLotteryStore((state) => state.lotteryStatus);
  const currAwardId = useLotteryStore((state) => state.currAwardId);
  const setCurrAwardId = useLotteryStore((state) => state.setCurrAwardId);

  const ableClick = useMemo<boolean>(() => {
    return [INIT, READY].includes(lotteryStatus);
  }, [lotteryStatus]);

  const handleClick = useCallback((award: Award) => {
    if (lotteryStatus === INIT || lotteryStatus === READY) {
      const nextAwardId = award.id as number;

      if (nextAwardId === currAwardId) { return }

      setCurrAwardId(nextAwardId);
    } else {
      message.warning('当前奖项正在抽取中，请不要切换！');
    }
  }, [currAwardId, lotteryStatus, message, setCurrAwardId]);

  return {
    ableClick,
    handleClick,
  };
}
