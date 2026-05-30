/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClassroomId, Reservation } from './types';

// Helper to format Date to YYYY-MM-DD
export function formatLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get Monday of the week containing the given date
export function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  // day of week: 0 for Sunday, 1 for Monday, etc.
  // diff is day - 1, except if Sunday (0) where we want to go back 6 days
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

// Get array of 7 Date objects representing Monday to Sunday of the week for a given date
export function getWeekDates(baseDate: Date): Date[] {
  const monday = getMonday(baseDate);
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
}

// Chinese weekdays helper
export const WEEKDAY_CN = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

// Parse date string into formatted display text
export function formatDisplayDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const m = d.getMonth() + 1;
    const date = d.getDate();
    const wIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
    return `${m}/${date} (${WEEKDAY_CN[wIndex]})`;
  } catch {
    return dateStr;
  }
}

// Helper to generate mock reservations surrounding the current date
export function getInitialMockReservations(baseDate: Date): Reservation[] {
  const weekDates = getWeekDates(baseDate);
  
  // Format date strings of Mon-Fri
  const dMon = formatLocalDateString(weekDates[0]);
  const dTue = formatLocalDateString(weekDates[1]);
  const dWed = formatLocalDateString(weekDates[2]);
  const dThu = formatLocalDateString(weekDates[3]);
  const dFri = formatLocalDateString(weekDates[4]);

  const mockData: Reservation[] = [
    // Classroom 601 (Network & Linux)
    {
      id: 'mock-1',
      date: dMon,
      roomId: '601',
      periodId: 1,
      teacherName: '陳英明 教授',
      courseName: '電腦網路大數據實務',
      targetClass: '資工三甲',
      phone: '0912-345678',
      notes: '需使用實體交換器與 Wireshark 側錄封包',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      date: dMon,
      roomId: '601',
      periodId: 2,
      teacherName: '陳英明 教授',
      courseName: '電腦網路大數據實務',
      targetClass: '資工三甲',
      phone: '0912-345678',
      notes: '需使用實體交換器與 Wireshark 側錄封包',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-3',
      date: dWed,
      roomId: '601',
      periodId: 5,
      teacherName: '蔡震宇 教授',
      courseName: '雲端運算與虛擬化技術',
      targetClass: '資工四乙',
      phone: '0928-111222',
      notes: '使用 Docker 容器叢集架構演練',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-4',
      date: dWed,
      roomId: '601',
      periodId: 6,
      teacherName: '蔡震宇 教授',
      courseName: '雲端運算與虛擬化技術',
      targetClass: '資工四乙',
      phone: '0928-111222',
      notes: '使用 Docker 容器叢集架構演練',
      createdAt: new Date().toISOString(),
    },

    // Classroom 607 (Embedded Systems & Certification)
    {
      id: 'mock-5',
      date: dTue,
      roomId: '607',
      periodId: 3,
      teacherName: '王志宏 教授',
      courseName: '嵌入式作業系統與 Linux 驅動',
      targetClass: '資工碩一',
      phone: '0933-445566',
      notes: '使用 ARM 實驗板進行 GPIO 控制',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-6',
      date: dTue,
      roomId: '607',
      periodId: 4,
      teacherName: '王志宏 教授',
      courseName: '嵌入式作業系統與 Linux 驅動',
      targetClass: '資工碩一',
      phone: '0933-445566',
      notes: '使用 ARM 實驗板進行 GPIO 控制',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-7',
      date: dThu,
      roomId: '607',
      periodId: 5,
      teacherName: '張偉傑 老師',
      courseName: '電腦硬體裝修乙級輔導班',
      targetClass: '證照專班',
      phone: '0966-777888',
      notes: '學員術科模擬測試',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-8',
      date: dThu,
      roomId: '607',
      periodId: 6,
      teacherName: '張偉傑 老師',
      courseName: '電腦硬體裝修乙級輔導班',
      targetClass: '證照專班',
      phone: '0966-777888',
      notes: '學員術科模擬測試',
      createdAt: new Date().toISOString(),
    },

    // Classroom 513 (Software & Database)
    {
      id: 'mock-9',
      date: dWed,
      roomId: '513',
      periodId: 1,
      teacherName: '李美莉 副教授',
      courseName: '資料庫系統設計',
      targetClass: '資工二乙',
      phone: '0955-321456',
      notes: 'SQL Server 進階查詢與預存程序練習',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-10',
      date: dWed,
      roomId: '513',
      periodId: 2,
      teacherName: '李美莉 副教授',
      courseName: '資料庫系統設計',
      targetClass: '資工二乙',
      phone: '0955-321456',
      notes: 'SQL Server 進階查詢與預存程序練習',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-11',
      date: dFri,
      roomId: '513',
      periodId: 3,
      teacherName: '吳信賢 教授',
      courseName: '資料結構課堂實習',
      targetClass: '資工一甲',
      phone: '0921-987654',
      notes: 'Binary Tree 重構精準評測',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-12',
      date: dFri,
      roomId: '513',
      periodId: 4,
      teacherName: '吳信賢 教授',
      courseName: '資料結構課堂實習',
      targetClass: '資工一甲',
      phone: '0921-987654',
      notes: 'Binary Tree 重構精準評測',
      createdAt: new Date().toISOString(),
    },

    // Classroom 502 (AI & IoT)
    {
      id: 'mock-13',
      date: dTue,
      roomId: '502',
      periodId: 7,
      teacherName: '林秋香 教授',
      courseName: '深度學習與電腦視覺應用',
      targetClass: '資工四甲',
      phone: '0988-555666',
      notes: '使用 PyTorch 與 YOLO 系列進行物件偵測',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-14',
      date: dTue,
      roomId: '502',
      periodId: 8,
      teacherName: '林秋香 教授',
      courseName: '深度學習與電腦視覺應用',
      targetClass: '資工四甲',
      phone: '0988-555666',
      notes: '使用 PyTorch 與 YOLO 系列進行物件偵測',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-15',
      date: dThu,
      roomId: '502',
      periodId: 1,
      teacherName: '高宏明 副教授',
      courseName: '智慧邊緣物聯網實務',
      targetClass: '資工三乙',
      phone: '0911-222333',
      notes: 'ESP32 搭配 MicroPython 與感測器收集',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-16',
      date: dThu,
      roomId: '502',
      periodId: 2,
      teacherName: '高宏明 副教授',
      courseName: '智慧邊緣物聯網實務',
      targetClass: '資工三乙',
      phone: '0911-222333',
      notes: 'ESP32 搭配 MicroPython 與感測器收集',
      createdAt: new Date().toISOString(),
    },
  ];
  
  return mockData;
}
