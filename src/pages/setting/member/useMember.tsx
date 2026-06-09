import { generateTempId } from '@/utils/uuid.ts';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Input, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useMemberStore } from '@/store/member.ts';

import styles from './styles.module.css';

import type { TableColumnsType, PopconfirmProps } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { Member } from '@/types/lottery';

export function useMember(message: MessageInstance) {
  const members = useMemberStore((state) => state.members);
  const init = useMemberStore((state) => state.init);
  const create = useMemberStore((state) => state.create);
  const update = useMemberStore((state) => state.update);
  const remove = useMemberStore((state) => state.delete);
  const bulkRemove = useMemberStore((state) => state.bulkDelete);
  const clear = useMemberStore((state) => state.clear);

  // 🚀 2. 核心大招：在 Hook 内部直接绑定初始化看门狗
  useEffect(() => {
    console.log('init 被调用~');
    init();
  }, [init]);

  const { t } = useTranslation();

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
  };

  const handleAdd = useCallback(() => {
    const tempItem = { id: generateTempId(), employeeId: '', name: '', department: '', _isEdit: true, _type: 'add' };

    create(tempItem);
  }, [create]);

  const handleEdit = useCallback((item: Member) =>{

  }, []);

  const handleSave = useCallback((item: Member) =>{

  }, []);

  const handleCancel = useCallback((item: Member) =>{
    const { _type, _backup } = item;

    if (_type === 'add') {
      remove(item);


    } else if (_type === 'edit') {
      update(_backup);
    }
  }, []);

  const handleBulkDelete = useCallback((items: Member[]) =>{

  }, []);

  const handleClear = useCallback(() =>{

  }, []);

  const columns = useMemo<TableColumnsType<Member>>(() => [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '工号',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (value, record, index: number) => {

        console.log('部门: ', { value, record, index });

        return record._isEdit ? (
          <Input
            value={value}
            onChange={(e) => console.log('input: ', e.target.value)}
          />
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: '操作',
      key: 'operation',
      render: (value, record, index: number) => {

        console.log('操作: ', { value, record, index });

        return record._isEdit ? (
          <>
            <Button color="green" variant="outlined" size="small" className={styles['table-btn']} onClick={() => { handleSave(record) }}>{t('operation.save')}</Button>
            <Button size="small" className={styles['table-btn']} onClick={() => { handleCancel(record) }}>{t('operation.cancel')}</Button>
          </>
        ) : (
          <>
            <Button color="primary" variant="outlined" size="small" className={styles['table-btn']} onClick={() => { handleEdit(record) }}>{t('operation.edit')}</Button>
            <Popconfirm
              title="确认删除?"
              icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
              onConfirm={confirm}
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
  ], [t]);

  const setColumns = useCallback(() => {}, []);

  return { members, columns, setColumns, handleAdd, handleBulkDelete, handleClear };
}
