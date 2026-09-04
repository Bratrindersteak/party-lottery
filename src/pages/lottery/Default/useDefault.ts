import { useCallback, useMemo, useState } from 'react';
import { App } from 'antd';

import { useMemberStore } from '@/store/member.ts';
import { useLotteryStore } from '@/store/lottery.ts';
import { useSettingStore } from '@/store/setting.ts';
import { useAwardStore } from '@/store/award.ts';
import { SETTING, MEMBER, DEFAULT_TITLE, DEFAULT_AWARDS } from '@/config/constants.ts';
import { parseExcel } from '@/utils/excel.ts';
import defaultMembers from '@/assets/excels/default-members.xlsx';

import type { RcFile } from 'antd/es/upload';

export function useDefault() {
  const { message } = App.useApp();
  const members = useMemberStore((state) => state.members);
  const bulkCreate = useMemberStore((state) => state.bulkCreate);
  const setModule = useSettingStore((state) => state.setModule);
  const setScreen = useLotteryStore((state) => state.setScreen);
  const setTitle = useLotteryStore((state) => state.setTitle);
  const setIsAwardListExpanded = useLotteryStore((state) => state.setIsAwardListExpanded);
  const setCurrAwardId = useLotteryStore((state) => state.setCurrAwardId);
  const addAward = useAwardStore((state) => state.create);

  const [ableClick, setAbleClick] = useState(true);

  const ableShow = useMemo(() => {
    return members.length === 0;
  }, [members]);

  const handleGoToAddData = useCallback(async () => {
    setScreen(SETTING);
    setModule(MEMBER);
  }, [setScreen, setModule]);

  const handleUseDefaultData = useCallback(async () => {
    setAbleClick(false);
    // 1. 发起请求获取静态文件
    const response = await fetch(defaultMembers);
    if (!response.ok) {
      throw new Error(`静态 Excel 文件读取失败，HTTP 状态码: ${response.status}`);
    }

    // 2. 转为 Blob 二进制对象
    const blob = await response.blob();

    // 3. 将 Blob 包装为标准的 File / RcFile
    const file = new File([blob], 'default-members', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      lastModified: Date.now(),
    }) as RcFile;

    // 补全 RcFile 扩展的 uid 属性
    file.uid = `static-excel-${Date.now()}`;

    const members = await parseExcel(file);
    const timestamp = Date.now();
    const newMembers = members.map(member => ({ ...member, createdAt: timestamp, updatedAt: timestamp }));
    await bulkCreate(newMembers);
    message.success({ content: `成功导入${members.length}人！`, key: 'importing' });

    setTitle(DEFAULT_TITLE);

    await Promise.all(DEFAULT_AWARDS.map(award => {
      addAward({ ...award, createdAt: Date.now() });
    }));

    const awards = useAwardStore.getState().awards;
    setCurrAwardId(awards[0].id as number);
    setIsAwardListExpanded(true);

    setAbleClick(true);
  }, [bulkCreate, message, setTitle, setCurrAwardId, setIsAwardListExpanded, addAward]);

  return { ableShow, ableClick, handleGoToAddData, handleUseDefaultData };
}
