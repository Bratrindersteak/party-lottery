import { ADD, EDIT, FINISHED, INIT, READY, RUNNING } from '@/config/constants.ts';

export interface Member {
  id?: number | string;
  employeeId: string;
  name: string;
  department: string;
  avatar?: string; // 头像地址.
  age?:  number;
  tenure?: number; // 工龄.
  email?: string;
  rank?: number;
  weight?: number;
  winTimes?: number; // 获奖次数.
  createdAt?: number;
  updatedAt?: number;
  _isEdit?: boolean;
  _type?: typeof ADD | typeof EDIT;
  _backup?: Member;
}

export interface Award {
  id?: number;
  name: string; // 奖项名称.
  prize: string; // 奖品.
  url?: string; // 奖品预览图.
  count: number; // 奖项名额指标.
  isFinished: boolean; // 是否已抽取.
  allowRepeat: boolean; // 是否允许已获奖人员参与.
  createdAt?: number;
  updatedAt?: number;
  _isEdit?: boolean;
  _type?: typeof ADD | typeof EDIT;
  _backup?: Member;
}

export interface Record {
  id?: number;
  awardId: number;
  memberId: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface ExportColumns {
  award?: string;
  employeeId?: string;
  name?: string;
  department?: string;
}

export interface Music {
  id?: number;
  name: string;         // 名称.
  file: File;           // 数据.
  size: number;         // 大小(MB).
  duration: number;     // 时长(秒).
  isBuildIn: boolean; // 是否为内置.
  createdAt?: number;
  updatedAt?: number;
}

export interface Image {
  id?: number;
  url: string;
  file: File;
  createdAt?: number;
  updatedAt?: number;
}

export type LotteryStatus = typeof INIT |typeof READY | typeof RUNNING | typeof FINISHED;
