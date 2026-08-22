import React, { useState } from 'react';
import { Employee } from '../types';

interface PayrollViewProps {
  employees: Employee[];
  onToggleVerifyPayroll: (id: string) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  employees,
  onToggleVerifyPayroll,
  onSelectEmployee
}) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    if (filter === 'verified') return emp.isPayrollVerified;
    if (filter === 'pending') return !emp.isPayrollVerified;
    return true;
  });

  const totalBase = employees.reduce((acc, curr) => acc + curr.baseSalary, 0);
  const totalAllowances = employees.reduce((acc, curr) => acc + curr.allowances, 0);
  const totalDeductions = employees.reduce((acc, curr) => acc + curr.deductions, 0);
  const totalNet = employees.reduce((acc, curr) => acc + curr.netSalary, 0);
  const verifiedCount = employees.filter((e) => e.isPayrollVerified).length;
  const pendingCount = employees.length - verifiedCount;

  const handleBatchVerify = () => {
    setIsBatchProcessing(true);
    setTimeout(() => {
      employees.forEach((emp) => {
        if (!emp.isPayrollVerified) {
          onToggleVerifyPayroll(emp.id);
        }
      });
      setIsBatchProcessing(false);
    }, 600);
  };

  const handleExport = () => {
    setExportNotice('Generating encrypted payroll report (.CSV)... Download complete.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#1B1B1D] tracking-tight leading-tight">
            Payroll Verification & Processing
          </h2>
          <p className="text-[16px] text-[#45464D] mt-1">
            Bi-weekly workforce compensation schedules, allowances, and statutory deductions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 border border-[#C6C6CD] bg-white text-xs font-semibold rounded-lg hover:bg-[#F6F3F5] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleBatchVerify}
            disabled={pendingCount === 0 || isBatchProcessing}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              pendingCount === 0
                ? 'bg-[#E4E2E4] text-[#76777D] cursor-not-allowed'
                : 'bg-[#0058BE] text-white hover:bg-[#004395] active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isBatchProcessing ? 'autorenew' : 'done_all'}
            </span>
            <span>{isBatchProcessing ? 'Processing...' : `Batch Verify All (${pendingCount})`}</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#76777D] block mb-1">Total Net Payroll</span>
          <div className="text-2xl font-bold font-mono-numbers text-black">
            ${totalNet.toLocaleString()}.00
          </div>
          <div className="text-[11px] text-[#45464D] mt-1">For current cycle (October)</div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#76777D] block mb-1">Total Allowances</span>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-600">
            +${totalAllowances.toLocaleString()}.00
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Health, transport & stipends</div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#76777D] block mb-1">Total Deductions</span>
          <div className="text-2xl font-bold font-mono-numbers text-rose-600">
            -${totalDeductions.toLocaleString()}.00
          </div>
          <div className="text-[11px] text-rose-700 mt-1">Tax, insurance & benefits</div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#76777D] block mb-1">Verification Status</span>
          <div className="text-2xl font-bold font-mono-numbers text-[#0058BE]">
            {verifiedCount} / {employees.length}
          </div>
          <div className="text-[11px] text-[#45464D] mt-1">
            {pendingCount === 0 ? 'All records verified' : `${pendingCount} awaiting approval`}
          </div>
        </div>
      </div>

      {/* Table Filter Tabs */}
      <div className="bg-white border border-[#E4E2E4] rounded-t-xl px-5 py-3 border-b-0 flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all' ? 'bg-black text-white' : 'bg-[#F0EDEF] text-[#45464D] hover:bg-[#EAE7E9]'
          }`}
        >
          All Employees ({employees.length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'verified' ? 'bg-black text-white' : 'bg-[#F0EDEF] text-[#45464D] hover:bg-[#EAE7E9]'
          }`}
        >
          Verified ({verifiedCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'pending' ? 'bg-black text-white' : 'bg-[#F0EDEF] text-[#45464D] hover:bg-[#EAE7E9]'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#E4E2E4] rounded-b-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-[#E4E2E4] text-[12px] font-bold text-[#45464D] uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Employee</th>
                <th className="py-3.5 px-5 font-semibold">Base Salary</th>
                <th className="py-3.5 px-5 font-semibold">Allowances</th>
                <th className="py-3.5 px-5 font-semibold">Deductions</th>
                <th className="py-3.5 px-5 font-semibold">Net Salary</th>
                <th className="py-3.5 px-5 font-semibold">Verification</th>
                <th className="py-3.5 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[14px] divide-y divide-[#E4E2E4]/60">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-5 font-medium text-[#1B1B1D] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E4E2E4] flex items-center justify-center text-black font-semibold text-xs shrink-0 shadow-2xs">
                      {emp.initials}
                    </div>
                    <div>
                      <div className="font-semibold group-hover:text-[#0058BE] transition-colors">{emp.name}</div>
                      <div className="text-[12px] text-[#76777D]">{emp.department} • {emp.id}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-mono-numbers text-xs text-[#45464D]">
                    ${emp.baseSalary.toLocaleString()}.00
                  </td>
                  <td className="py-3.5 px-5 font-mono-numbers text-xs text-emerald-600">
                    +${emp.allowances.toLocaleString()}.00
                  </td>
                  <td className="py-3.5 px-5 font-mono-numbers text-xs text-rose-600">
                    -${emp.deductions.toLocaleString()}.00
                  </td>
                  <td className="py-3.5 px-5 font-mono-numbers text-sm font-bold text-[#1B1B1D]">
                    ${emp.netSalary.toLocaleString()}.00
                  </td>
                  <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                    {emp.isPayrollVerified ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold tracking-wider">
                        <span className="material-symbols-outlined text-[12px] mr-1">check_circle</span>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-wider">
                        <span className="material-symbols-outlined text-[12px] mr-1">pending</span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleVerifyPayroll(emp.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        emp.isPayrollVerified
                          ? 'bg-[#F0EDEF] text-[#45464D] hover:bg-[#EAE7E9]'
                          : 'bg-[#0058BE] text-white hover:bg-[#004395] shadow-xs'
                      }`}
                    >
                      {emp.isPayrollVerified ? 'Recheck' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
