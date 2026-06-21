import React from 'react';
import { Button, Form, Popconfirm, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useRecord } from './useRecord.tsx';

import styles from './styles.module.css';

import type { Record } from '@/types/lottery.ts';

interface AwardRecordProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function AwardRecord({ style }: AwardRecordProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { records: dataSource, columns, rowSelection, handleBulkDelete, handleClear, messageHolder } = useRecord(form);

  return (
    <div style={style}>
      <div className={styles.operations}>
        {messageHolder}
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
      <Form form={form} component={false}>
        <Table<Record> rowSelection={rowSelection} columns={columns} dataSource={dataSource} rowKey="id" pagination={{ showTotal: (total) => `共 ${total} 条`, pageSize: 10, showQuickJumper: true }} />
      </Form>
    </div>
  )
}

export default AwardRecord;
