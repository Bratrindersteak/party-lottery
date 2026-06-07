import React, { useState } from 'react';
import { Table, Button, message, Upload, Popconfirm } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useColumns } from './useColumns.tsx';
import { parseExcel } from '@/utils/excel.ts';

import styles from './styles.module.css';

import type { TableProps, UploadProps, PopconfirmProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { Member } from '@/types/lottery';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

function MemberManagement() {
  const { t } = useTranslation();

  const [messageApi, messageHolder] = message.useMessage();

  const props: UploadProps = {
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
        const users = await parseExcel(file);

        // 3. 📦 兵分两路送进全局状态中心（和本地数据库）
        console.log('excel', users);
        // setExcelUsers(users)

        message.success({ content: `成功导入 ${users.length} 名员工！`, key: 'importing' })
      } catch (error) {
        message.error({ content: 'Excel 解析砸锅了，请检查格式！', key: 'importing' })
      }

      // 4. 💥 核心：死死咬住返回 false，坚决不让 antd 发起任何网络请求！
      return false;
    }, // ⚙️ 挂载拦截看门狗
    showUploadList: false,    // 既然不上传，我们可以隐藏那个自带的进度条列表
    onChange(info) {

      console.log('UploadPropsUploadProps', info);


      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        messageApi.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    messageApi.success('Click on Yes');
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    messageApi.error('Click on No');
  };

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

  const [columns] = useColumns(messageApi);

  const dataSource = Array.from({ length: 46 }).map<Member>((_, i) => ({
    key: `${i}`,
    employeeId: `employee-${i}`,
    name: `Edward King ${i}`,
    department: `London, Park Lane no. ${i}`,
  }));

  return (
    <>
      <div className={styles.operations}>
        {messageHolder}

        <Button type="primary" className={styles['operation-btn']}>{t('operation.add')}</Button>

        <Upload {...props}>
          <Button icon={<UploadOutlined />} color="green" variant="solid" className={styles['operation-btn']}>{t('member.excelImport')}</Button>
        </Upload>

        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger className={styles['operation-btn']}>{t('operation.bulkDelete')}</Button>
        </Popconfirm>

        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger className={styles['operation-btn']}>{t('operation.delete')}</Button>
        </Popconfirm>
      </div>
      <Table<Member> rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
    </>
  )
}

export default MemberManagement
