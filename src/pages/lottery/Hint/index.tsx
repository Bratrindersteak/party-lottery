import { useTranslation } from 'react-i18next';

import { useHint } from './useHint.ts';

import styles from './styles.module.css';

export default function Hint() {
  const { t } = useTranslation();

  const { show, finished, currAwardName } = useHint();

  return (
    <div className={`${styles.hint} ${show && styles.show} ${finished && styles.finish}`}>
      <div className={styles.prefix}>{t('lottery.nowDrawing')}</div>
      <div className={styles['curr-award']}>{currAwardName}</div>

    </div>
  );
}
