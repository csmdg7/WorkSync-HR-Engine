import React, { useState } from 'react';
import { Employee, PendingLeave, MissingCheckout } from '../types';

interface AttendanceViewProps {
  employees: Employee[];
  pendingLeaves: PendingLeave[];
  missingCheckouts: MissingCheckout[];
  onOpenActionCenter: (tab: 'leaves' | 'checkouts') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  employees,
  pendingLeaves,
  missingCheckouts,
  onOpenActionCenter
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'shifts' | 'kiosk'>('roster');
  const [kioskStatus, setKioskStatus] = useState<string | null>(null);

  const presentCount = employees.filter((e) => e.attendanceStatus === 'Present').length;
  const leaveCount = employees.filter((e) => e.attendanceStatus === 'Leave').length;
  const halfDayCount = employees.filter((e) => e.attendanceStatus === 'Half-day').length;

  const handleSimulateSwipe = (empName: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setKioskStatus(`Badge scan verified for ${empName} at ${time}. Status: Recorded.`);
    setTimeout(() => setKioskStatus(null), 4000);
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#1B1B1D] tracking-tight leading-tight">
            Workforce Attendance & Shifts
          </h2>
          <p className="text-[16px] text-[#45464D] mt-1">
            Real-time shift logs, biometric check-ins, and leave schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenActionCenter('leaves')}
            className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">beach_access</span>
            <span>Review Leaves ({pendingLeaves.filter((l) => l.status === 'pending').length})</span>
          </button>
          <button
            onClick={() => onOpenActionCenter('checkouts')}
            className="px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Missing Checkouts ({missingCheckouts.filter((c) => c.status === 'pending').length})</span>
          </button>
        </div>
      </div>

      {kioskStatus && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
          <span>{kioskStatus}</span>
        </div>
      )}

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#76777D] block mb-1">Present on Campus</span>
            <div className="text-3xl font-bold font-mono-numbers text-emerald-700">{presentCount}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">90% Daily turn-out</div>
          </div>
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
            <span className="material-symbols-outlined text-[24px]">how_to_reg</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#76777D] block mb-1">Active Leave Approvals</span>
            <div className="text-3xl font-bold font-mono-numbers text-[#0058BE]">{leaveCount}</div>
            <div className="text-[11px] text-[#0058BE] font-medium mt-1">Annual, Sick & Casual</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-xl text-[#0058BE]">
            <span className="material-symbols-outlined text-[24px]">event_busy</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#76777D] block mb-1">Half-Day Rosters</span>
            <div className="text-3xl font-bold font-mono-numbers text-amber-700">{halfDayCount}</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Morning & Afternoon slots</div>
          </div>
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
            <span className="material-symbols-outlined text-[24px]">timelapse</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-[#E4E2E4] rounded-t-xl px-5 py-3 border-b-0 flex items-center gap-2">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'roster' ? 'bg-black text-white' : 'bg-[#F0EDEF] text-[#45464D] hover:bg-[#EAE7E9]'
          }`}
        >
          Daily Attendance Roster
        </button>
        <button
          onClick={() => setActiveSubTab('kiosk')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'kiosk' ? 'bg-black text-white' : 'bg-[#F0EDEF] text-[#45464D] hover:bg-[#EAE7E9]'
          }`}
        >
          Badge Swipe Simulator
        </button>
      </div>

      {/* Sub-tab 1: Roster */}
      {activeSubTab === 'roster' && (
        <div className="bg-white border border-[#E4E2E4] rounded-b-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F5F9] border-b border-[#E4E2E4] text-[12px] font-bold text-[#45464D] uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-semibold">Employee</th>
                  <th className="py-3.5 px-5 font-semibold">Department</th>
                  <th className="py-3.5 px-5 font-semibold">Today's Status</th>
                  <th className="py-3.5 px-5 font-semibold">First Badge In</th>
                  <th className="py-3.5 px-5 font-semibold">Shift Hours</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="text-[14px] divide-y divide-[#E4E2E4]/60">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-medium text-[#1B1B1D] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E4E2E4] flex items-center justify-center text-black font-semibold text-xs shrink-0">
                        {emp.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{emp.name}</div>
                        <div className="text-xs text-[#76777D]">{emp.role}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-[#45464D]">{emp.department}</td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          emp.attendanceStatus === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : emp.attendanceStatus === 'Leave'
                            ? 'bg-blue-100 text-[#0058BE]'
                            : emp.attendanceStatus === 'Half-day'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {emp.attendanceStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono-numbers text-xs text-[#1B1B1D]">
                      {emp.attendanceStatus === 'Present' ? '08:52 AM' : emp.attendanceStatus === 'Half-day' ? '09:15 AM' : '—'}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-[#76777D]">
                      {emp.attendanceStatus === 'Leave' ? 'On Approved Leave' : '9 hrs (General Day)'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleSimulateSwipe(emp.name)}
                        className="px-2.5 py-1 bg-slate-100 text-black hover:bg-slate-200 rounded text-xs font-semibold transition-colors"
                      >
                        Log Scan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Kiosk Simulator */}
      {activeSubTab === 'kiosk' && (
        <div className="bg-white border border-[#E4E2E4] rounded-b-xl p-6 shadow-xs">
          <div className="max-w-md mx-auto text-center py-6">
            <div className="w-16 h-16 bg-blue-100 text-[#0058BE] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">tap_and_play</span>
            </div>
            <h3 className="text-lg font-bold text-[#1B1B1D] mb-1">Biometric Attendance Kiosk</h3>
            <p className="text-xs text-[#76777D] mb-6">
              Simulate turnstile badge taps for workforce members to test automated attendance reconciliation.
            </p>
            <div className="space-y-2">
              {employees.slice(0, 5).map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => handleSimulateSwipe(emp.name)}
                  className="w-full p-3 border border-[#E4E2E4] hover:border-[#0058BE] hover:bg-blue-50/50 rounded-xl flex items-center justify-between text-xs font-semibold text-[#1B1B1D] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                      {emp.initials}
                    </span>
                    <span>{emp.name} ({emp.role})</span>
                  </div>
                  <span className="text-[#0058BE] font-mono-numbers">Simulate Swipe →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
