import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

interface InstructionProps {
  style?: React.CSSProperties; // 🎯 这里的 CSSProperties 就是 style 的正宗类型
}

function Instruction({ style }: InstructionProps) {
  const { t } = useTranslation();

  const paragraphs = t('instruction.paragraphs', { returnObjects: true }) as Array<{ title: string; content: string }>;

  return (
    <div style={style}>
      <h1 className={styles.title}>{t('instruction.h1')}</h1>
      {paragraphs.map((paragraph, index) => (
        <React.Fragment key={index}>
          <h2>{paragraph.title}</h2>
          <p>{paragraph.content}</p>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Instruction;
