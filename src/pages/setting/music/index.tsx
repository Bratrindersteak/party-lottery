import React from 'react';
import { Button, Form, Popconfirm, Table, Upload, Select, Tag } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useMusic } from './useMusic.tsx';

import styles from './styles.module.css';

import type { Music } from '@/types/lottery.ts';

interface MusicConfigProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function MusicConfig({ style }: MusicConfigProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { musics: dataSource, openingId, handleOpeningChange, lotteryId, handleLotteryChange, winningId, handleWinningChange, columns, rowSelection, uploadProps, handleBulkDelete, handleClear } = useMusic(form);

  return (
    <div style={style}>
      <div className={styles.operations}>
        <div>
          <Upload {...uploadProps} className={styles['operation-btn']}>
            <Button icon={<UploadOutlined />} color="green" variant="solid">{t('operation.add')}</Button>
          </Upload>
          <Popconfirm
            title="确认批量删除？"
            icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
            onConfirm={handleBulkDelete}
            okButtonProps={{ danger: true }}
            okText="删除"
            cancelText="取消"
          >
            <Button type="primary" danger className={styles['operation-btn']}>{t('operation.bulkDelete')}</Button>
          </Popconfirm>
          <Popconfirm
            title="确认清空？"
            icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
            onConfirm={handleClear}
            okButtonProps={{ danger: true }}
            okText="清空"
            cancelText="取消"
          >
            <Button type="primary" danger className={styles['operation-btn']}>{t('operation.clear')}</Button>
          </Popconfirm>
        </div>
        <div>
          <Select
            className={styles['music-selector']}
            value={openingId}
            fieldNames={{label: 'name', value: 'id'}}
            prefix={<Tag color="#2db7f5">开场音效</Tag>}
            style={{ width: 200 }}
            options={dataSource}
            onChange={handleOpeningChange}
          />
          <Select
            className={styles['music-selector']}
            value={lotteryId}
            fieldNames={{label: 'name', value: 'id'}}
            prefix={<Tag color="#2db7f5">抽奖音效</Tag>}
            style={{ width: 200 }}
            options={dataSource}
            onChange={handleLotteryChange}
          />
          <Select
            className={styles['music-selector']}
            value={winningId}
            fieldNames={{label: 'name', value: 'id'}}
            prefix={<Tag color="#2db7f5">开奖音效</Tag>}
            style={{ width: 200 }}
            options={dataSource}
            onChange={handleWinningChange}
          />
        </div>
      </div>
      <Form form={form} component={false}>
        <Table<Music> rowSelection={rowSelection} columns={columns} dataSource={dataSource} rowKey="id" pagination={{ showTotal: (total) => `共 ${total} 条`, pageSize: 10, showQuickJumper: true }} />
      </Form>
    </div>
  )
}

export default MusicConfig;
