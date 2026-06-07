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

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zhCN', // 默认语言
    fallbackLng: 'zhCN',
    interpolation: {
      escapeValue: false, // React 天生防 XSS，这里关掉即可
    },
  })

export default i18n
