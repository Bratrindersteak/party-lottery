import React from 'react';

import styles from './styles.module.css';

interface AwardRecordProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function AwardRecord({ style }: AwardRecordProps) {
  return (
    <div style={style}>Record</div>
  );
}

export default AwardRecord;
