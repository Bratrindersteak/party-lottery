/**
 * 格式化控制台错误输出.
 *
 * @param module - 模块路径.
 * @param message - 描述信息.
 * @param error - 原始错误对象或数据.
 */
export function consoleError(module: string, message: string, error?: unknown) {
  console.error(
    `%c ${module} %c ${message}`,
    // 模块 Tag 样式（深红色徽章）.
    'background-color: #ff4d4f; color: #ffffff; padding: 2px 0px; border-radius: 3px 0 0 3px; font-weight: bold;',
    // 消息内容样式（暗背景红字）.
    'background-color: #fff2f0; color: #ff4d4f; padding: 1px 6px 1px 0px; border-radius: 0 3px 3px 0; border: 1px solid #ffccc7; border-left-width: 0;',
    error ?? ''
  );
}
