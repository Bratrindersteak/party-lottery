import ExcelJS from 'exceljs';

import type { RcFile } from 'antd/es/upload';
import type { ExportColumns, Member } from '@/types/lottery.ts';

/**
 * 异步解析 Excel 文件.
 *
 * @param file - 成员数据文件.
 * @returns 成员数据.
 */
export async function parseExcel(file: RcFile): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    if (!file) resolve([]);

    const reader = new FileReader();
    // 把用户上传的文件以二进制阵列（ArrayBuffer）的形式读进内存.
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        // 实例化 ExcelJS 工作簿，并强行把二进制流啃下去.
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        // 捞出第一张工作表（也就是 HR 填写的名单表）.
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
          console.error('未找到有效的工作表（Sheet）！');
          return resolve([]);
        }

        // 1. 定义期望字段及可能匹配的表头别名（大小写与空格无关）
        const headerAliases: Record<keyof Omit<Member, 'id'> | 'employeeId', string[]> = {
          employeeId: ['工号', '员工工号', '员工编号', '编号', 'id', 'employeeId'],
          name: ['姓名', '名字', '员工姓名', '称呼', 'name'],
          department: ['部门', '所属部门', '架构', '部门名称', 'department'],
          avatar: ['头像', '头像地址', '头像链接', '照片', 'avatar'],
        };

        // 2. 扫描第 1 行建立列号映射：{ employeeId: 1, name: 2, ... }
        const colMap: Partial<Record<keyof Member, number>> = {};
        const headerRow = worksheet.getRow(1);

        headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          // 清理表头字符串：去除两侧空格并转小写
          const rawHeader = cell.text.trim().toLowerCase();

          if (!rawHeader) return;

          // 匹配别名
          for (const [field, aliases] of Object.entries(headerAliases)) {
            if (aliases.some(alias => alias.toLowerCase() === rawHeader)) {
              colMap[field as keyof Member] = colNumber;
              break;
            }
          }
        });

        // 校验是否至少识别到了关键字段（如：姓名）
        if (!colMap.name) {
          console.warn('未能识别到“姓名”列，请检查 Excel 表头！');
        }

        const members: Member[] = [];
        // 辅助获取指定列的纯文本内容.
        const getCellValue = (field: keyof Member, rowNumber: number): string => {
          const colIndex = colMap[field];
          if (!colIndex) return '';
          // 使用 getCell(colIndex).text 保证拿到的绝对是纯文本字符串
          return worksheet.getCell(rowNumber, colIndex).text.trim();
        };

        // 🚀 ④ 核心迭代：逐行扫描 Excel 单元格
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) { return } // 略过表头.

          const name = getCellValue('name', rowNumber);
          // 基础校验：如果没有姓名则跳过该有效行
          if (name) {
            const member: Member = {
              employeeId: getCellValue('employeeId', rowNumber),
              name,
              department: getCellValue('department', rowNumber) || '...',
              avatar: getCellValue('avatar', rowNumber),
            };
            members.push(member);
          }
        });

        resolve(members);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);
  });
}

/**
 * 将抽奖记录数据导出为 Excel 文件.
 *
 * @param data - 抽奖记录数据.
 */
export async function exportToExcel(data: ExportColumns[]) {
  // 1. 创建工作簿和工作表.
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('数据表');

  // 2. 设置表头.
  worksheet.columns = [
    { header: '奖项', key: 'award', width: 15 },
    { header: '工号', key: 'employeeId', width: 15 },
    { header: '姓名', key: 'name', width: 15 },
    { header: '部门', key: 'department', width: 20 },
  ];

  // 3. 添加数据.
  data.forEach(({ award, employeeId, name, department }) => {
    worksheet.addRow({ award, employeeId, name, department });
  });

  // 4. 加样式（设置表头背景色与加粗）.
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4F81BD' }
  };

  // 5. 生成 Buffer 并触发浏览器下载.
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `抽奖结果.xlsx`;
  anchor.click();

  // 6. 释放内存.
  window.URL.revokeObjectURL(url);
}
