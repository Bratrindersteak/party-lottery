import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

const resources = {
  zhCN: {
    translation: zhCN,
  },
  enUS: {
    translation: enUS,
  },
}

// 🚀 核心防御：开机时，先人肉去读取一手 Zustand 焊在 localStorage 里的语言缓存
const getInitialLanguage = (): string => {
  try {
    const storageStr = localStorage.getItem('party-lottery-setting');
    if (storageStr) {
      const { state } = JSON.parse(storageStr);
      return state.language || 'zhCN';
    }
  } catch (e) {
    console.error("读取Zustand语言缓存失败：", e);
  }
  return 'zhCN';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(), // 默认语言
    fallbackLng: 'zhCN',
    interpolation: {
      escapeValue: false, // React 天生防 XSS，这里关掉即可
    },
  })

export default i18n
