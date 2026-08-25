import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { useLotteryStore } from '@/store/lottery.ts';
import { INIT, READY, RUNNING, FINISHED } from '@/config/constants.ts';
import { useLottery } from './useLottery.tsx';

import styles from './styles.module.css';

import Three from './three';
import Background from './background';
import AwardList from './AwardList';
import TopBar from './TopBar';

export default function Lottery() {
  const { t } = useTranslation();
  const title = useLotteryStore((state) => state.title);
  const lotteryStatus = useLotteryStore((state) => state.lotteryStatus);
  const {
    ableEnter, ablePlay, ableFinish, ableReplay,
    handleEnter, handlePlay, handleFinish, handleReplay, handleContinue,
  } = useLottery();

  return (
    <>
      <Three />
      <Background />
      <AwardList />
      <TopBar />

      <div className={styles['title']}>{title}</div>

      <div className={styles['operation-wrapper']}>
        <Button className={styles['operation-btn']} style={{ display: lotteryStatus === INIT ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ableEnter}
                onClick={handleEnter}
        >{t('lottery.enter')}</Button>

        <Button className={styles['operation-btn']} style={{ display: lotteryStatus === READY ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ablePlay}
                onClick={handlePlay}
        >{t('lottery.play')}</Button>

        <Button className={styles['operation-btn']} style={{ display: lotteryStatus === RUNNING ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ableFinish}
                onClick={handleFinish}
        >{t('lottery.finish')}</Button>

        <Button className={styles['operation-btn']} style={{ display: lotteryStatus === FINISHED ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ableReplay}
                onClick={handleReplay}
        >{t('lottery.replay')}</Button>
        <Button className={styles['operation-btn']} style={{ display: lotteryStatus === FINISHED ? 'block' : 'none' }}
                color="pink" variant="filled" size="large" disabled={!ableReplay}
                onClick={handleContinue}
        >{t('lottery.continue')}</Button>
      </div>
    </>
  )
}
