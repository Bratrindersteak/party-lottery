import { Col, Row, Menu } from 'antd';
import { useTranslation } from 'react-i18next'

import type { GetProp, MenuProps } from 'antd';

import styles from './Setting.module.css';

import MemberManagement from './member';

type MenuItem = GetProp<MenuProps, 'items'>[number];

function Setting() {
  const { t } = useTranslation();

  const items: MenuItem[] = [
    { key: '1', label: t('general.title'), icon: '' },
    { key: '2', label: t('member.title'), icon: '' },
    { key: '3', label: t('award.title'), icon: '' },
    { key: '4', label: t('record.title'), icon: '' },
    { key: '5', label: t('music.title'), icon: '' },
    { key: '6', label: t('instruction.title'), icon: '' },
  ];

  return (
    <Row>
      <Col span={3}>
        <div className="header">
          <h3 className="title">{t('setting')}</h3>
        </div>
        <Menu defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="vertical"
          theme="light"
          items={items} />
      </Col>
      <Col span={21} className={styles['right-content']}>
        <MemberManagement />
      </Col>
    </Row>
  )
}

export default Setting
