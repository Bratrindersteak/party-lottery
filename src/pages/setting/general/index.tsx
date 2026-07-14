import React, { useState } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { shuffle, weightedRandom } from '@/utils/algorithm';

import { useGeneral } from './useGeneral.tsx';

import styles from './styles.module.css';

// 🚀 1. 严密声明：告诉 TS，我的组件现在合规接收 style 属性了
interface GeneralConfigProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function GeneralConfig({ style }: GeneralConfigProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { title, handleSaveTitle, handleCancelTitle, handleAlgoChange, handleClearAll } =  useGeneral(form);

  const [modalOpen, setModalOpen] = useState(false);

  // TODO 这里应该加一个一键清空缓存的按钮，当抽奖结束之后使用，否则缓存一直留在IndexedDB和localStorage中，很不环保.

  // TODO 抽奖标题除了内容可修改之外，还应该支持修改字号和颜色等.

  return (
    <>
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

          <div className={styles.item}>
            <div className={styles.title}>算法</div>
            <div className={styles.content}>
              <Select
                defaultValue="shuffle"
                style={{ width: 360 }}
                onChange={handleAlgoChange}
                options={[
                  { value: 'shuffle', label: '随机洗牌算法' },
                  { value: 'weightedRandom', label: '权重区间随机算法' },
                ]}
              />
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.title}>清理</div>
            <div className={styles.content}>
              <Button color="danger" variant="solid" className={styles['operation-btn']} onClick={() => { setModalOpen(true) }}>{t('general.clearAll')}</Button>
            </div>
          </div>
        </Form>
      </div>

      <Modal
        title={<><DeleteTwoTone twoToneColor={['#FF4D4F', '#FFF2F0']} /> 确认清空所有缓存?</>}
        style={{ top: 240 }}
        open={modalOpen}
        okButtonProps={{ color: 'danger', variant: 'solid' }}
        okText="清空所有缓存"
        onOk={handleClearAll}
        onCancel={() => setModalOpen(false)}
      >
        <p>详细解释关于为什么要清空缓存以及清空的范围</p>
      </Modal>
    </>
  );
}

export default GeneralConfig;
