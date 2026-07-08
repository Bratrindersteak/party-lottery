import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { Form, Input, InputNumber, Button, Popconfirm, Table, Tag, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useRecordStore } from '@/store/record.ts';
import { useAwardStore } from '@/store/award.ts';
import { useMemberStore } from '@/store/member.ts';

import styles from './styles.module.css';

import type { TableProps, TableColumnsType } from 'antd';
import type { Record, Award, Member } from '@/types/lottery';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export function useRecord(form) {
  const records = useRecordStore((state) => state.records);
  const create = useRecordStore((state) => state.create);
  const bulkCreate = useRecordStore((state) => state.bulkCreate);
  const update = useRecordStore((state) => state.update);
  const remove = useRecordStore((state) => state.delete);
  const bulkRemove = useRecordStore((state) => state.bulkDelete);
  const clear = useRecordStore((state) => state.clear);

  const awards = useAwardStore((state) => state.awards);

  const members = useMemberStore((state) => state.members);

  const { t } = useTranslation();

  const [messageApi, messageHolder] = message.useMessage();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableRowSelection<Record> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows, info) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys, { selectedRows, info });
      setSelectedRowKeys(newSelectedRowKeys);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            return index % 2 === 0;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            return index % 2 !== 0;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const handleAdd = useCallback((item) => {
    const timestamp = Date.now();
    const tempItem = {
      awardId: '',
      memberId: '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    create(tempItem);
  }, [create]);

  const handleBulkAdd = useCallback((items) => {
    const timestamp = Date.now();
    const tempItem = {
      awardId: '',
      memberId: '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    create(tempItem);
  }, [create]);

  const handleDelete = useCallback((item: Record) => {
    console.log('handleDelete: ', item);
    remove(item);
  }, [remove]);

  const handleBulkDelete = useCallback(() => {
    bulkRemove(selectedRowKeys);
  }, [bulkRemove, selectedRowKeys]);

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  const columns = useMemo<TableColumnsType<Record>>(() => [
    {
      title: '奖项',
      dataIndex: 'awardId',
      key: 'awardId',
      render: (value, record, index: number) => {
        const award: Award = awards.find(award => award.id === value);

        return (
          <>{award ? award.name : ''}</>
        );
      },
    },
    {
      title: '获奖者',
      dataIndex: 'memberId',
      key: 'memberId',
      render: (value, record, index: number) => {
        const member: Member = members.find(member => member.id === value);

        return (
          <>{member ? member.name : ''}</>
        );
      },
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'end',
      width: 200,
      render: (value, record, index: number) => {
        return (
          <>
            <Popconfirm
              title="确认删除?"
              icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
              onConfirm={() => { handleDelete(record) }}
              okButtonProps={{ danger: true }}
              okText="删除"
              cancelText="取消"
            >
              <Button color="danger" variant="outlined" size="small" className={styles['table-btn']}>{t('operation.delete')}</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ], [t, handleDelete, awards, members]);

  return { records, columns, rowSelection, handleAdd, handleBulkAdd, handleBulkDelete, handleClear, messageHolder };
}
