import React, { useMemo, useCallback, useState } from 'react';
import { Form, Input, Button, Popconfirm, type UploadProps, Upload, Table, App, Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useMemberStore } from '@/store/member.ts';
import { parseExcel } from '@/utils/excel.ts';
import { triggerDownload } from '@/utils/download.ts';
import { generateTempId } from '@/utils/uuid.ts';
import { ADD, EDIT } from '@/config/constants.ts';
import defaultAwardUrl from '@/assets/images/default-award.png';

import styles from './styles.module.css';

import type { TableProps, TableColumnsType, FormInstance } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { Member } from '@/types/lottery';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export function useMember(form: FormInstance) {
  const { message } = App.useApp();
  const members = useMemberStore((state) => state.members);
  const get = useMemberStore((state) => state.get);
  const create = useMemberStore((state) => state.create);
  const createInMemory = useMemberStore((state) => state.createInMemory);
  const bulkCreate = useMemberStore((state) => state.bulkCreate);
  const update = useMemberStore((state) => state.update);
  const updateInMemory = useMemberStore((state) => state.updateInMemory);
  const remove = useMemberStore((state) => state.delete);
  const removeInMemory = useMemberStore((state) => state.deleteInMemory);
  const bulkRemove = useMemberStore((state) => state.bulkDelete);
  const clear = useMemberStore((state) => state.clear);
  const { t } = useTranslation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableRowSelection<Member> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
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

  const getMemberById = useCallback(async (id: number) => {
    return await get(id);
  }, [get]);

  const handleAdd = useCallback(() => {
    const tempItem = { id: generateTempId(), employeeId: '', name: '', department: '', createdAt: Date.now(), _isEdit: true, _type: ADD };

    createInMemory(tempItem);
  }, [createInMemory]);

  const handleEdit = useCallback((item: Member) => {
    const deepCloneItem = JSON.parse(JSON.stringify(item));

    updateInMemory({ ...item, _backup: deepCloneItem, _isEdit: true, _type: EDIT });

    form.setFieldsValue({
      [item.id as number]: {
        name: item.name,
        employeeId: item.employeeId,
        department: item.department,
      }
    });
  }, [updateInMemory, form]);

  const handleSave = useCallback(async (item: Member) => {
    const { _type, id } = item;

    try {
      // 触发表单校验（防止用户漏填必填项，或者格式写错），validateFields 传入嵌套路径，只校验并捞出当前这一行，不影响表格其他行，体验极好.
      await form.validateFields([[id, 'name'], [id, 'employeeId'], [id, 'department']]);

      // 把当前行 ID 对应的最新表单值捞出来.
      const fields = form.getFieldValue(id);
      const timestamp = Date.now();
      if (_type === ADD) {
        create({ ...item, ...fields, createdAt: timestamp, updatedAt: timestamp });
      } else if (_type === EDIT) {
        update({ ...item, ...fields, updatedAt: timestamp });
      }
    } catch (error) {
      if (error?.errorFields?.length > 0) {
        const firstError = error.errorFields[0].errors[0];
        message.error(`保存失败：${firstError || '请检查输入项！'}`);
      }
    }
  }, [form, create, update, message]);

  const handleCancel = useCallback((item: Member) => {
    const { _type, _backup, id } = item;

    if (_type === ADD) {
      removeInMemory(item);
    } else if (_type === EDIT) {
      updateInMemory(_backup as Member);
    }

    form.resetFields([id]);
  }, [removeInMemory, updateInMemory, form]);

  const handleDelete = useCallback((item: Member) => {
    console.log('handleDelete: ', item);
    remove(item);
  }, [remove]);

  const handleBulkDelete = useCallback(() => {
    if (selectedRowKeys.length < 1) {
      message.error('请勾选删除项！');
      return;
    }

    bulkRemove(selectedRowKeys);
  }, [bulkRemove, message, selectedRowKeys]);

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  const handleDownloadTemplate = useCallback(() => {
    triggerDownload('./excels/template.xlsx', `${t('message.member.fileTemplate')}.xlsx`);
  }, [t]);

  const uploadProps = useMemo<UploadProps<never>>(() => ({
    accept: '.xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel', // 浏览器文件选择框层面的防御.
    maxCount: 1, // 每次只允许传一个文件.
    beforeUpload: async (file: RcFile, fileList: RcFile[]) => {
      // 1. 先验一下是不是 Excel 文件，防止误传一张照片进来.
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls');

      if (!isExcel) {
        message.error(t('message.member.fileTypeError'));
        return Upload.LIST_IGNORE; // 告诉 antd 直接在上传列表里把这货抹去.
      }

      try {
        // 2. 调用解析工具.
        message.loading({ content: t('message.member.fileParsing'), key: 'importing' })
        const members = await parseExcel(file);
        const timestamp = Date.now();
        const newMembers = members.map(member => ({ ...member, createdAt: timestamp, updatedAt: timestamp }));

        await bulkCreate(newMembers);
        message.success({ content: t('message.member.fileImportSuccess', { count: members.length }), key: 'importing' });
      } catch (error) {
        message.error({ content: 'Excel文件解析失败！', key: 'importing' });
      }
      // 4. 返回 false，坚决不让 antd 发起任何网络请求！
      return false;
    },
    showUploadList: false, // 既然不上传，隐藏自带的进度条列表.
  }), [bulkCreate, message, t]);

  const columns = useMemo<TableColumnsType<Member>>(() => [
    {
      title: t('columns.name'),
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => {
        return record._isEdit ? (
          <Form.Item name={[record.id as number, 'name']} initialValue={value} className={styles['table-edit-item']}>
            <Input placeholder={t('pleaseInput')} />
          </Form.Item>
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: t('columns.avatar'),
      dataIndex: 'avatar',
      key: 'avatar',
      render: (value, record) => {
        return record._isEdit ? (
          <Form.Item name={[record.id as number, 'avatar']} initialValue={value} className={styles['table-edit-item']}>
            <Input placeholder={t('pleaseInput')} />
          </Form.Item>
        ) : (
          <Image
            height={32}
            referrerPolicy="no-referrer"
            src={value || undefined}
            fallback={defaultAwardUrl}
          />
        );
      },
    },
    {
      title: t('columns.employeeId'),
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (value, record) => {
        return record._isEdit ? (
          <Form.Item name={[record.id as number, 'employeeId']} rules={[{ required: true, message: '' }]} initialValue={value} className={styles['table-edit-item']}>
            <Input placeholder={t('pleaseInput')} />
          </Form.Item>
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: t('columns.department'),
      dataIndex: 'department',
      key: 'department',
      render: (value, record) => {
        return record._isEdit ? (
          <Form.Item name={[record.id as number, 'department']} initialValue={value} className={styles['table-edit-item']}>
            <Input placeholder={t('pleaseInput')} />
          </Form.Item>
        ) : (
          <>{value}</>
        );
      },
    },
    {
      title: t('columns.operation'),
      key: 'operation',
      fixed: 'end',
      width: 200,
      render: (_, record) => {
        return record._isEdit ? (
          <>
            <Button color="green" variant="outlined" size="small" className={styles['table-btn']} onClick={() => { handleSave(record) }}>{t('operation.save')}</Button>
            <Button size="small" className={styles['table-btn']} onClick={() => { handleCancel(record) }}>{t('operation.cancel')}</Button>
          </>
        ) : (
          <>
            <Button color="primary" variant="outlined" size="small" className={styles['table-btn']} onClick={() => { handleEdit(record) }}>{t('operation.edit')}</Button>
            <Popconfirm
              title={t('operation.confirm_delete')}
              icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
              onConfirm={() => { handleDelete(record) }}
              okButtonProps={{ danger: true }}
              okText={t('operation.delete')}
              cancelText={t('operation.cancel')}
            >
              <Button color="danger" variant="outlined" size="small" className={styles['table-btn']}>{t('operation.delete')}</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ], [t, handleSave, handleCancel, handleEdit, handleDelete]);

  const setColumns = useCallback(() => {}, []);

  // 按创建时间倒序排列.
  const sortedMembers = useMemo(() => {
    return [...members].sort((a: Member, b: Member) => {
      // 让最新创建的（createdAt 大的）排在前面.
      const timeA = Number(a.createdAt) || 0;
      const timeB = Number(b.createdAt) || 0;
      return timeB - timeA;
    });
  }, [members]);

  const ableBulkDelete = useMemo(() => {
    return selectedRowKeys.length > 0;
  }, [selectedRowKeys]);

  const ableClear = useMemo(() => {
    return members.length > 0;
  }, [members]);

  return { sortedMembers, columns, setColumns, rowSelection, uploadProps, getMemberById, handleDownloadTemplate, handleAdd, handleBulkDelete, handleClear, ableBulkDelete, ableClear };
}
