/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Classroom, CLASSROOM_LIST, PERIOD_LIST, Reservation } from '../types';
import { formatDisplayDate } from '../utils';
import { X, User, BookOpen, Phone, MessageSquare, Clock, School, Calendar, HelpCircle, Check, AlertTriangle } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'book' | 'view';
  dateStr: string;
  periodId: number;
  roomId: string;
  existingReservation?: Reservation;
  onSubmitBooking: (bookingData: Omit<Reservation, 'id' | 'createdAt'>) => void;
}

export default function ReservationModal({
  isOpen,
  onClose,
  mode,
  dateStr,
  periodId,
  roomId,
  existingReservation,
  onSubmitBooking,
}: ReservationModalProps) {
  
  // Local Form state
  const [teacherName, setTeacherName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset form when modal opens for booking
  useEffect(() => {
    if (isOpen && mode === 'book') {
      setTeacherName('');
      setCourseName('');
      setTargetClass('');
      setPhone('');
      setNotes('');
      setErrorMsg('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const room = CLASSROOM_LIST.find(r => r.id === roomId) || CLASSROOM_LIST[0];
  const period = PERIOD_LIST.find(p => p.id === periodId) || PERIOD_LIST[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!teacherName.trim()) return setErrorMsg('請填寫教師姓名');
    if (!courseName.trim()) return setErrorMsg('請填寫課程或用途名稱');
    if (!targetClass.trim()) return setErrorMsg('請填寫使用班級');
    if (!phone.trim()) return setErrorMsg('請填寫聯絡電話/分機');

    setErrorMsg('');
    onSubmitBooking({
      date: dateStr,
      roomId: roomId as any,
      periodId,
      teacherName: teacherName.trim(),
      courseName: courseName.trim(),
      targetClass: targetClass.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Banner header styled based on classroom theme with hard rectangular borders in geometric balance */}
        <div className={`p-5 text-white flex justify-between items-center border-b ${
          room.id === '601' ? 'bg-blue-900 border-blue-950' :
          room.id === '607' ? 'bg-emerald-900 border-emerald-950' :
          room.id === '513' ? 'bg-purple-900 border-purple-950' :
          'bg-amber-800 border-amber-950'
        }`}>
          <div>
            <h3 className="text-base font-extrabold tracking-tight">
              {mode === 'book' ? '申請電腦教室預約登記' : '教室排班借用明細'}
            </h3>
            <p className="text-[10px] text-white/90 mt-0.5 tracking-wider uppercase font-mono font-bold">
              CSIE {room.id} • {formatDisplayDate(dateStr)} (第 {period.id} 節)
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/10 text-white/90 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6">
          
          {/* Quick Schedule Metadata Cards */}
          <div className="grid grid-cols-2 gap-3 mb-5 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <p className="text-slate-450 text-[9px] font-bold">預約日期</p>
                <p className="text-slate-800 font-extrabold">{formatDisplayDate(dateStr)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <p className="text-slate-450 text-[9px] font-bold">預約節次 ({period.name})</p>
                <p className="text-slate-800 font-extrabold font-mono">{period.time}</p>
              </div>
            </div>
          </div>

          {mode === 'book' ? (
            /* --- BOOKING FORM MODE --- */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Errors indicator banner */}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-650 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Teacher input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  教師姓名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="例如：王小明 教授"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    id="book-teacher-input"
                    className="w-full pl-9 pr-3 py-2 border border-slate-350 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-white font-medium"
                  />
                </div>
              </div>

              {/* Course name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  課程或用途名稱 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="例如：微處理器實作 / 班級開會"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    id="book-course-input"
                    className="w-full pl-9 pr-3 py-2 border border-slate-350 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-white font-medium"
                  />
                </div>
              </div>

              {/* Target class and phone info in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    借用班級 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <School className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="例如：資工三甲"
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value)}
                      id="book-class-input"
                      className="w-full pl-9 pr-3 py-2 border border-slate-350 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    聯絡電話 / 手機 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="例如：0912-345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      id="book-phone-input"
                      className="w-full pl-9 pr-3 py-2 border border-slate-350 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Notes text area */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  備註與環境軟體設備需求 (選填)
                </label>
                <div className="relative">
                  <span className="absolute top-2.5 left-3 text-slate-400 pointer-events-none">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <textarea
                    rows={2}
                    placeholder="請簡述您的需求，以便管理員提前協助環境設定..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    id="book-notes-input"
                    className="w-full pl-9 pr-3 py-2 border border-slate-350 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-white font-medium resize-none"
                  />
                </div>
              </div>

              {/* Action operations in foot */}
              <div className="flex justify-end gap-2 border-t border-slate-205 pt-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-bold cursor-pointer transition-colors border border-transparent"
                >
                  取消
                </button>
                <button
                  type="submit"
                  id="submit-booking-action-btn"
                  className={`flex items-center gap-1.5 px-5 py-2 text-white rounded text-xs font-bold shadow cursor-pointer transition-colors ${
                    room.id === '601' ? 'bg-blue-900 hover:bg-blue-950' :
                    room.id === '607' ? 'bg-emerald-900 hover:bg-emerald-950' :
                    room.id === '513' ? 'bg-purple-900 hover:bg-purple-950' :
                    'bg-amber-800 hover:bg-amber-905'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>確認送出預約</span>
                </button>
              </div>
            </form>
          ) : (
            /* --- DETAILED VIEW MODE --- */
            <div className="space-y-4">
              {existingReservation ? (
                <>
                  <div className="divide-y divide-slate-200 border border-slate-200 bg-slate-50/50 rounded px-4 py-1.5 shadow-inner">
                    {/* Course */}
                    <div className="py-2.5 flex items-start gap-3">
                      <BookOpen className="w-4 h-4 text-slate-505 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">課程學術項目用途</p>
                        <p className="text-xs font-extrabold text-slate-850 mt-0.5">{existingReservation.courseName}</p>
                      </div>
                    </div>

                    {/* Teacher */}
                    <div className="py-2.5 flex items-start gap-3">
                      <User className="w-4 h-4 text-slate-505 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">排班授課教授</p>
                        <p className="text-xs font-semibold text-slate-850 mt-0.5">{existingReservation.teacherName} 老師</p>
                      </div>
                    </div>

                    {/* Target Class */}
                    <div className="py-2.5 flex items-start gap-3">
                      <School className="w-4 h-4 text-slate-505 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">上課班級</p>
                        <p className="text-xs font-semibold text-slate-850 mt-0.5">{existingReservation.targetClass}</p>
                      </div>
                    </div>

                    {/* Contact Phone */}
                    <div className="py-2.5 flex items-start gap-3">
                      <Phone className="w-4 h-4 text-slate-505 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">聯絡人行動電話 / 分機</p>
                        <p className="text-xs font-bold font-mono text-slate-850 mt-0.5">{existingReservation.phone}</p>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="py-2.5 flex items-start gap-3 border-none">
                      <MessageSquare className="w-4 h-4 text-slate-505 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">備註與說明配備事項</p>
                        <p className="text-xs text-slate-600 mt-1 italic whitespace-pre-line leading-relaxed">
                          {existingReservation.notes || '（無提供特別備註需求）'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 text-right">
                    登錄時間: {new Date(existingReservation.createdAt).toLocaleString('zh-TW', { hour12: false })}
                  </p>

                  <div className="flex justify-end gap-2.5 border-t border-slate-200 pt-4 mt-4">
                    <button
                      onClick={onClose}
                      className="px-5 py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-850 cursor-pointer shadow-sm transition-colors text-center flex-1 sm:flex-none"
                    >
                      關閉視窗
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 bg-red-50 text-red-700 rounded-xl border border-red-100">
                  <p className="text-sm font-bold">預約資料載入失敗</p>
                  <button onClick={onClose} className="mt-4 px-4 py-1.5 bg-red-600 text-white text-xs rounded-lg font-semibold">關閉</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
