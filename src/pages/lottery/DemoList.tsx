import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Image, Tag } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { useLotteryStore } from '@/store/lottery.ts';
import { useAwardStore } from '@/store/award.ts';
import { useAwardList } from './AwardList/useAwardList.ts';
import defaultAwardUrl from '@/assets/images/default-award.png';

import styles from './AwardList/styles.module.css';

import type { Award } from '@/types/lottery.ts';

// 1. 可拖拽项组件
function SortableItem({ award }: { award: Award }) {
  const currAwardId = useLotteryStore((state) => state.currAwardId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: award.id as number });
  const { ableClick, handleClick } = useAwardList();

  // 动态 Transform 和 Transition 必须留在 inline style
  const inlineStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef}
        style={inlineStyle}
        {...attributes}
        {...listeners}
        className={`${styles['award-item']} ${(currAwardId === award.id) && styles['award-active']} ${!ableClick && styles['award-disabled']} ${isDragging && styles['award-dragging']}`}
        onClick={() => handleClick(award)}
    >
      <div className={styles['award-left']}>
        <Image className={styles['award-image']}
               alt="basic image"
               width={56}
               src={award.url}
               fallback={defaultAwardUrl}
        />
      </div>
      <div className={styles['award-middle']}>
        <div className={styles['award-title']} title={award.name}>{award.name}</div>
        <div className={styles['award-prize']} title={award.prize}>{award.prize}</div>
      </div>
      <div className={styles['award-right']}>
        <div className={styles['award-count']}>{award.count}名</div>
        <Tag className={styles['award-status']} color={award.isFinished ? '#64748b' : '#10b981'} variant="outlined">{award.isFinished ? '已开奖' : '进行中'}</Tag>
      </div>
    </li>
  );
}

// 2. 主列表组件
export default function DemoList() {
  const isAwardListExpanded = useLotteryStore((state) => state.isAwardListExpanded);
  const awards = useAwardStore((state) => state.awards);
  const setAwards = useAwardStore((state) => state.setAwards);
  const { handleExpand } = useAwardList();

  // 配置 Sensor：解决点击与拖拽冲突的关键！
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 移动超过 5px 触发拖拽，低于 5px 当作 onClick 点击
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = awards.findIndex((i) => i.id === active.id);
      const newIndex = awards.findIndex((i) => i.id === over.id);

      const newAwards = arrayMove(awards, oldIndex, newIndex);
      setAwards(newAwards); // 更新 Store 中的真实数据
    }
  };

  return (
    <div className={styles['award-drawer']}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <ul className={`${styles['award-list']} ${!isAwardListExpanded && styles['award-closed']}`}>
          <SortableContext items={awards.map((award) => award.id as number)} strategy={verticalListSortingStrategy}>
            {awards.map((award) => (
              <SortableItem key={award.id as number} award={award} />
            ))}
          </SortableContext>
        </ul>
      </DndContext>

      <div className={styles['award-handle']} onClick={handleExpand}>
        {isAwardListExpanded ? <LeftOutlined/> : <RightOutlined/>}
      </div>
    </div>
  );
}
