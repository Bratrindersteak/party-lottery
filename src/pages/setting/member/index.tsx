import React, { useState } from 'react';
import { Form, Table, Button, Upload, Popconfirm } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useMember } from './useMember.tsx';

import styles from './styles.module.css';

import type { TableProps } from 'antd';
import type { Member } from '@/types/lottery';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface MemberManagementProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function MemberManagement({ style }: MemberManagementProps) {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows, info) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys, { selectedRows, info });
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Member> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const { sortedMembers: dataSource, columns, uploadProps, handleAdd, handleBulkDelete, handleClear, messageHolder } = useMember(form);

  return (
    <div style={style}>
      <div className={styles.operations}>
        {messageHolder}

        <Button type="primary" className={styles['operation-btn']} onClick={handleAdd}>{t('operation.add')}</Button>

        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} color="green" variant="solid" className={styles['operation-btn']}>{t('member.excelImport')}</Button>
        </Upload>

        <Popconfirm
          title="确认批量删除？"
          icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
          onConfirm={() => { handleBulkDelete(selectedRowKeys) }}
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
        <Table<Member> rowSelection={rowSelection} columns={columns} dataSource={dataSource} rowKey="id" pagination={{ showTotal: (total) => `共 ${total} 条`, pageSize: 10, showQuickJumper: true }} />
      </Form>
    </div>
  )
}

export default MemberManagement;
