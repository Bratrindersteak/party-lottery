import React from 'react';
import { Form, Button, Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { useGeneral } from './useGeneral.tsx';

import styles from './styles.module.css';

// 🚀 1. 严密声明：告诉 TS，我的组件现在合规接收 style 属性了
interface GeneralConfigProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function GeneralConfig({ style }: GeneralConfigProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { title, handleSaveTitle, handleCancelTitle } =  useGeneral(form);

  // TODO 这里应该加一个一键清空缓存的按钮，当抽奖结束之后使用，否则缓存一直留在IndexedDB和localStorage中，很不环保.

  // TODO 抽奖标题除了内容可修改之外，还应该支持修改字号和颜色等.

  return (
    <div style={style}>
      <Form form={form} component={false}>
        <div className={styles.item}>
          <div className={styles.title}>标题</div>
          <div className={styles.content}>
            <Form.Item name={['title']} initialValue={title} className={styles['input']}>
              <Input placeholder="Basic usage" />
            </Form.Item>
            <Button color="green" variant="outlined" className={styles['operation-btn']} onClick={handleSaveTitle}>{t('operation.save')}</Button>
            <Button className={styles['operation-btn']} onClick={handleCancelTitle}>{t('operation.cancel')}</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default GeneralConfig;
