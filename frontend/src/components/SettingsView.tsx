import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [companyName, setCompanyName] = useState('DayFlow Technologies Inc.');
  const [payrollCycle, setPayrollCycle] = useState('Bi-weekly (1st and 15th)');
  const [overtimeRate, setOvertimeRate] = useState('1.5x Base Rate');
  const [autoCheckoutHours, setAutoCheckoutHours] = useState('9');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full pb-12">
      <div className="mb-6">
        <h2 className="text-[28px] md:text-[36px] font-bold text-[#1B1B1D] tracking-tight leading-tight">
          Admin Portal Settings
        </h2>
        <p className="text-[16px] text-[#45464D] mt-1">
          Configure company workforce rules, payroll schedules, and attendance reconciliation policies.
        </p>
      </div>

      {savedNotice && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Configuration saved and active across all HR Command Center services.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Section */}
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-[#1B1B1D] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#0058BE]">domain</span>
            <span>Organization Profile</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#45464D] mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2 border border-[#C6C6CD] rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#45464D] mb-1">Primary Headquarters</label>
              <input
                type="text"
                defaultValue="500 Howard Street, Suite 400, San Francisco, CA"
                className="w-full p-2 border border-[#C6C6CD] rounded-lg bg-white"
              />
            </div>
          </div>
        </div>

        {/* Payroll Schedule */}
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-[#1B1B1D] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#0058BE]">payments</span>
            <span>Payroll & Compensation Schedule</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#45464D] mb-1">Disbursement Frequency</label>
              <select
                value={payrollCycle}
                onChange={(e) => setPayrollCycle(e.target.value)}
                className="w-full p-2 border border-[#C6C6CD] rounded-lg bg-white"
              >
                <option value="Bi-weekly (1st and 15th)">Bi-weekly (1st and 15th)</option>
                <option value="Monthly (Last Business Day)">Monthly (Last Business Day)</option>
                <option value="Weekly (Every Friday)">Weekly (Every Friday)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#45464D] mb-1">Overtime Multiplier Rule</label>
              <select
                value={overtimeRate}
                onChange={(e) => setOvertimeRate(e.target.value)}
                className="w-full p-2 border border-[#C6C6CD] rounded-lg bg-white"
              >
                <option value="1.5x Base Rate">1.5x Base Rate (Standard FLSA)</option>
                <option value="2.0x Double Rate">2.0x Double Rate (Holiday/Night)</option>
                <option value="1.25x Base Rate">1.25x Base Rate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attendance & Biometric Rules */}
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-[#1B1B1D] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#0058BE]">schedule</span>
            <span>Attendance & Shift Reconciliation</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#45464D] mb-1">Standard Workday Shift (Hours)</label>
              <input
                type="number"
                value={autoCheckoutHours}
                onChange={(e) => setAutoCheckoutHours(e.target.value)}
                className="w-full p-2 border border-[#C6C6CD] rounded-lg bg-white font-mono-numbers"
              />
            </div>
            <div>
              <label className="block font-bold text-[#45464D] mb-1">Grace Period for Late Check-in</label>
              <input
                type="text"
                defaultValue="15 minutes"
                className="w-full p-2 border border-[#C6C6CD] rounded-lg bg-white"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-black text-white rounded-lg font-semibold text-sm hover:bg-[#3F465C] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
