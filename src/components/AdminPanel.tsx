/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ClassroomId, 
  Reservation, 
  CLASSROOM_LIST, 
  PERIOD_LIST 
} from '../types';
import { formatDisplayDate } from '../utils';
import { 
  Key, 
  Lock, 
  Unlock, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  RefreshCw, 
  BarChart3, 
  PieChart, 
  Check, 
  X, 
  AlertTriangle, 
  Database,
  Calendar,
  Layers,
  ArrowUpDown,
  BookOpen,
  User,
  Shield,
  HelpCircle,
  FileCode,
  Users
} from 'lucide-react';

interface AdminPanelProps {
  reservations: Reservation[];
  onDeleteReservation: (id: string) => void;
  onUpdateReservation: (updated: Reservation) => void;
  onImportReservations: (imported: Reservation[]) => void;
}

export default function AdminPanel({
  reservations,
  onDeleteReservation,
  onUpdateReservation,
  onImportReservations,
}: AdminPanelProps) {
  
  // 1. Password Protection & Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [setupPasswordConfirm, setSetupPasswordConfirm] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // 2. Booking management & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  
  // Sorting
  const [sortField, setSortField] = useState<'date' | 'roomId' | 'periodId'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // 3. Edit reservation mode
  const [editingBooking, setEditingBooking] = useState<Reservation | null>(null);
  const [editError, setEditError] = useState('');

  // 4. Double Confirm Delete id
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 5. Password Reset mode inside back-office
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // 6. JSON File upload state
  const [fileErrorMsg, setFileErrorMsg] = useState('');
  const [fileSuccessMsg, setFileSuccessMsg] = useState('');

  // Initial password existence check
  useEffect(() => {
    const pwd = localStorage.getItem('nfu_cs_admin_password');
    setHasPassword(!!pwd);
    
    // Auto-login in development environment or check session
    const loggedInSession = sessionStorage.getItem('nfu_cs_admin_loggedin');
    if (loggedInSession === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle password setup
  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupPassword) {
      return setAuthError('密碼不能留空');
    }
    if (setupPassword.length < 4) {
      return setAuthError('密碼長度至少需要 4 位');
    }
    if (setupPassword !== setupPasswordConfirm) {
      return setAuthError('兩次輸入的密碼不一致');
    }

    localStorage.setItem('nfu_cs_admin_password', setupPassword);
    sessionStorage.setItem('nfu_cs_admin_loggedin', 'true');
    setHasPassword(true);
    setIsLoggedIn(true);
    setAuthError('');
    setSetupPassword('');
    setSetupPasswordConfirm('');
  };

  // Handle Login Check
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPwd = localStorage.getItem('nfu_cs_admin_password');
    if (loginPassword === storedPwd) {
      sessionStorage.setItem('nfu_cs_admin_loggedin', 'true');
      setIsLoggedIn(true);
      setAuthError('');
      setLoginPassword('');
    } else {
      setAuthError('密碼錯誤，請再試一次！');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nfu_cs_admin_loggedin');
    setIsLoggedIn(false);
  };

  // Save new password
  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      return setAuthError('新密碼不能為空');
    }
    if (newPassword.length < 4) {
      return setAuthError('密碼至少需要 4 位');
    }
    if (newPassword !== newPasswordConfirm) {
      return setAuthError('密碼與二次確認不一致');
    }

    localStorage.setItem('nfu_cs_admin_password', newPassword);
    setResetSuccessMsg('管理密碼更新成功！');
    setNewPassword('');
    setNewPasswordConfirm('');
    setAuthError('');
    setTimeout(() => {
      setResetSuccessMsg('');
      setIsResettingPassword(false);
    }, 2000);
  };

  // Database Backup to external JSON file
  const handleExportBackup = () => {
    const dataStr = JSON.stringify(reservations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `nfu_csie_classroom_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Database Restore from external JSON file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileErrorMsg('');
    setFileSuccessMsg('');
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            // Basic schema check
            const isValid = parsed.every(item => item && item.roomId && item.date && item.periodId && item.teacherName);
            if (isValid) {
              onImportReservations(parsed);
              setFileSuccessMsg(`資料匯入成功！共載入 ${parsed.length} 筆預約。`);
              e.target.value = ''; // Reset file input
            } else {
              setFileErrorMsg('JSON 檔案結構不合，缺少必要欄位。');
            }
          } else {
            setFileErrorMsg('匯入的資料格式必須是 JSON 陣列。');
          }
        } catch {
          setFileErrorMsg('檔案解析失敗，非有效的 JSON 格式。');
        }
      };
    }
  };

  // Export Filtered bookings list to standard CSV
  const handleExportCSV = () => {
    const headers = ['UUID', '日期', '教室', '節次', '授課教師', '學術班級', '聯絡電話/分機', '備註與環境需求', '登記日期'];
    
    const rows = filteredBookings.map(r => [
      r.id,
      r.date,
      `EC${r.roomId}`,
      `第 ${r.periodId} 節`,
      r.teacherName,
      r.targetClass,
      r.phone,
      r.notes.replace(/\r?\n|\r/g, " "), // strip linebreaks
      r.createdAt
    ]);

    // Add Unicode BOM (\uFEFF) so Microsoft Excel in Windows correctly decodes Traditional Chinese UTF-8 characters!
    let csvContent = "\ufeff" + headers.join(',') + '\n';
    rows.forEach(rowArray => {
      const escapedRow = rowArray.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`);
      csvContent += escapedRow.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nfu_csie_reservations_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sorting helper
  const handleSortToggle = (field: 'date' | 'roomId' | 'periodId') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter & Search calculations
  const filteredBookings = reservations.filter(booking => {
    const matchSearch = 
      booking.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.targetClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRoom = roomFilter === 'all' || booking.roomId === roomFilter;
    const matchPeriod = periodFilter === 'all' || booking.periodId.toString() === periodFilter;

    return matchSearch && matchRoom && matchPeriod;
  }).sort((a, b) => {
    let comparator = 0;
    if (sortField === 'date') {
      comparator = a.date.localeCompare(b.date);
    } else if (sortField === 'roomId') {
      comparator = a.roomId.localeCompare(b.roomId);
    } else if (sortField === 'periodId') {
      comparator = a.periodId - b.periodId;
    }
    return sortAsc ? comparator : -comparator;
  });

  // Classroom stats calculation (Utilization analysis)
  const getClassroomStats = () => {
    return CLASSROOM_LIST.map(room => {
      const bookingsCount = reservations.filter(r => r.roomId === room.id).length;
      return {
        id: room.id,
        name: room.id,
        fullName: room.name.split(' ')[1] || room.name,
        count: bookingsCount,
        colorClass: 
          room.id === '601' ? 'bg-blue-600' :
          room.id === '607' ? 'bg-emerald-600' :
          room.id === '513' ? 'bg-purple-600' : 'bg-amber-500'
      };
    });
  };

  const getPeriodStats = () => {
    return PERIOD_LIST.map(p => {
      const count = reservations.filter(r => r.periodId === p.id).length;
      return { id: p.id, name: p.name, count };
    });
  };

  // Find overall stats
  const totalBookingsCount = reservations.length;
  const classroomStats = getClassroomStats();
  const maxClassroomBookings = Math.max(...classroomStats.map(c => c.count), 1);
  const periodStats = getPeriodStats();
  const maxPeriodBookings = Math.max(...periodStats.map(p => p.count), 1);

  // Inline edit handlers
  const openEditModal = (booking: Reservation) => {
    setEditingBooking({ ...booking });
    setEditError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    
    if (!editingBooking.teacherName.trim()) return setEditError('請填寫教師姓名');
    if (!editingBooking.courseName.trim()) return setEditError('請填寫課程名稱');
    if (!editingBooking.targetClass.trim()) return setEditError('請填寫班級');
    if (!editingBooking.phone.trim()) return setEditError('請填寫聯絡電話');

    // Check for double bookings overlap excluding the current editing booking ID
    const overlap = reservations.find(
      r => r.id !== editingBooking.id && 
           r.roomId === editingBooking.roomId && 
           r.date === editingBooking.date && 
           r.periodId === editingBooking.periodId
    );

    if (overlap) {
      return setEditError(`此時段衝突！該時段已被 ${overlap.teacherName} 的「${overlap.courseName}」預約`);
    }

    onUpdateReservation(editingBooking);
    setEditingBooking(null);
  };

  // 7. Render Setup Password view
  if (!hasPassword) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-lg border-2 border-slate-900 p-6 sm:p-8 shadow-xl">
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center border-2 border-slate-950">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00a896]">First Time Initialization</span>
            <h2 className="text-lg font-black text-slate-900 mt-1">設定資工系管理密碼</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            本電腦教室排班系統首次啟用，請立即註冊設定一組永久密碼（四位數以上）以保障學術課表安全。
          </p>
        </div>

        <form onSubmit={handleSetupSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-bold text-red-700 flex items-center gap-1.5 leading-snug">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-650" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">設定管理登入密碼</label>
            <input
              type="password"
              placeholder="請輸入欲設定之安全密碼"
              value={setupPassword}
              onChange={(e) => setSetupPassword(e.target.value)}
              id="pwd-setup-input"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded text-slate-900 text-xs font-bold focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">再次確認全新密碼</label>
            <input
              type="password"
              placeholder="請再次輸入相同密碼以確認"
              value={setupPasswordConfirm}
              onChange={(e) => setSetupPasswordConfirm(e.target.value)}
              id="pwd-setup-confirm"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded text-slate-900 text-xs font-bold focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            id="pwd-setup-submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded transition-all cursor-pointer mt-2 tracking-widest border-b-4 border-slate-950 active:border-b-2"
          >
            鎖定密碼並授權登入
          </button>
        </form>
      </div>
    );
  }

  // 8. Render Sign In view if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-lg border-2 border-slate-900 p-6 sm:p-8 shadow-xl">
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-12 h-12 bg-slate-950 text-white rounded-lg flex items-center justify-center border-2 border-slate-900">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Access Gate</span>
            <h2 className="text-lg font-black text-slate-900 mt-1">資工系排班權限驗證</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            此頁面為管理部門專用。請輸入原初設定的管理密碼，方可授權更改、刪除、及產生資料 CSV 報表。
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-bold text-red-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-650" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">輸入管理授權碼</label>
            <input
              type="password"
              placeholder="請輸入原初設定密碼"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              id="admin-login-pwd-input"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded text-slate-900 text-xs font-bold focus:border-slate-900 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          <button
            type="submit"
            id="admin-login-pwd-submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded transition-all cursor-pointer tracking-widest border-b-4 border-slate-950 active:border-b-2"
          >
            授權密碼認證登入
          </button>
        </form>
      </div>
    );
  }

  // 9. Fully Authenticated Backend Views
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 9A. Administration Quick Panels (Stats & Reset Pwd) */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 border border-slate-800 shadow">
              <span className="text-slate-900 font-extrabold text-xs tracking-tight">NFU</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">國立虎尾科大資工系 • 電腦教室管理主控台</h2>
              <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">AUTH LEVEL: SYSTEM ADMINISTRATOR (ACTIVE SESSION)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsResettingPassword(!isResettingPassword)}
              className="px-3.5 py-1.5 bg-slate-800 border border-slate-755 hover:bg-slate-700 rounded text-xs font-bold cursor-pointer transition-colors"
            >
              更新登入密碼
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer transition-colors"
            >
              安全登出系統
            </button>
          </div>
        </div>

        {/* Change password micro form overlay if clicked */}
        {isResettingPassword && (
          <div className="mb-6 bg-slate-850 p-4 rounded-xl border border-slate-850/80 max-w-md animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">安全機制 • 更換管理密碼</h3>
            <form onSubmit={handlePasswordResetSubmit} className="space-y-3.5 text-slate-800 text-xs">
              {resetSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{resetSuccessMsg}</span>
                </div>
              )}
              {authError && (
                <div className="p-2.5 bg-red-50 text-red-800 rounded-lg font-bold">
                  {authError}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">輸入新密碼</label>
                <input
                  type="password"
                  placeholder="請輸入新管理密碼"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  id="reset-pwd-input"
                  className="w-full px-3 py-1.5 border border-slate-700 rounded-md bg-slate-800 text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">確認新密碼</label>
                <input
                  type="password"
                  placeholder="再輸入一次新密碼"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  id="reset-pwd-confirm"
                  className="w-full px-3 py-1.5 border border-slate-700 rounded-md bg-slate-800 text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsResettingPassword(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  取消
                </button>
                <button
                  type="submit"
                  id="submit-reset-pwd-btn"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
                >
                  確認修改
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dynamic visual statistics grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bento box 1: Classroom utilization ranking */}
          <div className="bg-slate-850 p-4 rounded-lg border border-slate-800 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-extrabold text-slate-200">排班教室高低頻率分佈</span>
            </div>
            
            <div className="space-y-3.5">
              {classroomStats.map((room) => {
                const percent = totalBookingsCount > 0 ? (room.count / maxClassroomBookings) * 100 : 0;
                return (
                  <div key={room.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-300">CSIE {room.name} 電腦教室</span>
                      <span className="font-mono font-bold text-slate-400">{room.count} 節次</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                      <div 
                        className={`h-full ${room.colorClass} transition-all duration-1000`} 
                        style={{ width: `${percent || 2}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bento box 2: Peak Period analysis */}
          <div className="bg-slate-850 p-4 rounded-lg border border-slate-800 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold text-slate-200">節次排課使用規律</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {periodStats.map((p) => {
                const heightPercent = maxPeriodBookings > 0 ? (p.count / maxPeriodBookings) * 100 : 0;
                return (
                  <div key={p.id} className="flex flex-col justify-end items-center h-24">
                    <div className="text-[10px] text-emerald-400 font-mono font-bold mb-1">{p.count}</div>
                    <div className="w-5 bg-emerald-950/40 border border-emerald-500/20 rounded-t-sm relative h-14 flex items-end">
                      <div 
                        className="bg-emerald-500 w-full rounded-t-sm transition-all duration-1000"
                        style={{ height: `${heightPercent || 5}%` }}
                      />
                    </div>
                    <div className="text-[9px] text-slate-400 mt-2 whitespace-nowrap font-sans font-bold">
                      第 {p.id} 節
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bento box 3: System Data snapshots Operations (Restore Backup) */}
          <div className="bg-slate-850 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-extrabold text-slate-200">永續資料本地傳承系統</span>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
              本系統之運作資料均儲存於此瀏覽器之 LocalState。若師生更換電腦、清除快取或伺服器重置，您可以藉由以下按鈕將排課資料完整備份或全盤還原：
            </p>

            <div className="flex flex-col gap-2 pt-1 text-[11px]">
              <button
                onClick={handleExportBackup}
                id="export-backup-btn"
                className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>匯出登記資料庫 (JSON備份鍵)</span>
              </button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  id="import-backup-file-input"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                />
                <button
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-purple-900/40 hover:bg-purple-950 text-purple-200 font-bold rounded border border-purple-500/20 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>導入備份還原資料 (JSON導入鍵)</span>
                </button>
              </div>
            </div>

            {/* Upload notifications feedback */}
            {fileSuccessMsg && (
              <p className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 p-1.5 rounded">{fileSuccessMsg}</p>
            )}
            {fileErrorMsg && (
              <p className="text-[10px] text-red-400 font-bold bg-red-500/10 p-1.5 rounded">{fileErrorMsg}</p>
            )}
          </div>

        </div>
      </div>

      {/* 9B. Booking filter tools */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4.5 h-4.5 text-blue-600" />
            排班資料篩選與管理 ({filteredBookings.length} 筆項目)
          </h3>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm ml-auto md:ml-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>匯出篩選報表 (Excel CSV)</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="搜尋教師、課程等關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="admin-search-input"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Classroom Filter */}
          <div className="flex items-center space-x-1.5">
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              id="admin-room-filter"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">所有電腦教室</option>
              {CLASSROOM_LIST.map(r => (
                <option key={r.id} value={r.id}>EC{r.id} 科技教室</option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div className="flex items-center space-x-1.5">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              id="admin-period-filter"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">所有節次 (1~8)</option>
              {PERIOD_LIST.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.time})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 9C. Active Reservation Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse table-auto text-xs bg-white">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">
                  <button 
                    onClick={() => handleSortToggle('date')}
                    className="flex items-center gap-1 hover:text-blue-600 cursor-pointer text-left"
                  >
                    <span>使用日期</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-3">
                  <button 
                    onClick={() => handleSortToggle('roomId')}
                    className="flex items-center gap-1 hover:text-blue-600 cursor-pointer text-left"
                  >
                    <span>教室</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-3">
                  <button 
                    onClick={() => handleSortToggle('periodId')}
                    className="flex items-center gap-1 hover:text-blue-600 cursor-pointer text-left font-bold"
                  >
                    <span>課堂節次</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold">學術課程名稱</th>
                <th className="py-3.5 px-3 font-bold">授課教師/教授</th>
                <th className="py-3.5 px-3 font-bold">借用班級</th>
                <th className="py-3.5 px-3 font-bold">聯絡電話</th>
                <th className="py-3.5 px-4 font-bold">備註與系統需求</th>
                <th className="py-3.5 px-4 text-center font-bold">後台行政管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const isPendingDelete = deleteConfirmId === booking.id;
                  
                  return (
                    <tr 
                      key={booking.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        isPendingDelete ? 'bg-red-50/60' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {formatDisplayDate(booking.date)}
                      </td>

                      {/* Room ID Badge */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-mono font-bold tracking-wide ${
                          booking.roomId === '601' ? 'bg-blue-100 text-blue-800' :
                          booking.roomId === '607' ? 'bg-emerald-100 text-emerald-800' :
                          booking.roomId === '513' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          EC{booking.roomId}
                        </span>
                      </td>

                      {/* Period Time details */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-medium">
                        第 {booking.periodId} 節
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          {PERIOD_LIST.find(p => p.id === booking.periodId)?.time}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-[150px] truncate">
                        {booking.courseName}
                      </td>

                      {/* Teacher */}
                      <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap text-left">
                        {booking.teacherName}
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-3 font-semibold text-slate-650 whitespace-nowrap">
                        {booking.targetClass}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {booking.phone}
                      </td>

                      {/* Notes text block */}
                      <td className="py-3.5 px-4 text-slate-500 max-w-[185px] leading-relaxed break-words italic">
                        {booking.notes || '—'}
                      </td>

                      {/* Operations */}
                      <td className="py-3.5 px-4 text-center">
                        {isPendingDelete ? (
                          /* Del confirms panel */
                          <div className="flex items-center justify-center gap-1.5 animate-in zoom-in-95 duration-150">
                            <span className="text-[10px] text-red-700 font-bold whitespace-nowrap">確定刪除？</span>
                            <button
                              onClick={() => {
                                onDeleteReservation(booking.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              是
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-350 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                            >
                              否
                            </button>
                          </div>
                        ) : (
                          /* Standard buttons */
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditModal(booking)}
                              className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 rounded-md transition-colors cursor-pointer"
                              title="編改此筆資料"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(booking.id)}
                              className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                              title="刪除此筆資料"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    找不到符合條件的預約記錄。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9D. Inline Edit Reservation Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={() => setEditingBooking(null)} />
          
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-600" />
                行政修改排班細節
              </h3>
              <button 
                onClick={() => setEditingBooking(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg text-slate-600 font-medium font-mono text-[11px]">
                <div>日期: {editingBooking.date}</div>
                <div>節次: 第 {editingBooking.periodId} 節</div>
              </div>

              {/* Classroom modify */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">電腦教室調整</label>
                <select
                  value={editingBooking.roomId}
                  onChange={(e) => setEditingBooking({ ...editingBooking, roomId: e.target.value as ClassroomId })}
                  id="admin-edit-room-select"
                  className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-slate-800 text-xs"
                >
                  {CLASSROOM_LIST.map(r => (
                    <option key={r.id} value={r.id}>EC{r.id} 科技教室 ({r.name.split(' ')[1]})</option>
                  ))}
                </select>
              </div>

              {/* Period modify */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">節次調整</label>
                <select
                  value={editingBooking.periodId}
                  onChange={(e) => setEditingBooking({ ...editingBooking, periodId: parseInt(e.target.value) })}
                  id="admin-edit-period-select"
                  className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-slate-800 text-xs"
                >
                  {PERIOD_LIST.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.time})</option>
                  ))}
                </select>
              </div>

              {/* Course name */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">學術課程/用途名稱</label>
                <input
                  type="text"
                  required
                  value={editingBooking.courseName}
                  onChange={(e) => setEditingBooking({ ...editingBooking, courseName: e.target.value })}
                  id="admin-edit-course-input"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Teacher */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">授課教師</label>
                <input
                  type="text"
                  required
                  value={editingBooking.teacherName}
                  onChange={(e) => setEditingBooking({ ...editingBooking, teacherName: e.target.value })}
                  id="admin-edit-teacher-input"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Target Class */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">使用班級</label>
                <input
                  type="text"
                  required
                  value={editingBooking.targetClass}
                  onChange={(e) => setEditingBooking({ ...editingBooking, targetClass: e.target.value })}
                  id="admin-edit-class-input"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">聯絡電話</label>
                <input
                  type="text"
                  required
                  value={editingBooking.phone}
                  onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                  id="admin-edit-phone-input"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">備註需求</label>
                <textarea
                  rows={2}
                  value={editingBooking.notes}
                  onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                  id="admin-edit-notes-input"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end border-t pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-3.5 py-1.5 text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  id="admin-edit-submit-btn"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
