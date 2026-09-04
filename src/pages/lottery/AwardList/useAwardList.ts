import { useAwardStore } from '@/store/award.ts';
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
  const isAwardListExpanded = useLotteryStore((state) => state.isAwardListExpanded);
  const setIsAwardListExpanded = useLotteryStore((state) => state.setIsAwardListExpanded);
  const awards = useAwardStore((state) => state.awards);

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

  const handleExpand = useCallback(() => {
    if (awards.length) {
      setIsAwardListExpanded(!isAwardListExpanded);
    } else {
      message.warning('奖项列表为空，请添加！');
    }
  }, [awards, isAwardListExpanded, setIsAwardListExpanded, message]);

  return { ableClick, handleClick, handleExpand };
}
