import type { MessageInstance } from 'antd/es/message/interface';
import { App } from 'antd';

let message: MessageInstance;

// 这个组件专门放在 App 下面用来捕获静态实例
export default function AntdStaticHolder() {
  const staticFunctions = App.useApp();
  message = staticFunctions.message; // 赋值给全局变量
  return null;
}

export { message };
