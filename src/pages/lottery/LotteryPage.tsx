import { useCallback } from 'react';
import { SettingOutlined } from '@ant-design/icons';

import { useLotteryStore } from '@/store/useLotteryStore.ts';
import { SETTING } from '@/config/constants.ts';

import styles from './styles.module.css';

function LotteryPage() {
  const setScreen = useLotteryStore((state) => state.setScreen);

  const handleSetting = useCallback(() => {
    setScreen(SETTING);
  }, [setScreen]);

  return (
    <div>
      <SettingOutlined className={styles.setting} title="设置" onClick={handleSetting} />
    </div>
  )
}

export default LotteryPage;
