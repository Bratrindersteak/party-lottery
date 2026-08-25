import styles from './styles.module.css';

export default function Background() {
  return (
    <div className={styles.universeContainer}>
      {/* 三层不同大小、不同闪烁周期的粒子图层 */}
      <div className={`${styles.stars} ${styles.starsSmall}`} />
      <div className={`${styles.stars} ${styles.starsMedium}`} />
      <div className={`${styles.stars} ${styles.starsLarge}`} />

      {/* 纯 CSS 流星层（不同位置与延迟） */}
      <div className={styles.meteorContainer}>
        <div className={`${styles.meteor} ${styles.m1}`} />
        <div className={`${styles.meteor} ${styles.m2}`} />
        <div className={`${styles.meteor} ${styles.m3}`} />
        <div className={`${styles.meteor} ${styles.m4}`} />
        <div className={`${styles.meteor} ${styles.m5}`} />
      </div>

      {/* 迷离星云背景层 */}
      <div className={styles.nebulaCloud} />
    </div>
  );
}
