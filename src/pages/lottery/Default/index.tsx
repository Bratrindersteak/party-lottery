import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { useDefault } from './useDefault.ts';

import styles from './styles.module.css';

export default function Default() {
  const { t } = useTranslation();
  const { ableShow, ableClick, handleGoToAddData, handleUseDefaultData } = useDefault();

  return (
      <div className={`${styles.container} ${!ableShow && styles.hide}`}>
        <Button className={styles['button']}
                color="pink" variant="filled" size="large" disabled={!ableClick}
                onClick={handleGoToAddData}
        >{t('lottery.gotoAddMember')}</Button>
        <Button className={styles['button']}
                color="pink" variant="filled" size="large" disabled={!ableClick}
                onClick={handleUseDefaultData}
        >{t('lottery.useDefaultData')}</Button>
      </div>
  );
}
