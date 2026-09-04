import React from 'react';
import { Form, Table, Button, Upload, Popconfirm } from 'antd';
import { DeleteOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useMember } from './useMember.tsx';

import styles from './styles.module.css';

import type { Member } from '@/types/lottery';

interface MemberManagementProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function MemberManagement({ style }: MemberManagementProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { sortedMembers: dataSource, columns, rowSelection, uploadProps, handleDownloadTemplate, handleAdd, handleBulkDelete, handleClear, ableBulkDelete, ableClear } = useMember(form);

  return (
    <div style={style}>
      <div className={styles.operations}>
        <Button type="primary" className={styles['operation-btn']} onClick={handleAdd}>{t('operation.add')}</Button>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} color="green" variant="solid" className={styles['operation-btn']}>{t('member.excelImport')}</Button>
        </Upload>
        <Button icon={<DownloadOutlined />} color="green" variant="solid" className={styles['operation-btn']} onClick={handleDownloadTemplate}>{t('member.downloadTemplate')}</Button>
        <Popconfirm
          title="确认批量删除？"
          icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
          onConfirm={handleBulkDelete}
          okButtonProps={{ danger: true }}
          okText="删除"
          cancelText="取消"
        >
          <Button type="primary" danger className={styles['operation-btn']} disabled={!ableBulkDelete}>{t('operation.bulkDelete')}</Button>
        </Popconfirm>
        <Popconfirm
          title="确认清空？"
          icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
          onConfirm={handleClear}
          okButtonProps={{ danger: true }}
          okText="清空"
          cancelText="取消"
        >
          <Button type="primary" danger className={styles['operation-btn']} disabled={!ableClear}>{t('operation.clear')}</Button>
        </Popconfirm>
      </div>
      <Form form={form} component={false}>
        <Table<Member> rowSelection={rowSelection} columns={columns} dataSource={dataSource} rowKey="id" pagination={{ showTotal: (total) => `共 ${total} 条`, pageSize: 10, showQuickJumper: true }} />
      </Form>
    </div>
  )
}

export default MemberManagement;
