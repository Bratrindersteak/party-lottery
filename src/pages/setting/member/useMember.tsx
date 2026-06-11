import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Popconfirm, type UploadProps, message, Upload } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useMemberStore } from '@/store/member.ts';
import { parseExcel } from '@/utils/excel.ts';
import { generateTempId } from '@/utils/uuid.ts';

import styles from './styles.module.css';

import type { TableColumnsType, PopconfirmProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { Member } from '@/types/lottery';

export function useMember(form) {
  const members = useMemberStore((state) => state.members);
  const init = useMemberStore((state) => state.init);
  const create = useMemberStore((state) => state.create);
  const bulkCreate = useMemberStore((state) => state.bulkCreate);
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

  const [messageApi, messageHolder] = message.useMessage();

  const handleAdd = useCallback(() => {
    const tempItem = { id: generateTempId(), employeeId: '', name: '', department: '', _isEdit: true, _type: 'add' };

    create(tempItem);
  }, [create]);

  const handleEdit = useCallback((item: Member) => {

  }, []);

  const handleSave = useCallback(async (item: Member) => {
    const { _type, id } = item;

    try {
      // 1. 🛡️ 严格模式：先触发表单的校验（防止用户漏填必填项，或者格式写错）
      // validateFields 传入嵌套路径，只校验并捞出当前这一行，不影响表格其他行，体验极好
      const rowValues = await form.validateFields([[id, 'name'], [id, 'dept']]);

      // 2. 🎯 定点爆破：直接从大盒子里，把当前行 ID 对应的最新表单值捞出来
      // 此时的 fields 干净得就像刚出生的婴儿：{ name: "最新的名字", dept: "最新的部门" }
      const fields = form.getFieldValue(id);

      // 3. 🚀 呼叫我们上一轮焊死的 saveAction，物理写盘，顺便关闭编辑状态
      // await saveMember(id, fields);

      console.log('handleSave: ', { rowValues, fields });

      // if (_type === 'add') {
      //   create({ ...item, _isEdit: false });
      // } else if (_type === 'edit') {
      //   update(item);
      // }

    } catch (error) {
      // 如果表单校验失败（比如名字没填），会卡在这里，并自动弹出红字提示，绝不往下走
      console.error('表单校验或保存失败:', error);
    }




  }, [create, update]);

  const handleCancel = useCallback((item: Member) => {
    const { _type, _backup } = item;

    if (_type === 'add') {
      remove(item);
    } else if (_type === 'edit') {
      update(_backup);
    }
  }, [remove, update]);

  const handleDelete = useCallback((item: Member) => {
    console.log('handleDelete: ', item);
  }, []);

  const handleBulkDelete = useCallback((selectedRowKeys: React.Key[]) =>{
    console.log('handleBulkDelete: ', selectedRowKeys);
  }, []);

  const handleClear = useCallback(() =>{

  }, []);

  const uploadProps = useMemo<UploadProps<never>>(() => ({
    accept: '.xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',      // 浏览器文件选择框层面的防御
    maxCount: 1,              // 每次只允许传一个文件
    beforeUpload: async (file: RcFile, fileList: RcFile[]) => {
      // 1. 🛡️ 严格看门狗：先验一下是不是 Excel 文件，防止 HR 误传一张照片进来
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')

      if (!isExcel) {
        message.error('兄弟，只能传 Excel 文件（.xlsx 或 .xls）哦！')
        return Upload.LIST_IGNORE // 告诉 antd 直接在上传列表里把这货抹去
      }

      try {
        // 2. ⚡ 趁热打铁：直接调用我们写好的解析工具
        message.loading({ content: '正在拼命解析千人名单...', key: 'importing' })
        const members = await parseExcel(file);

        // 3. 📦 兵分两路送进全局状态中心（和本地数据库）
        console.log('excel', members);
        await bulkCreate(members);
        message.success({ content: `成功导入${members.length}人！`, key: 'importing' });
      } catch (error) {
        message.error({ content: 'Excel 解析砸锅了，请检查格式！', key: 'importing' });
      }

      // 4. 💥 核心：死死咬住返回 false，坚决不让 antd 发起任何网络请求！
      return false;
    }, // ⚙️ 挂载拦截看门狗
    showUploadList: false,    // 既然不上传，我们可以隐藏那个自带的进度条列表
  }), []);

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
            // name 用 [id, 'name'] 的数组形式，Antd 会自动把它拼成独立的一行数据
            <Form.Item name={[record.id, 'name']} initialValue={value} style={{ margin: 0 }}>
              <Input />
            </Form.Item>

          // <Input
          //   value={value}
          //   onChange={(e) => console.log('input: ', e.target.value)}
          // />
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
  ], [t]);

  const setColumns = useCallback(() => {}, []);

  return { members, columns, setColumns, uploadProps, handleAdd, handleBulkDelete, handleClear, messageHolder };
}
