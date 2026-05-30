/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { School, Clock, Settings, LogOut, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onAdminToggle: () => void;
  bookingCount: number;
}

export default function Header({ isAdmin, onAdminToggle, bookingCount }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t: Date) => {
    return t.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <header className="bg-blue-900 border-b border-blue-950 text-white shadow-md print:hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
              <span className="text-blue-900 font-extrabold text-sm tracking-tighter" id="header-brand-icon">
                NFU
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-800 text-blue-200 px-2 py-0.5 rounded-md border border-blue-700/60 font-mono">
                  NFU CSIE Labs
                </span>
                <span className="text-[11px] font-medium text-blue-200">國立虎尾科技大學</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                資訊工程系 <span className="text-emerald-400">電腦教室排班系統</span>
              </h1>
            </div>
          </div>

          {/* Stats and Functional Badges */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Live Clock */}
            <div className="flex items-center space-x-2 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800/40 font-mono text-[11px] text-blue-100 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{formatTime(time)}</span>
            </div>

            {/* Total Bookings Stat */}
            <div className="bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800/40 text-[11px] text-blue-100 shadow-inner">
              系統累計預約:{' '}
              <span className="font-extrabold text-yellow-300 font-mono">{bookingCount}</span> 筆
            </div>

            {/* Admin Toggle button */}
            <button
              onClick={onAdminToggle}
              id="admin-toggle-btn"
              className={`flex items-center space-x-1.5 px-4.5 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-sm transition-all duration-300 cursor-pointer ${
                isAdmin
                  ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500'
                  : 'bg-white hover:bg-blue-50 text-blue-900 border border-slate-100'
              }`}
            >
              {isAdmin ? (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>結束管理</span>
                </>
              ) : (
                <>
                  <Settings className="w-3.5 h-3.5" />
                  <span>管理後台登入</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
