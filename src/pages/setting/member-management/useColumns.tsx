import { useMemo } from 'react';
import { Input, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

import type { TableColumnsType, PopconfirmProps } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { Member } from '@/types/lottery';

export function useColumns(dataSource: Member[], setDataSource, message: MessageInstance) {
  const { t } = useTranslation();

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
  };

  const handleEdit = (record: Member) => {
    const newDataSource = dataSource.map((item: Member) =>
      item.id === record.id ? { ...item, _isEdit: true } : item,
    );
    setDataSource(newDataSource);
  };

  const handleSave = (record: Member) => {};

  const handleCancel = (record: Member) => {
    const { _type } = row;

    if (_type === 'add') {
      memberStore.remove(row, index);
    } else if (_type === 'update') {
      // 将备份的属性重新赋值给当前行.
      Object.assign(row, row._backup);
      Reflect.deleteProperty(row, '_isEdit');
      Reflect.deleteProperty(row, '_type');
      Reflect.deleteProperty(row, '_backup');
    }
  };

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
            <Button color="green" variant="outlined" size="small" className={styles['table-btn']} onClick={() => {
              handleSave(record);
            }}>{t('operation.save')}</Button>
            <Button size="small" className={styles['table-btn']} onClick={() => {
              handleCancel(record);
            }}>{t('operation.cancel')}</Button>
          </>
        ) : (
          <>
            <Button color="primary" variant="outlined" size="small" className={styles['table-btn']} onClick={() => {
              handleEdit(record);
            }}>{t('operation.edit')}</Button>
            <Popconfirm
              title="确认删除?"
              icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
              onConfirm={confirm}
              okButtonProps={{ danger: true }}
              okText="删除"
              cancelText="取消"
            >
              <Button color="danger" variant="outlined" size="small"
                      className={styles['table-btn']}>{t('operation.delete')}</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ], [t]);

  const setColumns = () => {
  };

  return [columns, setColumns] as const;
}
