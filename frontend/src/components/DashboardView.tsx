import React, { useState } from 'react';
import { Employee, PendingLeave, MissingCheckout, PayrollReview, LifecycleMilestone, CalendarDay, NavTab } from '../types';
import { octoberDays } from '../data/mockData';

interface DashboardViewProps {
  employees: Employee[];
  pendingLeaves: PendingLeave[];
  missingCheckouts: MissingCheckout[];
  payrollReviews: PayrollReview[];
  lifecycleMilestones: LifecycleMilestone[];
  onOpenActionCenter: (tab: 'leaves' | 'checkouts' | 'payroll') => void;
  onSelectEmployee: (employee: Employee) => void;
  onOpenDayDetail: (day: CalendarDay) => void;
  onToggleVerifyPayroll: (id: string) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  pendingLeaves,
  missingCheckouts,
  payrollReviews,
  lifecycleMilestones,
  onOpenActionCenter,
  onSelectEmployee,
  onOpenDayDetail,
  onToggleVerifyPayroll,
  setActiveTab
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);
  const months = ['October 2023', 'November 2023', 'December 2023'];

  const pendingLeavesCount = pendingLeaves.filter((l) => l.status === 'pending').length;
  const missingCheckoutsCount = missingCheckouts.filter((c) => c.status === 'pending').length;
  const payrollReviewsCount = payrollReviews.filter((p) => p.status === 'pending').length;

  const totalEmployeesCount = employees.length > 8 ? employees.length : 120;
  const presentCount = 108;
  const onLeaveCount = 12;
  const isAllPayrollVerified = employees.slice(0, 4).every((e) => e.isPayrollVerified);

  return (
    <div className="max-w-[1440px] mx-auto w-full pb-12">
      {/* Title Section */}
      <div className="mb-8">
        <h2 className="text-[28px] md:text-[36px] font-bold text-[#1B1B1D] tracking-tight leading-tight">
          Dashboard Overview
        </h2>
        <p className="text-[16px] text-[#45464D] mt-1">Real-time pulse of your workforce.</p>
      </div>

      {/* KPI Row (4 Stats Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Stat 1: Total Employees */}
        <div
          onClick={() => setActiveTab('employees')}
          className="bg-white border border-[#E4E2E4] rounded-xl p-4 md:p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#0058BE]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[18px] font-semibold text-[#1B1B1D]">Total Employees</span>
            <span className="material-symbols-outlined text-[#0058BE] bg-[#0058BE]/10 p-1.5 rounded-lg text-[20px]">
              group
            </span>
          </div>
          <div className="text-[36px] font-bold text-[#1B1B1D] leading-none relative z-10">
            {totalEmployeesCount}
          </div>
          <div className="text-[14px] text-[#45464D] mt-2 flex items-center gap-1 relative z-10">
            <span className="text-[#0058BE] font-semibold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +3%
            </span>{' '}
            this month
          </div>
        </div>

        {/* Stat 2: Present Today */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white border border-[#E4E2E4] rounded-xl p-4 md:p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[18px] font-semibold text-[#1B1B1D]">Present Today</span>
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-100 p-1.5 rounded-lg text-[20px]">
              how_to_reg
            </span>
          </div>
          <div className="text-[36px] font-bold text-[#1B1B1D] leading-none relative z-10">
            {presentCount}
          </div>
          <div className="text-[14px] text-[#45464D] mt-2 flex items-center gap-1 relative z-10">
            <span className="text-emerald-600 font-semibold flex items-center">90%</span> attendance rate
          </div>
        </div>

        {/* Stat 3: On Leave */}
        <div
          onClick={() => onOpenActionCenter('leaves')}
          className="bg-white border border-[#E4E2E4] rounded-xl p-4 md:p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[18px] font-semibold text-[#1B1B1D]">On Leave</span>
            <span className="material-symbols-outlined text-[#BA1A1A] bg-[#BA1A1A]/10 p-1.5 rounded-lg text-[20px]">
              event_busy
            </span>
          </div>
          <div className="text-[36px] font-bold text-[#1B1B1D] leading-none relative z-10">
            {onLeaveCount}
          </div>
          <div className="text-[14px] text-[#45464D] mt-2 flex items-center gap-1 relative z-10">
            {pendingLeavesCount} pending approvals
          </div>
        </div>

        {/* Stat 4: Payroll Status */}
        <div
          onClick={() => setActiveTab('payroll')}
          className="bg-white border border-[#E4E2E4] rounded-xl p-4 md:p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#2170E4]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[18px] font-semibold text-[#1B1B1D]">Payroll Status</span>
            <span className="material-symbols-outlined text-[#2170E4] bg-[#2170E4]/10 p-1.5 rounded-lg text-[20px]">
              account_balance_wallet
            </span>
          </div>
          <div className="text-[28px] font-bold text-[#1B1B1D] mt-2 leading-tight relative z-10">
            {isAllPayrollVerified ? 'Verified' : `${payrollReviewsCount} Reviews`}
          </div>
          <div className="text-[14px] text-[#45464D] mt-2 flex items-center gap-1 relative z-10">
            Next run in 4 days
          </div>
        </div>
      </div>

      {/* Bento Grid: Action Center & Smart Attendance Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Action Center (Col 1) */}
        <div className="bg-white border border-[#E4E2E4] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col h-full lg:col-span-1 overflow-hidden">
          <div className="p-5 border-b border-[#E4E2E4] flex justify-between items-center bg-[#F6F3F5] rounded-t-xl">
            <h3 className="text-[18px] font-semibold text-[#1B1B1D] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-black">campaign</span>
              Action Center
            </h3>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4">
            {/* Item 1: Pending Leaves */}
            <div
              id="action-item-leaves"
              onClick={() => onOpenActionCenter('leaves')}
              className="flex items-start justify-between p-3 rounded-lg border border-[#E4E2E4]/60 hover:bg-[#F6F3F5] transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="bg-[#BA1A1A]/10 p-2 rounded-lg text-[#BA1A1A] group-hover:bg-[#BA1A1A] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">beach_access</span>
                </div>
                <div>
                  <h4 className="text-[16px] text-[#1B1B1D] font-semibold">
                    {pendingLeavesCount} Pending Leaves
                  </h4>
                  <p className="text-[14px] text-[#45464D]">Requires immediate review</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#45464D] text-[18px] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>

            {/* Item 2: Missing Checkouts */}
            <div
              id="action-item-checkouts"
              onClick={() => onOpenActionCenter('checkouts')}
              className="flex items-start justify-between p-3 rounded-lg border border-[#E4E2E4]/60 hover:bg-[#F6F3F5] transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                </div>
                <div>
                  <h4 className="text-[16px] text-[#1B1B1D] font-semibold">
                    {missingCheckoutsCount} Missing Checkouts
                  </h4>
                  <p className="text-[14px] text-[#45464D]">From yesterday's shift</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#45464D] text-[18px] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>

            {/* Item 3: Payroll Reviews */}
            <div
              id="action-item-payroll"
              onClick={() => onOpenActionCenter('payroll')}
              className="flex items-start justify-between p-3 rounded-lg border border-[#E4E2E4]/60 hover:bg-[#F6F3F5] transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                </div>
                <div>
                  <h4 className="text-[16px] text-[#1B1B1D] font-semibold">
                    {payrollReviewsCount} Payroll Reviews
                  </h4>
                  <p className="text-[14px] text-[#45464D]">Discrepancies found</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#45464D] text-[18px] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>
          </div>
        </div>

        {/* Smart Attendance Calendar (Col 2 & 3) */}
        <div className="bg-white border border-[#E4E2E4] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#E4E2E4] flex justify-between items-center bg-[#F6F3F5]">
            <h3 className="text-[18px] font-semibold text-[#1B1B1D] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-black">calendar_month</span>
              Smart Attendance Calendar
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 0))}
                className="p-1 rounded hover:bg-[#E4E2E4]/50 text-[#45464D] transition-colors cursor-pointer"
                title="Previous Month"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="text-[14px] font-semibold text-[#1B1B1D] min-w-[100px] text-center">
                {months[currentMonthIndex]}
              </span>
              <button
                onClick={() => setCurrentMonthIndex((prev) => (prev < months.length - 1 ? prev + 1 : prev))}
                className="p-1 rounded hover:bg-[#E4E2E4]/50 text-[#45464D] transition-colors cursor-pointer"
                title="Next Month"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="p-5">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-[12px] font-semibold text-[#45464D] tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Half-day
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0058BE]" /> Leave
              </span>
            </div>

            {/* Minimalist Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[14px]">
              {/* Days Header */}
              <div className="text-[#45464D] font-semibold py-2">M</div>
              <div className="text-[#45464D] font-semibold py-2">T</div>
              <div className="text-[#45464D] font-semibold py-2">W</div>
              <div className="text-[#45464D] font-semibold py-2">T</div>
              <div className="text-[#45464D] font-semibold py-2">F</div>
              <div className="text-[#45464D] font-semibold py-2">S</div>
              <div className="text-[#45464D] font-semibold py-2">S</div>

              {/* Exact Days Matching the HTML / Design */}
              {octoberDays.slice(0, 21).map((day, idx) => {
                let cellClasses = 'p-2 rounded flex items-center justify-center transition-all cursor-pointer select-none ';

                if (!day.isCurrentMonth) {
                  cellClasses += 'border border-[#E4E2E4]/40 opacity-50 text-[#76777D] hover:bg-[#F6F3F5]';
                } else if (day.status === 'present') {
                  cellClasses += 'border border-emerald-500/30 bg-emerald-500/5 font-semibold text-emerald-700 hover:bg-emerald-500/15';
                } else if (day.status === 'absent') {
                  cellClasses += 'border border-rose-500/30 bg-rose-500/5 font-semibold text-rose-700 relative hover:bg-rose-500/15';
                } else if (day.status === 'half-day') {
                  cellClasses += 'border border-amber-500/30 bg-amber-500/5 font-semibold text-amber-700 hover:bg-amber-500/15';
                } else if (day.status === 'leave') {
                  cellClasses += 'border border-[#0058BE]/30 bg-[#0058BE]/5 font-semibold text-[#0058BE] hover:bg-[#0058BE]/15';
                } else {
                  cellClasses += 'border border-[#E4E2E4]/40 hover:bg-[#F6F3F5] text-[#1B1B1D]';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => onOpenDayDetail(day)}
                    className={cellClasses}
                    title={`Click to view Oct ${day.dayNumber} roster`}
                  >
                    {day.dayNumber}
                    {day.hasDot && (
                      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Payroll Verification Table & Employee Lifecycle Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8">
        {/* Payroll Verification Table (Col 1 & 2) */}
        <div className="bg-white border border-[#E4E2E4] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#E4E2E4] flex justify-between items-center bg-[#F6F3F5]">
            <h3 className="text-[18px] font-semibold text-[#1B1B1D] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-black">price_check</span>
              Payroll Verification
            </h3>
            <button
              onClick={() => setActiveTab('payroll')}
              className="text-[#0058BE] text-[12px] font-bold tracking-wider uppercase hover:underline cursor-pointer"
            >
              VIEW ALL
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F5F9] border-b border-[#E4E2E4] text-[12px] font-bold text-[#45464D] uppercase tracking-wider">
                  <th className="py-3 px-5 font-semibold">Employee</th>
                  <th className="py-3 px-5 font-semibold">Base Salary</th>
                  <th className="py-3 px-5 font-semibold">Allowances</th>
                  <th className="py-3 px-5 font-semibold">Deductions</th>
                  <th className="py-3 px-5 font-semibold">Net Salary</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-[14px] divide-y divide-[#E4E2E4]/50">
                {employees.slice(0, 4).map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    <td className="py-3 px-5 font-medium text-[#1B1B1D] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E4E2E4] flex items-center justify-center text-black font-semibold text-xs shrink-0">
                        {emp.initials}
                      </div>
                      <span className="group-hover:text-[#0058BE] font-medium">{emp.name}</span>
                    </td>
                    <td className="py-3 px-5 font-mono-numbers text-[#45464D]">
                      ${emp.baseSalary.toLocaleString()}.00
                    </td>
                    <td className="py-3 px-5 font-mono-numbers text-emerald-600">
                      +${emp.allowances.toLocaleString()}.00
                    </td>
                    <td className="py-3 px-5 font-mono-numbers text-rose-600">
                      -${emp.deductions.toLocaleString()}.00
                    </td>
                    <td className="py-3 px-5 font-mono-numbers font-bold text-[#1B1B1D]">
                      ${emp.netSalary.toLocaleString()}.00
                    </td>
                    <td
                      className="py-3 px-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {emp.isPayrollVerified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold tracking-wider">
                          <span className="material-symbols-outlined text-[12px] mr-1">check_circle</span>
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => onToggleVerifyPayroll(emp.id)}
                          className="inline-flex items-center px-2.5 py-1 rounded bg-[#0058BE] text-white text-[10px] uppercase font-bold tracking-wider hover:bg-[#004395] active:scale-95 transition-all shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[12px] mr-1">pending_actions</span>
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Lifecycle Timeline (Col 3) */}
        <div className="bg-white border border-[#E4E2E4] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[#E4E2E4] flex justify-between items-center bg-[#F6F3F5] rounded-t-xl">
            <h3 className="text-[18px] font-semibold text-[#1B1B1D] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-black">route</span>
              Lifecycle Milestones
            </h3>
            <button
              onClick={() => setActiveTab('lifecycle')}
              className="text-[#0058BE] text-[12px] font-bold uppercase tracking-wider hover:underline"
            >
              All Events
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto relative">
            {/* Vertical line connecting milestones */}
            <div className="absolute left-[33px] top-8 bottom-8 w-px bg-[#E4E2E4]" />

            <div className="space-y-6 relative">
              {lifecycleMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full ${milestone.iconBg} border-2 border-white shadow-xs flex items-center justify-center ${milestone.iconColor} relative z-10 shrink-0`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{milestone.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-[#1B1B1D]">{milestone.title}</h4>
                    <p className="text-[14px] text-[#45464D]">{milestone.subtitle}</p>
                    <span className="text-[12px] font-semibold text-[#45464D]/70 mt-1 block uppercase tracking-wider">
                      {milestone.timeLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
