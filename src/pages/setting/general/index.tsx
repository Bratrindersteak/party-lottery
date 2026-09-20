import React, { useState } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useGeneral } from './useGeneral.tsx';

import styles from './styles.module.css';

interface GeneralConfigProps {
  style?: React.CSSProperties;
}

function GeneralConfig({ style }: GeneralConfigProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { title, isTitleChange, handleTitleChange, handleSaveTitle, handleCancelTitle, handleAlgoChange, handleClearAll } =  useGeneral(form);

  const [modalOpen, setModalOpen] = useState(false);

  // TODO 抽奖标题除了内容可修改之外，还应该支持修改字号和颜色等.

  return (
    <>
      <div style={style} className={styles['setting-general']}>
        <Form form={form} component={false}>
          <div className={styles.block}>
            <div className={styles['block-title']}>{t('general.lotteryTitle')}</div>
            <div className={styles.content}>
              <Form.Item name={['title']} initialValue={title} className={styles['input']}>
                <Input placeholder={t('pleaseInput')} onChange={handleTitleChange} />
              </Form.Item>
              {isTitleChange && (<>
                <Button color="green" variant="outlined" className={styles['operation-btn']} onClick={handleSaveTitle}>{t('operation.save')}</Button>
                <Button className={styles['operation-btn']} onClick={handleCancelTitle}>{t('operation.cancel')}</Button>
              </>)}
            </div>
          </div>

          <div className={styles.block}>
            <div className={styles['block-title']}>{t('general.algorithm')}</div>
            <div className={styles.content}>
              <Select
                defaultValue="shuffle"
                style={{ width: 360 }}
                disabled={true}
                onChange={handleAlgoChange}
                options={[
                  { value: 'shuffle', label: t('algorithm.shuffle') },
                  { value: 'weightedRandom', label: t('algorithm.weightedRandom') },
                ]}
              />
            </div>
          </div>

          <div className={styles.block}>
            <div className={styles['block-title']}>{t('general.dangerZone')}</div>
            <div className={styles.list}>
              <div className={styles.item}>
                <div>
                  <h5 className={styles['item-title']}>{t('general.clearAll')}</h5>
                  <p className={styles['item-desc']}>Once you clean the page, there is no going back. Please be certain.</p>
                </div>
                <div>
                  <Button color="danger" variant="solid" className={styles['danger-btn']} onClick={() => { setModalOpen(true) }}>{t('general.clearAll')}</Button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>

      <Modal
        title={<><DeleteTwoTone twoToneColor={['#FF4D4F', '#FFF2F0']} /> 确认清空所有数据?</>}
        style={{ top: 240 }}
        open={modalOpen}
        okButtonProps={{ color: 'danger', variant: 'solid' }}
        okText="清空所有数据"
        onOk={handleClearAll}
        onCancel={() => setModalOpen(false)}
      >
        <p>详细解释关于为什么要清空缓存以及清空的范围</p>
      </Modal>
    </>
  );
}

export default GeneralConfig;
