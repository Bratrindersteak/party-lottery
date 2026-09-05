import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { useLotteryStore } from '@/store/lottery.ts';
import { useLottery } from './useLottery.tsx';

import styles from './styles.module.css';

import Three from './three';
import Background from './background';
import AwardList from './AwardList';
import TopBar from './TopBar';
import Default from './Default';
import DemoList from './DemoList.tsx';

export default function Lottery() {
  const { t } = useTranslation();
  const title = useLotteryStore((state) => state.title);
  const {
    showEnter, showPlay, showFinish, showReplay,
    ableEnter, ablePlay, ableFinish, ableReplay,
    handleEnter, handlePlay, handleFinish, handleReplay, handleContinue,
  } = useLottery();

  return (
    <>
      <Three />
      <Background />
      {/*<AwardList />*/}
      <TopBar />
      <Default />
      <DemoList />

      <div className={styles['title']}>{title}</div>

      <div className={styles['operation-wrapper']}>
        <Button className={styles['operation-btn']} style={{ display: showEnter ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ableEnter}
                onClick={handleEnter}
        >{t('lottery.enter')}</Button>

        <Button className={styles['operation-btn']} style={{ display: showPlay ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ablePlay}
                onClick={handlePlay}
        >{t('lottery.play')}</Button>

        <Button className={styles['operation-btn']} style={{ display: showFinish ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ableFinish}
                onClick={handleFinish}
        >{t('lottery.finish')}</Button>

        <Button className={styles['operation-btn']} style={{ display: showReplay ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ableReplay}
                onClick={handleReplay}
        >{t('lottery.replay')}</Button>
        <Button className={styles['operation-btn']} style={{ display: showReplay ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ableReplay}
                onClick={handleContinue}
        >{t('lottery.continue')}</Button>
      </div>
    </>
  )
}
