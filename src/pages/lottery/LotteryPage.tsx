import { useCallback } from 'react';
import { SettingOutlined } from '@ant-design/icons';

import { useLotteryStore } from '@/store/useLotteryStore.ts';
import { SETTING } from '@/config/constants.ts';

function LotteryPage() {
  const setScreen = useLotteryStore((state) => state.setScreen);

  const handleSetting = useCallback(() => {
    setScreen(SETTING);
  }, [setScreen]);

  return (
    <div>
      <SettingOutlined title="设置" onClick={handleSetting} />
    </div>
  )
}

export default LotteryPage;
