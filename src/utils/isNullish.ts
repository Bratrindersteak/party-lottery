/**
 * 判断传入值是否为空值.
 *
 * @param value - 待判断的值.
 * @returns 判断结果.
 */
function isNullish(value: any): boolean {
  return value === undefined || value === null;
}

export default isNullish;
