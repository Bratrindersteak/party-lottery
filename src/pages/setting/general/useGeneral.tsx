import React, { useMemo, useEffect, useCallback, useState } from 'react';

import { useLotteryStore } from '@/store/lottery.ts';

export function useGeneral(form) {
  const title = useLotteryStore((state) => state.title);
  const setTitle = useLotteryStore((state) => state.setTitle);

  const handleSaveTitle = useCallback(() => {
    const newTitle = form.getFieldValue('title');

    setTitle(newTitle);
  }, [form, setTitle]);

  const handleCancelTitle = useCallback(() => {
    form.setFieldsValue({
      title,
    });
  }, [form, title]);

  return { title, handleSaveTitle, handleCancelTitle };
}
