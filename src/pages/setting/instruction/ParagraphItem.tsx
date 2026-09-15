import React from 'react';
import styles from './styles.module.css';

export interface ParagraphNode {
  title: string;
  content: string;
  children?: ParagraphNode[];
}

interface ParagraphItemProps {
  data: ParagraphNode;
  level?: number; // 用于按层级动态调整 <h2>, <h3>, <h4> 等标签.
}

export const ParagraphItem: React.FC<ParagraphItemProps> = ({ data, level = 2 }) => {
  // 根据递归层级动态生成标题标签（如 h2, h3, h4...），最大限制到 h6.
  const HeadingTag = `h${Math.min(level, 6)}` as React.ElementType;

  return (
    <div className={`${styles['paragraph']} ${styles[`level${level}`]}`}>
      {/* 动态渲染对应层级的标题. */}
      {data.title && (
        <HeadingTag className={`${styles['title']} ${styles[`h${Math.min(level, 6)}`]}`}>
          {data.title}
        </HeadingTag>
      )}

      {data.content && (
        <p className={styles['content']}>{data.content}</p>
      )}

      {/* 2. 递归出口与下钻：如果有 children 且不为空，继续递归渲染. */}
      {data.children && data.children.length > 0 && (
        <div className={styles['paragraph']}>
          {data.children.map((childNode, index) => (
            <ParagraphItem key={index} data={childNode} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
