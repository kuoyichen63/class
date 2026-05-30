/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClassroomInfo from './components/ClassroomInfo';
import Timetable from './components/Timetable';
import ReservationModal from './components/ReservationModal';
import AdminPanel from './components/AdminPanel';
import { ClassroomId, Reservation, CLASSROOM_LIST } from './types';
import { getInitialMockReservations, formatLocalDateString } from './utils';
import { Calendar, HelpCircle, Phone, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Global State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<ClassroomId>('601');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'book' | 'view';
    dateStr: string;
    periodId: number;
    roomId: string;
    existingReservation?: Reservation;
  }>({
    isOpen: false,
    mode: 'book',
    dateStr: '',
    periodId: 1,
    roomId: '601',
  });

  // Success reservation brief alert
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 1. Initial Data Loading
  useEffect(() => {
    const rawData = localStorage.getItem('nfu_cs_classroom_reservations');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReservations(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse local reservation storage data', e);
      }
    }
    
    // No data or corrupt -> pre-populate with realistic NFU computer science course schedules
    const initialMock = getInitialMockReservations(new Date());
    setReservations(initialMock);
    localStorage.setItem('nfu_cs_classroom_reservations', JSON.stringify(initialMock));
  }, []);

  // Sync state changes with localStorage
  const saveReservations = (newReservations: Reservation[]) => {
    setReservations(newReservations);
    localStorage.setItem('nfu_cs_classroom_reservations', JSON.stringify(newReservations));
  };

  // 2. Booking operations
  const handleCellClick = (dateStr: string, periodId: number) => {
    setModalState({
      isOpen: true,
      mode: 'book',
      dateStr,
      periodId,
      roomId: selectedRoomId,
    });
  };

  const handleDetailClick = (reservation: Reservation) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      dateStr: reservation.date,
      periodId: reservation.periodId,
      roomId: reservation.roomId,
      existingReservation: reservation,
    });
  };

  const handleBookingSubmit = (bookingDetails: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newId = 'res-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newReservation: Reservation = {
      ...bookingDetails,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    const updatedList = [...reservations, newReservation];
    saveReservations(updatedList);
    setModalState(prev => ({ ...prev, isOpen: false }));

    // Show a beautiful toast message of completion
    setToastMsg(`EC${bookingDetails.roomId} 教室第 ${bookingDetails.periodId} 節預約完成！`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 3. Admin Panel operations
  const handleDeleteReservation = (id: string) => {
    const updated = reservations.filter(r => r.id !== id);
    saveReservations(updated);

    setToastMsg('已在系統後台刪除該筆排班記錄');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleUpdateReservation = (updatedBooking: Reservation) => {
    const updated = reservations.map(r => r.id === updatedBooking.id ? updatedBooking : r);
    saveReservations(updated);

    setToastMsg('排班資訊更新成功！');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleImportReservations = (imported: Reservation[]) => {
    saveReservations(imported);
    setToastMsg('成功完成資料重置、還原！');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 transition-colors duration-300">
      
      {/* Dynamic Header */}
      <Header 
        isAdmin={isAdminMode} 
        onAdminToggle={() => setIsAdminMode(!isAdminMode)} 
        bookingCount={reservations.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Dynamic Toast Feedback Overlay */}
        {showToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-100">作業執行成功</p>
              <p className="text-slate-400 mt-0.5">{toastMsg}</p>
            </div>
          </div>
        )}

        {isAdminMode ? (
          /* --- BACKEND CONTROL DECK VIEW --- */
          <AdminPanel
            reservations={reservations}
            onDeleteReservation={handleDeleteReservation}
            onUpdateReservation={handleUpdateReservation}
            onImportReservations={handleImportReservations}
          />
        ) : (
          /* --- FRONTPAGE CLIENT VIEW --- */
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-350">
            
            {/* Dept Academic Jumbotron Brief */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  即時自動排課與預約系統
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  虎尾科大資工系電腦教室，輕鬆點選，即刻借用！
                </h2>
                <p className="text-xs text-slate-300 sm:text-emerald-50 md:text-xs leading-relaxed max-w-prose">
                  本系統提供 <strong className="text-blue-300">601、607、513、502</strong> 四間電腦教室的每日八節課排班狀況。師生可於下方週課表中，自由點按空白時段並提出預約申請，或點擊已預約課堂檢視負責教師及課程需求，使空間與教學資源極大化。
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs space-y-2 shrink-0 md:max-w-xs">
                <div className="font-bold text-blue-400 flex items-center gap-1.5 pb-1 border-b border-white/15">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span>排班預約守則</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-snug">
                  <li>一天共八節課 (早四節/午四節)。</li>
                  <li>一經預約，系統即在首頁即時顯示。</li>
                  <li>修改與取消排班，請向系辦提出或登入後台管理。</li>
                </ul>
              </div>
            </div>

            {/* Classroom Info Grid / Selector cards */}
            <ClassroomInfo 
              selectedRoomId={selectedRoomId}
              onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
              reservations={reservations}
            />

            {/* Weekly Timeline Scheduler */}
            <Timetable
              selectedRoomId={selectedRoomId}
              selectedDate={selectedDate}
              onDateChange={(date) => setSelectedDate(date)}
              reservations={reservations}
              onCellClick={handleCellClick}
              onDetailClick={handleDetailClick}
            />

          </div>
        )}

      </main>

      {/* Booking Dialog Modal Component */}
      <ReservationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        mode={modalState.mode}
        dateStr={modalState.dateStr}
        periodId={modalState.periodId}
        roomId={modalState.roomId}
        existingReservation={modalState.existingReservation}
        onSubmitBooking={handleBookingSubmit}
      />

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-slate-500">
            <p className="font-bold text-slate-705">國立虎尾科技大學 資訊工程系電腦教室排班系統</p>
            <p className="mt-1 font-mono text-slate-400">© 2026 National Formosa University CSIE Lab Office. All Rights Reserved.</p>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>辦公室分機: (05) 631-5000</span>
            </div>
            <a href="https://csie.nfu.edu.tw/" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors font-medium">
              虎科大資工系官網
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
