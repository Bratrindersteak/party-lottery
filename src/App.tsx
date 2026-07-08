import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next'
import { ConfigProvider, App as AntDesign } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'

import './App.css'

import { useLotteryStore } from './store/lottery.ts'
import { useMemberStore } from '@/store/member.ts';
import { useMusicStore } from '@/store/music.ts';
import LotteryPage from './pages/lottery'
import Setting from '@/pages/setting/Setting.tsx'
import { LOTTERY, SETTING } from '@/config/constants.ts';

function App() {
  const init = useMemberStore((state) => state.init);
  const getMusics = useMusicStore((state) => state.getMusics);

  useEffect(() => {
    console.log('init 被调用~');
    init();
    getMusics();
  }, [init, getMusics]);


  const { i18n } = useTranslation()

  const antdLocale = useMemo(() => {
    switch (i18n.language) {
      case 'zhCN':
        return zhCN
      case 'enUS':
        return enUS
      default:
        // 🛡️ 防御性编程：如果管理员动态加了一门稀有语言（比如西班牙语），
        // antd 官方没有预载语言包，我们就默认回退到英文包，确保组件不崩溃
        return enUS
    }
  }, [i18n.language]) // 👈 绑定死语言看门狗

  const currentScreen = useLotteryStore((state) => state.currentScreen)

  return (
    <ConfigProvider locale={antdLocale}>
      <AntDesign>
        <div className="app-root" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          {/* 大屏抽奖页 */}
          <div style={{ display: currentScreen === LOTTERY ? 'block' : 'none', width: '100%', height: '100%' }}>
            <LotteryPage />
          </div>
          {/* 后台配置页 */}
          <div style={{ display: currentScreen === SETTING ? 'block' : 'none', width: '100%', height: '100%' }}>
            <Setting />
          </div>
        </div>
      </AntDesign>
    </ConfigProvider>
  )
}

export default App
