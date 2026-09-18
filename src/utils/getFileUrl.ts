import { consoleError } from '@/utils/console.ts';

/**
 * .
 *
 * @param file - .
 * @returns .
 */
function getFileUrl(file: File | string): string {
  if (!file) return '';

  if (typeof file === 'string') {
    return file;
  }

  if (file instanceof File) {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      consoleError('utils > getFileUrl', '生成文件 URL 失败', error);
      return '';
    }
  }

  return '';
}

export default getFileUrl;
