import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { Button, Popconfirm, Table, Tag, type UploadProps, Upload, App } from 'antd';
import { DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useMusicStore } from '@/store/music.ts';
import { OPENING_MUSIC, LOTTERY_MUSIC, WINNING_MUSIC } from '@/config/constants.ts';

import styles from './styles.module.css';

import type { TableProps, TableColumnsType } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { Music } from '@/types/lottery';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export function useMusic() {
  const { message } = App.useApp();
  const musics = useMusicStore((state) => state.musics);
  const openingId = useMusicStore((state) => state.openingId);
  const lotteryId = useMusicStore((state) => state.lotteryId);
  const winningId = useMusicStore((state) => state.winningId);
  const setMusic = useMusicStore((state) => state.setMusic);
  const create = useMusicStore((state) => state.create);
  const remove = useMusicStore((state) => state.delete);
  const bulkRemove = useMusicStore((state) => state.bulkDelete);
  const clear = useMusicStore((state) => state.clear);

  const handleOpeningChange = useCallback((id: number) => {
    setMusic(OPENING_MUSIC, id);
  }, [setMusic]);

  const handleLotteryChange = useCallback((id: number) => {
    setMusic(LOTTERY_MUSIC, id);
  }, [setMusic]);

  const handleWinningChange = useCallback((id: number) => {
    setMusic(WINNING_MUSIC, id);
  }, [setMusic]);

  const { t } = useTranslation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableRowSelection<Music> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows, info) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys, { selectedRows, info });
      setSelectedRowKeys(newSelectedRowKeys);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            return index % 2 === 0;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            return index % 2 !== 0;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const handleDelete = useCallback((item: Music) => {
    console.log('handleDelete: ', item);
    remove(item);
  }, [remove]);

  const handleBulkDelete = useCallback(() => {
    bulkRemove(selectedRowKeys);
  }, [bulkRemove, selectedRowKeys]);

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  const uploadProps = useMemo<UploadProps<never>>(() => ({
    accept: 'audio/*',      // 浏览器文件选择框层面的防御
    multiple: true,
    beforeUpload: async (file: RcFile, fileList: RcFile[]) => {
      // 1. 🛡️ 严格看门狗：先验一下是不是 Excel 文件，防止 HR 误传一张照片进来
      const isAudio = file.type.startsWith('audio/');

      if (!isAudio) {
        message.error('只接收音频文件！')
        return Upload.LIST_IGNORE // 告诉 antd 直接在上传列表里把这货抹去
      }

      const isLimit5M = file.size / 1024 / 1024 < 5; // 2. 检查大小（例如 5MB）.

      if (!isLimit5M) {
        message.error('音频大小不能超过 5MB!')
        return Upload.LIST_IGNORE // 告诉 antd 直接在上传列表里把这货抹去
      }

      const name = file.name.replace(/\.[^/.]+$/, '');
      const size = file.size as number;
      const duration: number = await new Promise((resolve) => {
        const audio = new Audio(URL.createObjectURL(file));
        audio.onloadedmetadata = () => { resolve(audio.duration) };
        // 处理加载失败的情况，防止 Promise 永远挂起.
        audio.onerror = () => { resolve(0) };
      });

      create({ name, file, size, duration, isBuildIn: false });

      // 4. 💥 核心：死死咬住返回 false，坚决不让 antd 发起任何网络请求！
      return false;
    }, // ⚙️ 挂载拦截看门狗
    showUploadList: false,    // 既然不上传，我们可以隐藏那个自带的进度条列表
  }), [create, message]);

  // 🚀 2. 最高指挥部：定义当前播放状态
  const [currAudioId, setCurrAudioId] = useState<number | null>(null); // 当前正在播哪首歌
  const [isPlaying, setIsPlaying] = useState<boolean>(false);      // 是否正在播

  // 🚀 3. 核心大杀器：用 useRef 焊死单例音频对象，保证全场只有一个声音源，绝不重叠
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 4. 组件开机初始化音频监听
  useEffect(() => {
    // 实例化原生音频引擎
    audioRef.current = new Audio();

    // 💡 防御心智：当歌曲自然播放结束时，老老实实把状态重置，复原播放图标
    const handleAudioEnded = () => {
      setIsPlaying(false);
      setCurrAudioId(null);
    };

    audioRef.current.addEventListener('ended', handleAudioEnded);

    // 🧼 组件销毁时（比如切页面了），无条件把声音掐断，释放内存
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayMusic = useCallback((music: Music) => {

    if (music.id !== currAudioId) {
      audioRef.current?.pause();           // 切歌前先掐断上一首
      audioRef.current.src = URL.createObjectURL(music.file);  // 换子弹（切歌直链）
      audioRef.current?.load();
      setCurrAudioId(music.id as number);
    }

    audioRef.current?.play();

    setIsPlaying(true);
  }, [currAudioId]);

  const handlePauseMusic = useCallback((music: Music) => {
    audioRef.current?.pause(); // 暂停
    setIsPlaying(false);
  }, []);

  const columns = useMemo<TableColumnsType<Music>>(() => [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (value, record, index: number) => {
        return (
          <>{value}</>
        );
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (value, record, index: number) => {
        return (
          <>{(value / 1024 / 1024).toFixed(2)} MB</>
        );
      },
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      render: (value, record, index: number) => {
        const total = Math.ceil(value);
        const mins = Math.floor(total / 60);
        const secs = total % 60;

        // 补零处理，例如 03:05.
        return (
          <>{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}</>
        );
      },
    },
    {
      title: '播放',
      key: 'play',
      render: (value, record, index: number) => {
        return (record.id === currAudioId && isPlaying) ? (
          <PauseCircleOutlined className={styles['play-icon']} onClick={() => handlePauseMusic(record)} />
        ) : (
          <PlayCircleOutlined className={styles['play-icon']} onClick={() => handlePlayMusic(record)} />
        );
      },
    },
    {
      title: '内置',
      dataIndex: 'isBuildIn',
      key: 'isBuildIn',
      render: (value, record, index: number) => {
        return value ? (
          <Tag color="processing" variant="outlined">内置音乐</Tag>
        ) : (
          <Tag color="success" variant="outlined">自定义音乐</Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'end',
      width: 200,
      render: (value, record, index: number) => {
        return (
          <>
            <Popconfirm
              title="确认删除?"
              icon={<DeleteOutlined style={{ color: '#F56C6C' }}/>}
              onConfirm={() => { handleDelete(record) }}
              okButtonProps={{ danger: true }}
              okText="删除"
              cancelText="取消"
            >
              <Button color="danger" variant="outlined" size="small" className={styles['table-btn']}>{t('operation.delete')}</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ], [t, handleDelete, currAudioId, isPlaying, handlePlayMusic, handlePauseMusic]);

  return { musics, openingId, handleOpeningChange, lotteryId, handleLotteryChange, winningId, handleWinningChange, columns, rowSelection, uploadProps, handleBulkDelete, handleClear };
}
