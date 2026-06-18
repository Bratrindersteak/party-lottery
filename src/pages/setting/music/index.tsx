import React from 'react';

import styles from './styles.module.css';

interface MusicConfigProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function MusicConfig({ style }: MusicConfigProps) {
  return (
    <div style={style}>Music</div>
  );
}

export default MusicConfig;
