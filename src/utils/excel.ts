import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

import type { RcFile } from 'antd/es/upload';
import type { Member } from '@/types/lottery.ts';

/**
 * 异步解析 Excel 文件.
 *
 * @param file - .
 * @returns .
 */
export async function parseExcel2(file: RcFile): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    if (!file) resolve([]);

    const reader = new FileReader();

    // ① 把用户上传的文件以二进制阵列（ArrayBuffer）的形式读进内存
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;

        // ② 实例化 ExcelJS 工作簿，并强行把二进制流啃下去
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        // ③ 捞出第一张工作表（也就是 HR 填写的名单表）
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
          throw new Error('未找到有效的工作表（Sheet）！');
        }

        const resultData: Member[] = [];

        // 🚀 ④ 核心迭代：逐行扫描 Excel 单元格
        worksheet.eachRow((row, rowNumber) => {

          console.log('row: ', row);

          // 💡 防御心智：第一行通常是表头（"工号"、"姓名"、"部门"），直接略过
          if (rowNumber === 1) return;

          // 捞出每一列的单元格原始值
          // 🚨 隐形地雷：ExcelJS 的 values 数组下标是从 1 开始的！
          const rowValues = row.values as any[];

          if (rowValues && rowValues.length > 0) {
            // 揉成规规矩矩的 JSON 对象
            const member: Member = {
              employeeId: String(rowValues[1] || '').trim(),     // 第一列：工号
              name: String(rowValues[2] || '').trim(),       // 第二列：姓名
              department: String(rowValues[3] || '').trim(), // 第三列：部门
            };

            // 过滤掉那些空行
            if (member.employeeId && member.name) {
              resultData.push(member);
            }
          }
        });

        console.log('resultData: ', resultData);

        resolve(resultData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);
  });
}

/**
 * 异步解析 Excel 文件.
 *
 * @param file - .
 * @returns .
 */
export async function parseExcel(file: RcFile): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    if (!file) resolve([]);

    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      try {
        const data = e.target?.result;

        // 1. 读取工作簿
        const workbook = XLSX.read(data, { type: 'array' });

        // 2. 获取第一个 Sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 3. 转换为 JSON
        const rawJson: Member[] = XLSX.utils.sheet_to_json(worksheet);

        // 4. 执行你的格式化逻辑 (假设 formatData 是同步的)
        formatData(rawJson);

        console.log('解析并格式化后的数据：', rawJson);
        resolve(rawJson);
      } catch (error) {
        reject(new Error('Excel 解析失败'));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
  });
}

export function formatData(data) {

}
