import { useCallback, useEffect, useState } from 'react';
import { App } from 'antd';

import { useLotteryStore } from '@/store/lottery.ts';

import type { FormInstance } from 'antd';

export function useGeneral(form: FormInstance) {
  const { message } = App.useApp();
  const title = useLotteryStore((state) => state.title);
  const setTitle = useLotteryStore((state) => state.setTitle);

  const [isTitleChange, setIsTitleChange] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ title });
  }, [form, title]);

  const handleTitleChange = useCallback((e) => {
    const value = e.target.value;

    if (value !== title) {
      setIsTitleChange(true);
    } else {
      setIsTitleChange(false);
    }
  }, [title]);

  const handleSaveTitle = useCallback(() => {
    const newTitle = form.getFieldValue('title');

    setTitle(newTitle);
    setIsTitleChange(false);
    message.success('标题修改成功！');
  }, [form, message, setTitle]);

  const handleCancelTitle = useCallback(() => {
    form.setFieldsValue({
      title,
    });
  }, [form, title]);

  const handleAlgoChange = useCallback(() => {
    // nothing.
  }, []);

  const handleClearAll = useCallback(() => {
    // TODO 清除所有 Localstorage 和 IndexedDB 中的相关数据.
  }, []);

  return { title, isTitleChange, handleTitleChange, handleSaveTitle, handleCancelTitle, handleAlgoChange, handleClearAll };
}
