import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

interface InstructionProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function Instruction({ style }: InstructionProps) {
  const { t } = useTranslation();

  return (
    <div style={style}>
      <p>{t('instruction.paragraphs.0')}</p>
      <p>{t('instruction.paragraphs.1')}</p>
      <p>{t('instruction.paragraphs.2')}</p>
    </div>
  );
}

export default Instruction;
