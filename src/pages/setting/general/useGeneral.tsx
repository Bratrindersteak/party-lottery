import { useCallback } from 'react';

import { useLotteryStore } from '@/store/lottery.ts';

import type { FormInstance } from 'antd';

export function useGeneral(form: FormInstance) {
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

  const handleAlgoChange = useCallback(() => {

  }, []);

  const handleClearAll = useCallback(() => {
    // TODO 清除所有 Localstorage 和 IndexedDB 中的相关数据.
  }, []);

  return { title, handleSaveTitle, handleCancelTitle, handleAlgoChange, handleClearAll };
}
