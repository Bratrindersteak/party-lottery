import { useCallback, useState } from 'react';
import { Image, Tag } from 'antd';
import { LeftOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';

import { useAwardStore } from '@/store/award.ts';
import { useLotteryStore } from '@/store/lottery.ts';
import { SETTING } from '@/config/constants.ts';
import defaultAwardUrl from '@/assets/images/default-award.png';

import styles from './styles.module.css';

function LotteryPage() {
  const setScreen = useLotteryStore((state) => state.setScreen);

  const awards = useAwardStore((state) => state.awards);

  const handleSetting = useCallback(() => {
    setScreen(SETTING);
  }, [setScreen]);

  const [awardHandle, setAwardHandle] = useState<boolean>(false);
  const [activeAwardId, setActiveAwardId] = useState<number | null>(null);

  const handleAwardClick = useCallback((award) => {
    // TODO 其他操作，比如改变当前抽取奖项的状态.

    setActiveAwardId(award.id);
  }, [setActiveAwardId]);

  return (
    <div>
      <SettingOutlined className={styles.setting} title="设置" onClick={handleSetting} />

      <div className={styles['award-drawer']}>
        <ul className={`${styles['award-list']} ${awardHandle ? styles['award-closed'] : ''}`}>
          {awards.map((award) => (
            // 🚨 注意：这里必须显式绑定一个全局唯一的 key！
            <li key={award.id} className={`${styles['award-item']} ${activeAwardId === award.id ? styles['award-active'] : ''}`} onClick={() => handleAwardClick(award)}>
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

    </div>
  )
}

export default LotteryPage;
