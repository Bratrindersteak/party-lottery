import React, { useMemo, useCallback, useState } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useRecordStore } from '@/store/record.ts';
import { useAwardStore } from '@/store/award.ts';
import { useMemberStore } from '@/store/member.ts';
import { exportToExcel } from '@/utils/excel.ts';

import styles from './styles.module.css';

import type { TableProps, TableColumnsType } from 'antd';
import type { Record, Award, Member, ExportColumns } from '@/types/lottery';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export function useRecord() {
  const records = useRecordStore((state) => state.records);
  const create = useRecordStore((state) => state.create);
  const remove = useRecordStore((state) => state.delete);
  const bulkRemove = useRecordStore((state) => state.bulkDelete);
  const clear = useRecordStore((state) => state.clear);

  const awards = useAwardStore((state) => state.awards);
  const updateAward = useAwardStore((state) => state.update);

  const members = useMemberStore((state) => state.members);

  const { t } = useTranslation();

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

  const handleDownload = useCallback(() => {
    // TODO 抽奖结果导出.

    const data = records.map(({ awardId, memberId }) => {
      const award = awards.find(award => award.id === awardId);

      const member = members.find(member => member.id === memberId);

      const item: ExportColumns = {};

      if (award) {
        item.award = award.name;
      }

      if (member) {
        item.employeeId = member.employeeId;
        item.name = member.name;
        item.department = member.department;
      }

      return item;
    });

    exportToExcel(data);
  }, [awards, members, records]);

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

    awards.forEach(award => {
      updateAward({ ...award, isFinished: false });
    });
  }, [clear, awards, updateAward]);

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

  return { records, columns, rowSelection, handleDownload, handleAdd, handleBulkAdd, handleBulkDelete, handleClear };
}
