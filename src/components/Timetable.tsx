/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Classroom, CLASSROOM_LIST, PERIOD_LIST, Reservation } from '../types';
import { 
  getWeekDates, 
  formatLocalDateString, 
  WEEKDAY_CN, 
  formatDisplayDate 
} from '../utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  ShieldAlert, 
  Check, 
  Printer, 
  BookOpen,
  LayoutGrid,
  ListOrdered,
  CalendarCheck
} from 'lucide-react';

interface TimetableProps {
  selectedRoomId: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  reservations: Reservation[];
  onCellClick: (dateStr: string, periodId: number) => void;
  onDetailClick: (reservation: Reservation) => void;
}

export default function Timetable({
  selectedRoomId,
  selectedDate,
  onDateChange,
  reservations,
  onCellClick,
  onDetailClick,
}: TimetableProps) {
  // Toggle between 'weekly' and 'daily' view (gold standard for responsive mobile calendar)
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');

  const classroom = CLASSROOM_LIST.find(r => r.id === selectedRoomId) || CLASSROOM_LIST[0];
  const weekDates = getWeekDates(selectedDate);
  const weekStartStr = formatDisplayDate(formatLocalDateString(weekDates[0]));
  const weekEndStr = formatDisplayDate(formatLocalDateString(weekDates[6]));

  // Date handlers
  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onDateChange(new Date(e.target.value));
    }
  };

  // Find booking for relative cell
  const findBooking = (dateStr: string, periodId: number): Reservation | undefined => {
    return reservations.find(
      r => r.roomId === selectedRoomId && r.date === dateStr && r.periodId === periodId
    );
  };

  // Theme styling for reservation block
  const getBookingStyle = (roomId: string) => {
    switch (roomId) {
      case '601': return 'bg-blue-50 hover:bg-blue-100/90 text-blue-950 border-blue-200 shadow-sm';
      case '607': return 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 border-emerald-200 shadow-sm';
      case '513': return 'bg-purple-50 hover:bg-purple-100/90 text-purple-950 border-purple-200 shadow-sm';
      case '502': return 'bg-amber-50 hover:bg-amber-100/90 text-amber-950 border-amber-200 shadow-sm';
      default: return 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200';
    }
  };

  const handlesPrint = () => {
    window.print();
  };

  const targetDateStr = formatLocalDateString(selectedDate);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-4 sm:p-6 transition-all duration-300">
      
      {/* 1. Header Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-5 print:border-none print:pb-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-700 rounded-sm" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight print:text-xl">
              CSIE {classroom.id} 全週排班課表 & 預約登記
            </h2>
          </div>
          <p className="text-[11px] text-slate-450 font-medium print:hidden">
            滑鼠點選「+」快速預約空閒時段；點選「已預約」課堂方塊可檢視借用人與學術用途
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                viewMode === 'weekly'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>週排班表</span>
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                viewMode === 'daily'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>日檢視 (手機)</span>
            </button>
          </div>

          {/* Print Schedule Sheet Button */}
          <button
            onClick={handlesPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold tracking-wide cursor-pointer transition-colors"
            title="列印本週課表"
          >
            <Printer className="w-3.5 h-3.5 text-blue-700" />
            <span>列印本網頁課表</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation / Calendar bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 print:bg-white print:border-none print:p-0 print:mb-4">
        {/* Date Display text */}
        <div className="text-center sm:text-left">
          {viewMode === 'weekly' ? (
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest font-mono">WEEKLY ROSTER PLAN</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-805">
                {weekStartStr} — {weekEndStr}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest font-mono">DAILY ROSTER PLAN</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-805">
                {formatDisplayDate(targetDateStr)}
              </p>
            </div>
          )}
        </div>

        {/* Date Navigator buttons */}
        <div className="flex items-center justify-center gap-1.5 print:hidden">
          <button
            onClick={handlePrev}
            className="p-1.5 border border-slate-250 bg-white text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
            title={viewMode === 'weekly' ? '上週' : '前一天'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 border border-slate-250 bg-white text-slate-700 text-[11px] font-bold rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
          >
            今天
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 border border-slate-250 bg-white text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
            title={viewMode === 'weekly' ? '下週' : '後一天'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Date Picker Input */}
          <div className="relative flex items-center ml-1">
            <input
              type="date"
              value={targetDateStr}
              onChange={handleDatePickerChange}
              id="global-datepicker-input"
              className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer z-10"
            />
            <div className="p-1.5 border border-slate-250 bg-white text-slate-700 rounded-md hover:bg-slate-50 transition-colors">
              <CalendarIcon className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Render Timetable based on viewMode */}
      {viewMode === 'weekly' ? (
        /* --- WEEKLY VIEWS --- */
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[850px] border-collapse table-fixed text-center bg-white">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold text-slate-700 border-b border-slate-200">
                <th className="w-32 py-4 px-3 border-r border-slate-200 text-slate-600 font-bold bg-slate-100/90 select-none">
                  節次 \ 日期
                </th>
                {weekDates.map((date, idx) => {
                  const dateStr = formatLocalDateString(date);
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  return (
                    <th 
                      key={idx} 
                      className={`py-3 px-2 border-r border-slate-200 last:border-r-0 select-none ${
                        isToday ? 'bg-blue-900 text-white font-extrabold' : ''
                      }`}
                    >
                      <div className="text-[10px] opacity-95 tracking-wide uppercase">{WEEKDAY_CN[idx]}</div>
                      <div className="text-[13px] font-bold font-mono mt-0.5">
                        {date.getDate()} 日
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PERIOD_LIST.map((period) => (
                <tr key={period.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/20">
                  {/* Period column descriptor */}
                  <td className="py-3 px-3 border-r border-slate-200 bg-slate-50/80 text-slate-800 text-left">
                    <div className="font-extrabold text-[11px] text-blue-900">第 {period.id} 節</div>
                    <div className="font-mono text-[9px] text-slate-500 font-bold tracking-tighter mt-0.5">
                      {period.time}
                    </div>
                  </td>

                  {/* Days cells */}
                  {weekDates.map((date, dayIdx) => {
                    const dateStr = formatLocalDateString(date);
                    const booking = findBooking(dateStr, period.id);

                    return (
                      <td 
                        key={dayIdx} 
                        className="p-1.5 border-r border-slate-200 last:border-r-0 align-middle h-24"
                      >
                        {booking ? (
                          /* Slot Occupied */
                          <button
                            onClick={() => onDetailClick(booking)}
                            id={`booking-button-${booking.id}`}
                            className={`w-full h-full text-left p-2.5 rounded border text-[11px] leading-snug transition-all duration-200 hover:-translate-y-0.5 hover:shadow cursor-pointer ${getBookingStyle(booking.roomId)}`}
                          >
                            <div className="font-extrabold border-b border-slate-300 pb-1 mb-1 line-clamp-1 text-slate-900">
                              {booking.courseName}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-705">
                              <BookOpen className="w-3 h-3 text-slate-600 shrink-0 inline" />
                              <span className="truncate font-semibold">{booking.teacherName} 老師</span>
                            </div>
                            <div className="text-[9px] text-slate-500 mt-0.5 truncate">
                              對象: {booking.targetClass}
                            </div>
                          </button>
                        ) : (
                          /* Slot Free */
                          <button
                            onClick={() => onCellClick(dateStr, period.id)}
                            id={`empty-cell-${dateStr}-${period.id}`}
                            className="group w-full h-full border border-dashed border-slate-200 hover:border-blue-500 hover:bg-slate-50 rounded flex flex-col justify-center items-center text-slate-300 hover:text-blue-600 transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4 bg-slate-50 group-hover:bg-blue-100 rounded p-0.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            <span className="text-[9px] mt-1 font-bold group-hover:text-blue-600 tracking-wider">
                              可登記
                            </span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* --- MOBILE OUTLINE DAILY VIEW --- */
        <div className="space-y-4">
          <div className="text-[11px] font-bold text-slate-500 pb-1.5 border-b border-slate-205">
            CSIE {classroom.id} 電腦教室 • {formatDisplayDate(targetDateStr)} 節次列表
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {PERIOD_LIST.map((period) => {
              const booking = findBooking(targetDateStr, period.id);

              return (
                <div 
                  key={period.id} 
                  className={`flex flex-col sm:flex-row border rounded-lg overflow-hidden shadow-sm transition-all ${
                    booking 
                      ? 'border-slate-200 bg-white' 
                      : 'border-dashed border-slate-200 bg-slate-50'
                  }`}
                >
                  {/* Period Side badge */}
                  <div className={`p-4 sm:w-36 shrink-0 flex flex-row sm:flex-col justify-between sm:justify-center items-center gap-1.5 border-b sm:border-b-0 sm:border-r ${
                    booking 
                      ? 'bg-slate-50 border-slate-200' 
                      : 'bg-slate-100/40 border-slate-200/50'
                  }`}>
                    <div className="text-blue-900 font-extrabold text-[13px]">
                      第 {period.id} 節
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 font-bold whitespace-nowrap">
                      {period.time}
                    </div>
                  </div>

                  {/* Inner Content Area */}
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    {booking ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            課程: {booking.courseName}
                          </h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                            <span>排班教授: <strong className="text-slate-800">{booking.teacherName}</strong></span>
                            <span>使用班級: <strong className="text-slate-800">{booking.targetClass}</strong></span>
                          </div>
                          {booking.notes && (
                            <p className="text-[11px] text-slate-400 italic">備註: {booking.notes}</p>
                          )}
                        </div>

                        <button
                          onClick={() => onDetailClick(booking)}
                          id={`mobile-booking-detail-${booking.id}`}
                          className="self-start sm:self-center px-4 py-1.5 bg-slate-900 text-white font-bold text-xs rounded hover:bg-slate-850 cursor-pointer whitespace-nowrap transition-colors"
                        >
                          詳細資料
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          <span className="text-[11px] text-slate-450 font-medium tracking-wide">
                            此時段目前空閒中，歡迎預約借用。
                          </span>
                        </div>

                        <button
                          onClick={() => onCellClick(targetDateStr, period.id)}
                          id={`mobile-empty-cell-${targetDateStr}-${period.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>立即登記</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Print-Only Signature Legend Footer */}
      <div className="hidden print:block mt-12 border-t border-slate-300 pt-6 text-sm text-slate-500 font-serif">
        <div className="flex justify-between">
          <div>
            <p>國立虎尾科技大學 資訊工程系 電腦教室辦公室</p>
            <p className="text-[11px] mt-1">列印日期: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p>系主任/管理員職章: __________________</p>
          </div>
        </div>
      </div>
    </div>
  );
}
