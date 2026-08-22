import React from 'react';
import { CalendarDay, Employee } from '../types';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: CalendarDay | null;
  employees: Employee[];
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  day,
  employees
}) => {
  if (!isOpen || !day) return null;

  const dateString = `October ${day.dayNumber}, 2023`;

  const getStatusBadge = () => {
    switch (day.status) {
      case 'present':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Normal Working Day
          </span>
        );
      case 'absent':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Elevated Absence Rate
          </span>
        );
      case 'half-day':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Scheduled Half-Day
          </span>
        );
      case 'leave':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-[#0058BE] rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0058BE]"></span>
            Approved Leave Window
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
            Weekend / Non-Working
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col border border-[#E4E2E4] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E4E2E4] bg-[#F6F3F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex flex-col items-center justify-center font-bold">
              <span className="text-[10px] uppercase text-[#BEC6E0]">OCT</span>
              <span className="text-[15px] leading-none">{day.dayNumber}</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1B1B1D]">{dateString}</h2>
              <div className="mt-0.5">{getStatusBadge()}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#76777D] hover:text-black p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="text-xs text-emerald-800 font-medium">Present</div>
              <div className="text-lg font-bold font-mono-numbers text-emerald-700">
                {day.presentCount || (day.status === 'present' ? 108 : 0)}
              </div>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
              <div className="text-xs text-rose-800 font-medium">Absent</div>
              <div className="text-lg font-bold font-mono-numbers text-rose-700">
                {day.absentCount || (day.status === 'absent' ? 8 : 0)}
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-xs text-[#0058BE] font-medium">On Leave</div>
              <div className="text-lg font-bold font-mono-numbers text-[#0058BE]">
                {day.leaveCount || (day.status === 'leave' ? 12 : 2)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#45464D] uppercase tracking-wider mb-2">
              Staff Attendance Log Sample
            </h3>
            <div className="divide-y divide-[#F0EDEF] border border-[#E4E2E4] rounded-lg overflow-hidden bg-white">
              {employees.slice(0, 5).map((emp, i) => {
                let statusLabel = 'Present';
                let statusColor = 'text-emerald-700 bg-emerald-50';
                if (day.status === 'leave' && i < 2) {
                  statusLabel = 'Approved Leave';
                  statusColor = 'text-[#0058BE] bg-blue-50';
                } else if (day.status === 'absent' && i === 2) {
                  statusLabel = 'Unplanned Absence';
                  statusColor = 'text-rose-700 bg-rose-50';
                } else if (day.status === 'half-day' && i === 1) {
                  statusLabel = 'Half Day (AM)';
                  statusColor = 'text-amber-700 bg-amber-50';
                }

                return (
                  <div key={emp.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#E4E2E4] font-semibold text-xs flex items-center justify-center text-black">
                        {emp.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1B1B1D]">{emp.name}</div>
                        <div className="text-[11px] text-[#76777D]">{emp.department}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E2E4] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white hover:bg-[#3F465C] rounded-lg font-semibold text-xs transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
