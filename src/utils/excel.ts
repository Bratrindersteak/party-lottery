import * as XLSX from 'xlsx';

import type { RcFile } from 'antd/es/upload';
import type { Member } from '@/types/lottery.ts';

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
