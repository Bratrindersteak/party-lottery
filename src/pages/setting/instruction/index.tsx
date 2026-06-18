import React from 'react';

import styles from './styles.module.css';

interface InstructionProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function Instruction({ style }: InstructionProps) {
  return (
    <div style={style}>Instruction</div>
  );
}

export default Instruction;
