import React, { useMemo, useCallback, useState } from 'react';
import { Form, Input, InputNumber, Button, Checkbox, Popconfirm, Table, Tag, Image, Tooltip, App } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useAwardStore } from '@/store/award.ts';
import { useRecordStore } from '@/store/record.ts';
import { ADD, EDIT } from '@/config/constants.ts';
import defaultAwardUrl from '@/assets/images/default-award.png';

import styles from './styles.module.css';

import type { TableProps, TableColumnsType, FormInstance, CheckboxChangeEvent } from 'antd';
import type { Award } from '@/types/lottery';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export function useAward(form: FormInstance) {
  const { message } = App.useApp();
  const awards = useAwardStore((state) => state.awards);
  const create = useAwardStore((state) => state.create);
  const update = useAwardStore((state) => state.update);
  const remove = useAwardStore((state) => state.delete);
  const bulkRemove = useAwardStore((state) => state.bulkDelete);
  const clear = useAwardStore((state) => state.clear);

  const records = useRecordStore((state) => state.records);
  const bulkDeleteRecord = useRecordStore((state) => state.bulkDelete);

  const { t } = useTranslation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableRowSelection<Award> = {
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

  const handleAdd = useCallback(() => {
    const tempItem = {
      name: '',
      prize: '',
      url: null,
      count: 0,
      isFinished: false,
      allowRepeat: false,
      createdAt: Date.now(),
      _isEdit: true,
      _type: ADD,
    };

    create(tempItem);
  }, [create]);

  const handleEdit = useCallback((item: Award) => {
    const deepCloneItem = JSON.parse(JSON.stringify(item));

    update({ ...item, _backup: deepCloneItem, _isEdit: true, _type: EDIT });

    form.setFieldsValue({
      [item.id as number]: {
        name: item.name,
        prize: item.prize,
        url: item.url,
        count: item.count,
        isFinished: item.isFinished,
      },
    });
  }, [update, form]);

  const handleSave = useCallback(async (item: Award) => {
    const { _type, _backup, _isEdit, id, ...rest } = item;

    try {
      // 1. 🛡️ 严格模式：先触发表单的校验（防止用户漏填必填项，或者格式写错）
      // validateFields 传入嵌套路径，只校验并捞出当前这一行，不影响表格其他行，体验极好
      const rowValues = await form.validateFields([[id, 'name'], [id, 'prize'], [id, 'count']]);

      // 2. 🎯 定点爆破：直接从大盒子里，把当前行 ID 对应的最新表单值捞出来
      // 此时的 fields 干净得就像刚出生的婴儿：{ name: "最新的名字", dept: "最新的部门" }
      const fields = form.getFieldValue(id);

      console.log('handleSave: ', { rowValues, fields });

      const timestamp = Date.now();
      if (_type === ADD) {
        update({ id, ...rest, ...fields, createdAt: timestamp, updatedAt: timestamp });
      } else if (_type === EDIT) {
        update({ id, ...rest, ...fields, updatedAt: timestamp });
      }
    } catch (error) {
      // 🚀 核心：当表单被拦截时，我们主动把错误抓出来，啪的一下拍在屏幕最上方！
      if (error?.errorFields?.length > 0) {
        const firstError = error.errorFields[0].errors[0];
        message.error(`保存失败：${firstError || '请检查输入项！'}`);
      }
    }
  }, [form, update, message]);

  const handleCancel = useCallback((item: Award) => {
    const { _type, _backup, id } = item;

    if (_type === ADD) {
      remove(item);
    } else if (_type === EDIT) {
      update(_backup);
    }

    form.resetFields([id]);
  }, [remove, update, form]);

  const handleReplay = useCallback((item: Award) => {
    const targetRecords = records.filter(({ awardId }) => (awardId === item.id));
    const targetRecordIds = targetRecords.map((record) => record.id);
    bulkDeleteRecord(targetRecordIds as number[]);

    update({ ...item, isFinished: false });
  }, [bulkDeleteRecord, records, update]);

  const handleDelete = useCallback((item: Award) => {
    console.log('handleDelete: ', item);
    remove(item);
  }, [remove]);

  const handleBulkDelete = useCallback(() => {
    bulkRemove(selectedRowKeys);
  }, [bulkRemove, selectedRowKeys]);

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  const handleRepeat = useCallback((event: CheckboxChangeEvent, item: Award) => {
    const allowRepeat = event.target.checked ?? false;
    update({ ...item, allowRepeat });
  }, [update]);

  const columns = useMemo<TableColumnsType<Award>>(() => [
    {
      title: '奖项',
      dataIndex: 'name',
      key: 'name',
      render: (value, record, index: number) => {
        return record._isEdit ? (
          <Form.Item name={[record.id as number, 'name']} initialValue={value} className={styles['table-edit-item']}>
            <Input placeholder="请输入"/>
          </Form.Item>
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: '奖品',
      dataIndex: 'prize',
      key: 'prize',
      render: (value, record, index: number) => {
        return record._isEdit ? (
          <Form.Item name={[record.id as number, 'prize']} rules={[{ required: true, message: '' }]} initialValue={value} className={styles['table-edit-item']}>
            <Input placeholder="请输入"/>
          </Form.Item>
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: '预览',
      dataIndex: 'url',
      key: 'url',
      render: (value, record, index: number) => {
        return record._isEdit ? (
          <Form.Item name={[record.id as number, 'url']} initialValue={value} className={styles['table-edit-item']}>
            <Input placeholder="请输入"/>
          </Form.Item>
        ) : (
        <Image
          height={32}
          alt="basic"
          src={value}
          fallback={defaultAwardUrl}
        />
        );
      },
    },
    {
      title: '名额',
      dataIndex: 'count',
      key: 'count',
      render: (value, record, index: number) => {
        return record._isEdit ? (
          <Form.Item name={[record.id as number, 'count']} initialValue={value} className={styles['table-edit-item']}>
            <InputNumber mode="spinner" min={0} />
          </Form.Item>
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: () => {
        return (
          <>
            <>重复抽取 </>
            <Tooltip placement="top" title='是否允许已获奖人员继续抽取此奖项'>
              <QuestionCircleOutlined />
            </Tooltip>
          </>
        );
      },
      dataIndex: 'allowRepeat',
      key: 'allowRepeat',
      render: (value, record, index: number) => {
        return (
          <Checkbox checked={value} onChange={(e) => { handleRepeat(e, record) }} />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'isFinished',
      key: 'isFinished',
      render: (value, record, index: number) => {
        return value ? (
          <Tag color="success" variant="outlined">已开奖</Tag>
        ) : (
          <Tag color="processing" variant="outlined">未开奖</Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'end',
      width: 300,
      render: (value, record, index: number) => {
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
              onConfirm={() => { handleDelete(record) }}
              okButtonProps={{ danger: true }}
              okText="删除"
              cancelText="取消"
            >
              <Button color="danger" variant="outlined" size="small" className={styles['table-btn']}>{t('operation.delete')}</Button>
            </Popconfirm>
            {record.isFinished && <Popconfirm
              title="确认重新抽取?"
              icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
              onConfirm={() => { handleReplay(record) }}
              okButtonProps={{ danger: true }}
              okText="重新抽取"
              cancelText="取消"
            >
              <Button color="yellow" variant="outlined" size="small" className={styles['table-btn']}>{t('lottery.replay')}</Button>
            </Popconfirm>}
          </>
        );
      },
    },
  ], [handleRepeat, t, handleSave, handleCancel, handleEdit, handleDelete, handleReplay]);

  const ableBulkDelete = useMemo(() => {
    return selectedRowKeys.length > 0;
  }, [selectedRowKeys]);

  const ableClear = useMemo(() => {
    return awards.length > 0;
  }, [awards]);

  return { awards, columns, rowSelection, handleAdd, handleBulkDelete, handleClear, ableBulkDelete, ableClear };
}
