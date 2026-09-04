/// <reference types="vite/client" />

// 所有 .xlsx 模块导入后，返回的都是静态资源 URL 字符串.
declare module '*.xlsx' {
  const src: string;
  export default src;
}

declare module '*.xls' {
  const src: string;
  export default src;
}
