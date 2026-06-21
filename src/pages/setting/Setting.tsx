import { useCallback } from 'react';
import { Button, Col, Row, Menu } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'

import type { GetProp, MenuProps } from 'antd';

import { useLotteryStore } from '@/store/lottery.ts';
import { useSettingStore } from '@/store/setting.ts';
import { LOTTERT, SETTING, GENERAL, MEMBER, AWARD, RECORD, MUSIC, INSTRUCTION } from '@/config/constants.ts';

import styles from './Setting.module.css';

import General from './general';
import Member from './member';
import Award from './award';
import Record from './record';
import Music from './music';
import Instruction from './instruction';

type MenuItem = GetProp<MenuProps, 'items'>[number];

function Setting() {
  const setScreen = useLotteryStore((state) => state.setScreen);

  const currentModule = useSettingStore((state) => state.currentModule);
  const setModule = useSettingStore((state) => state.setModule);

  const { t } = useTranslation();

  const handleBack = useCallback(() => {
    setScreen(LOTTERT);
  }, [setScreen]);

  const items: MenuItem[] = [
    { key: GENERAL, label: t('general.title'), icon: '' },
    { key: MEMBER, label: t('member.title'), icon: '' },
    { key: AWARD, label: t('award.title'), icon: '' },
    { key: RECORD, label: t('record.title'), icon: '' },
    { key: MUSIC, label: t('music.title'), icon: '' },
    { key: INSTRUCTION, label: t('instruction.title'), icon: '' },
  ];

  const handleMenuClick = useCallback(({ key, keyPath, domEvent }) => {
    console.log('handleMenuClick: ', { key, keyPath, domEvent });
    setModule(key);
  }, [setModule]);

  return (
    <Row>
      <Col span={3}>
        <div className={styles.header}>
          <Button className={styles.back} icon={<RollbackOutlined />} title="返回抽奖" onClick={handleBack} />
          <h3 className={styles.title}>{t('setting')}</h3>
        </div>
        <Menu defaultSelectedKeys={[currentModule]}
          mode="vertical"
          theme="light"
          items={items}
          onClick={handleMenuClick} />
      </Col>
      <Col span={21} className={styles['right-content']}>
        <General style={{ display: currentModule === GENERAL ? 'block' : 'none' }} />
        <Member style={{ display: currentModule === MEMBER ? 'block' : 'none' }} />
        <Award style={{ display: currentModule === AWARD ? 'block' : 'none' }} />
        <Record style={{ display: currentModule === RECORD ? 'block' : 'none' }} />
        <Music style={{ display: currentModule === MUSIC ? 'block' : 'none' }} />
        <Instruction style={{ display: currentModule === INSTRUCTION ? 'block' : 'none' }} />
      </Col>
    </Row>
  )
}

export default Setting
