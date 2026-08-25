import { AudioMutedOutlined, AudioOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useSettingStore } from '@/store/setting.ts';
import { useTopBar } from './useTopBar.ts';

import styles from './styles.module.css';

export default function TopBar() {
  const { t, i18n } = useTranslation();

  const mute = useSettingStore((state) => state.mute);

  const { handleMute, handleLanguageChange, handleSetting } = useTopBar();

  return (
    <div className={styles['top-bar']}>
      <div className={styles['music']} title={ mute ? t('music.mute') : t('music.play') } onClick={handleMute}>
        {mute ? <AudioMutedOutlined /> : <AudioOutlined />}
      </div>
      <div className={styles.languages}>
        <span className={`${styles.language} ${styles.cn} ${i18n.language === 'zhCN' ? styles.active : '' }`} onClick={() => { handleLanguageChange('zhCN') }}>中</span>
        <span className={styles.separator}>&nbsp;/&nbsp;</span>
        <span className={`${styles.language} ${styles.en} ${i18n.language === 'enUS' ? styles.active : '' }`} onClick={() => { handleLanguageChange('enUS') }}>EN</span>
      </div>
      <SettingOutlined className={styles.setting} title={t('setting')} onClick={handleSetting} />
    </div>
  );
}
