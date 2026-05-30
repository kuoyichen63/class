/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Classroom identifiers
export type ClassroomId = '601' | '607' | '513' | '502';

export interface Classroom {
  id: ClassroomId;
  name: string;
  location: string;
  capacity: number;
  description: string;
  color: string; // Tailwind tint color
  bgColor: string;
  borderColor: string;
  textColor: string;
}

// Period identifiers (1-8)
export interface PeriodInfo {
  id: number;
  name: string;
  time: string;
  isMorning: boolean;
}

// Booking reservation interface
export interface Reservation {
  id: string;
  date: string; // YYYY-MM-DD
  roomId: ClassroomId;
  periodId: number; // 1 to 8
  teacherName: string;
  courseName: string;
  targetClass: string;
  phone: string;
  notes: string;
  createdAt: string; // ISO string
}

const CLASSROOM_LIST: Classroom[] = [
  {
    id: '601',
    name: '601 計算機網路與雲端核心教室',
    location: '工程五館 6 樓 EC601',
    capacity: 60,
    description: '專用於物聯網核心網路、網管與雲端架構授課。配置高效能網卡與網路交換器。',
    color: 'blue',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    id: '607',
    name: '607 嵌入式系統與證照檢定教室',
    location: '工程五館 6 樓 EC607',
    capacity: 55,
    description: 'Linux 嵌入式開發與多媒體剪輯教學。為勞動部乙級技術士認證正式合格測試場地。',
    color: 'emerald',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  {
    id: '513',
    name: '513 軟體工程與巨量資料教室',
    location: '工程五館 5 樓 EC513',
    capacity: 50,
    description: '專注與核心演算法、資料庫設計與軟體工程實務。備有多螢幕廣播廣角教學機組。',
    color: 'purple',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
  },
  {
    id: '502',
    name: '502 物聯網與人工智慧核心教室',
    location: '工程五館 5 樓 EC502',
    capacity: 48,
    description: '專用於機器學習、邊緣運算與智慧控制開發。配置 NVIDIA GPU 專業級邊緣開發工作站。',
    color: 'amber',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
];

const PERIOD_LIST: PeriodInfo[] = [
  { id: 1, name: '第一節', time: '08:10 - 09:00', isMorning: true },
  { id: 2, name: '第二節', time: '09:10 - 10:00', isMorning: true },
  { id: 3, name: '第三節', time: '10:10 - 11:00', isMorning: true },
  { id: 4, name: '第四節', time: '11:10 - 12:00', isMorning: true },
  { id: 5, name: '第五節', time: '13:30 - 14:20', isMorning: false },
  { id: 6, name: '第六節', time: '14:30 - 15:20', isMorning: false },
  { id: 7, name: '第七節', time: '15:30 - 16:20', isMorning: false },
  { id: 8, name: '第八節', time: '16:30 - 17:20', isMorning: false },
];

export { CLASSROOM_LIST, PERIOD_LIST };
