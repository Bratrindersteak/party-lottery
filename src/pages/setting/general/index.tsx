import React from 'react';

import styles from './styles.module.css';

// 🚀 1. 严密声明：告诉 TS，我的组件现在合规接收 style 属性了
interface GeneralConfigProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function GeneralConfig({ style }: GeneralConfigProps) {
  return (
    <div style={style}>General</div>
  );
}

export default GeneralConfig;
