/**
 * 🛡️ 工业级安全的临时 ID 生成器（无视 HTTP/HTTPS 环境限制）.
 *
 * @param prefix - 前缀字段.
 * @returns 临时ID.
 */
export function generateTempId(prefix: string = 'temp'): string {
  // 1. 如果支持现代原生 crypto，直接用最高级的
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return `${prefix}_${window.crypto.randomUUID()}`;
  }

  // 2. 🍂 如果是苦逼的 HTTP 环境，降级使用时间戳 + 随机数算法，也绝对够千人级用了
  const timestamp = Date.now().toString(36); // 转成36进制缩短长度
  const randomStr = Math.random().toString(36).substring(2, 8);

  return `${prefix}_${timestamp}_${randomStr}`;
}
