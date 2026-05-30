/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Classroom, CLASSROOM_LIST } from '../types';
import { Users, MapPin, Info, CheckCircle2 } from 'lucide-react';

interface ClassroomInfoProps {
  selectedRoomId: string;
  onSelectRoom: (roomId: any) => void;
  reservations: any[];
}

export default function ClassroomInfo({ selectedRoomId, onSelectRoom, reservations }: ClassroomInfoProps) {
  
  // Calculate bookings today for each classroom
  const getTodayBookingCount = (roomId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return reservations.filter(r => r.roomId === roomId && r.date === todayStr).length;
  };

  return (
    <div className="space-y-4 print:hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-700 rounded-sm" />
            快速切換電腦教室
          </h2>
          <p className="text-[11px] text-slate-500">
            請點選教室檢視當週排班現況與借用細節（今日有排班時，綠色指示燈亮起）
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLASSROOM_LIST.map((room) => {
          const isSelected = selectedRoomId === room.id;
          const todayBookings = getTodayBookingCount(room.id);
          
          let ringColor = 'border-slate-200 hover:border-slate-350';
          let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
          let leftBorderColor = 'border-l-4 border-l-slate-300';

          if (room.id === '601') {
            ringColor = isSelected ? 'border-blue-600 bg-blue-50/5 ring-1 ring-blue-500/20' : 'hover:border-blue-300';
            badgeColor = 'bg-blue-50 text-blue-700 border-blue-100';
            leftBorderColor = isSelected ? 'border-l-4 border-l-blue-600' : 'border-l-4 border-l-slate-300/50';
          } else if (room.id === '607') {
            ringColor = isSelected ? 'border-emerald-600 bg-emerald-50/5 ring-1 ring-emerald-500/20' : 'hover:border-emerald-300';
            badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-100';
            leftBorderColor = isSelected ? 'border-l-4 border-l-emerald-600' : 'border-l-4 border-l-slate-300/50';
          } else if (room.id === '513') {
            ringColor = isSelected ? 'border-purple-600 bg-purple-50/5 ring-1 ring-purple-500/20' : 'hover:border-purple-300';
            badgeColor = 'bg-purple-50 text-purple-800 border-purple-100';
            leftBorderColor = isSelected ? 'border-l-4 border-l-purple-600' : 'border-l-4 border-l-slate-300/50';
          } else if (room.id === '502') {
            ringColor = isSelected ? 'border-amber-600 bg-amber-50/5 ring-1 ring-amber-500/20' : 'hover:border-amber-300';
            badgeColor = 'bg-amber-50 text-amber-800 border-amber-100';
            leftBorderColor = isSelected ? 'border-l-4 border-l-amber-600' : 'border-l-4 border-l-slate-300/50';
          }

          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              id={`room-card-${room.id}`}
              className={`text-left bg-white p-4.5 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-sm ${ringColor} ${leftBorderColor} ${
                isSelected ? 'shadow-md shadow-slate-100' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2.5">
                <span className={`text-[11px] px-2.5 py-0.5 rounded border font-bold font-mono ${badgeColor}`}>
                  CSIE {room.id}
                </span>
                
                {todayBookings > 0 ? (
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                    今日 ({todayBookings})
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">空閒</span>
                )}
              </div>

              <h3 className="font-extrabold text-slate-805 text-xs sm:text-sm line-clamp-1 mb-2">
                {room.name.split(' ').slice(1).join(' ') || room.name}
              </h3>

              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{room.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>容納 {room.capacity} 人</span>
                </div>
              </div>

              <p className="mt-3 text-[10px] text-slate-400 line-clamp-2 leading-relaxed border-t border-slate-100 pt-2.5">
                {room.description}
              </p>

              {isSelected && (
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] bg-slate-900 text-white font-extrabold px-1.5 py-0.5 rounded">
                    已選取
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
