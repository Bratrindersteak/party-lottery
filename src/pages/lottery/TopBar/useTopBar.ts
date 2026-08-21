import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useLotteryStore } from '@/store/lottery.ts';
import { useSettingStore } from '@/store/setting.ts';
import { SETTING } from '@/config/constants.ts';

export function useTopBar() {
  const { i18n } = useTranslation();

  const mute = useSettingStore((state) => state.mute);
  const setMute = useSettingStore((state) => state.setMute);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  const setScreen = useLotteryStore((state) => state.setScreen);

  const handleSetting = useCallback(() => {
    setScreen(SETTING);
  }, [setScreen]);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }, [setLanguage, i18n]);

  const handleMute = useCallback(() => {
    setMute(!mute);
  }, [mute, setMute]);

  return { handleMute, handleLanguageChange, handleSetting };
}
