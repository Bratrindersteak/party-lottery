import { useCallback, useState } from 'react';
import { Button, Image, Tag } from 'antd';
import { LeftOutlined, RightOutlined, SettingOutlined, AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useAwardStore } from '@/store/award.ts';
import { useLotteryStore } from '@/store/lottery.ts';
import { useSettingStore } from '@/store/setting.ts';
import { SETTING, INIT, READY, RUNNING, FINISHED } from '@/config/constants.ts';
import defaultAwardUrl from '@/assets/images/default-award.png';
import { useLottery } from './useLottery.tsx';

import styles from './styles.module.css';

import Three from './three';
import Background from './background';

import type { Award } from '@/types/lottery.ts';

function LotteryPage() {
  const { currAward, handleEnter, handlePlay, handleFinish, handleReplay } = useLottery();

  const { t, i18n } = useTranslation();

  const setScreen = useLotteryStore((state) => state.setScreen);
  const title = useLotteryStore((state) => state.title);
  const currAwardId = useLotteryStore((state) => state.currAwardId);
  const setCurrAwardId = useLotteryStore((state) => state.setCurrAwardId);
  const lotteryStatus = useLotteryStore((state) => state.lotteryStatus);

  const mute = useSettingStore((state) => state.mute);
  const setMute = useSettingStore((state) => state.setMute);
  const setLanguage = useSettingStore((state) => state.setLanguage);

  const awards = useAwardStore((state) => state.awards);

  const handleSetting = useCallback(() => {
    setScreen(SETTING);
  }, [setScreen]);

  const [awardHandle, setAwardHandle] = useState<boolean>(true);

  const handleAwardClick = useCallback((award: Award) => {
    setCurrAwardId(award.id as number);
  }, [setCurrAwardId]);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }, [setLanguage, i18n]);

  const handleMute = useCallback(() => {
    setMute(!mute);
  }, [mute, setMute]);

  return (
    <>
      <Three />
      <Background />

      <div className={styles['top-bar']}>
        <div className={styles['music']} onClick={handleMute}>
          { mute ? <AudioMutedOutlined /> : <AudioOutlined />}
        </div>
        <div className={styles.languages}>
          <span className={`${styles.language} ${styles.cn} ${i18n.language === 'zhCN' ? styles.active : '' }`} onClick={() => { handleLanguageChange('zhCN') }}>中</span>
          <span className={styles.separator}>&nbsp;/&nbsp;</span>
          <span className={`${styles.language} ${styles.en} ${i18n.language === 'enUS' ? styles.active : '' }`} onClick={() => { handleLanguageChange('enUS') }}>EN</span>
        </div>
        <SettingOutlined className={styles.setting} title="设置" onClick={handleSetting} />
      </div>

      <div className={styles['title']}>{title}</div>

      <Button className={styles['operation-btn']} style={{ display: lotteryStatus === INIT ? 'block' : 'none' }} color="pink" variant="filled" size="large" onClick={handleEnter}>{t('lottery.enter')}</Button>
      <Button className={styles['operation-btn']} style={{ display: lotteryStatus === READY ? 'block' : 'none' }} color="pink" variant="filled" size="large" onClick={handlePlay} disabled={!!(currAward && currAward.isFinished)}>{t('lottery.play')}</Button>
      <Button className={styles['operation-btn']} style={{ display: lotteryStatus === RUNNING ? 'block' : 'none' }} color="pink" variant="filled" size="large" onClick={handleFinish} disabled={!!(currAward && currAward.isFinished)}>{t('lottery.finish')}</Button>
      <Button className={styles['operation-btn']} style={{ display: lotteryStatus === FINISHED ? 'block' : 'none' }} color="pink" variant="filled" size="large" onClick={handleReplay} disabled={!!(currAward && !currAward.isFinished)}>{t('lottery.replay')}</Button>

      <div className={styles['award-drawer']}>
        <ul className={`${styles['award-list']} ${awardHandle ? styles['award-closed'] : ''}`}>
          {awards.map((award) => (
            // 🚨 注意：这里必须显式绑定一个全局唯一的 key！
            <li key={award.id} className={`${styles['award-item']} ${currAwardId === award.id ? styles['award-active'] : ''}`} onClick={() => handleAwardClick(award)}>
              <div className={styles['award-left']}>
                <Image
                  className={styles['award-image']}
                  alt="basic image"
                  width={80}
                  src={award.url}
                  fallback={defaultAwardUrl}
                />
              </div>
              <div className={styles['award-right']}>
                <div className={styles['award-title']}>{award.name}</div>
                <div className={styles['award-content']}>
                  <div className={styles['award-prize']}>{award.prize}</div>
                  <div className={styles['award-count']}>{award.count}名</div>
                </div>
              </div>
              <Tag className={styles['award-status']} color={award.isFinished ? 'lime' : 'cyan'} variant="outlined">{award.isFinished ? '已开奖' : '进行中'}</Tag>
            </li>
          ))}
        </ul>
        <div className={styles['award-handle']} onClick={() => setAwardHandle(!awardHandle)}>
          {awardHandle ? <RightOutlined/> : <LeftOutlined/>}
        </div>
      </div>
    </>
  )
}

export default LotteryPage;
