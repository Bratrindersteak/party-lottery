export interface Member {
  id?: number;
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
  _isEdit?: boolean;
  _type?: 'add' | 'update';
  _backup?: Member;
}

export interface Award {
  id?: number;
  name: string; // 奖项名称.
  prize: string; // 奖品.
  preview?: string; // 奖品预览图.
  quota: number; // 奖项名额指标.
  _isDrawn: boolean; // 是否已抽取.
  _isEdit?: boolean;
  _type?: 'add' | 'update';
  _backup?: Member;
}

export interface Record {
  id?: number;
  awardId: number;
  memberId: number;
}

export interface Music {
  id?: number;
  name: string;         // 名称.
  file: File;           // 数据.
  size: number;         // 大小(MB).
  duration: number;     // 时长(秒).
  _isBuildIn?: boolean; // 是否为内置.
}

export interface Image {
  id?: number;
  url: string;
  file: File;
}
