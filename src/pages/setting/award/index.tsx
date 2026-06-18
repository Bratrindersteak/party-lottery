import React from 'react';

import styles from './styles.module.css';

interface AwardConfigProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function AwardConfig({ style }: AwardConfigProps) {
  return (
    <div style={style}>Award</div>
  );
}

export default AwardConfig;
