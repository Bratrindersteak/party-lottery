import { useMemo } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

import type { TableColumnsType, PopconfirmProps } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface'
import type { Member } from '@/types/lottery';

export function useColumns(message: MessageInstance) {
  const { t } = useTranslation();

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
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
    },
    {
      title: '操作',
      key: 'operation',
      render: () => (
        <>
          <Button type="primary" size="small" className={styles['operation-btn']}>{t('operation.edit')}</Button>
          <Popconfirm
            title="确认删除?"
            icon={<DeleteOutlined style={{color: '#F56C6C'}} />}
            onConfirm={confirm}
            okButtonProps={{ danger: true }}
            okText="删除"
            cancelText="取消"
          >
            <Button type="primary" danger size="small" className={styles['operation-btn']}>{t('operation.delete')}</Button>
          </Popconfirm>
        </>
      ),
    },
  ], [t]);

  const setColumns = () => {};

  return [columns, setColumns] as const;
}
