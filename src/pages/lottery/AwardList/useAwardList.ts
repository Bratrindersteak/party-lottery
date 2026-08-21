import { useCallback, useState } from 'react';

import { useLotteryStore } from '@/store/lottery.ts';

import type { Award } from '@/types/lottery.ts';

export function useAwardList() {
  const setCurrAwardId = useLotteryStore((state) => state.setCurrAwardId);

  const [awardHandle, setAwardHandle] = useState<boolean>(true);

  const handleAwardClick = useCallback((award: Award) => {
    setCurrAwardId(award.id as number);
  }, [setCurrAwardId]);

  return {
    awardHandle, setAwardHandle,
    handleAwardClick,
  };
}
