import React, { useState } from 'react';
import { Employee } from '../types';

interface PayrollViewProps {
  employees: Employee[];
  onToggleVerifyPayroll: (id: string) => void;
  onBatchVerifyPayroll?: () => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  employees,
  onToggleVerifyPayroll,
  onBatchVerifyPayroll,
  onSelectEmployee
}) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const totalBase = employees.reduce((sum, e) => sum + e.baseSalary, 0);
  const totalAllowances = employees.reduce((sum, e) => sum + e.allowances, 0);
  const totalDeductions = employees.reduce((sum, e) => sum + e.deductions, 0);
  const totalNet = employees.reduce((sum, e) => sum + e.netSalary, 0);

  const verifiedCount = employees.filter((e) => e.isPayrollVerified).length;
  const pendingCount = employees.length - verifiedCount;

  const filteredEmployees = employees.filter((e) => {
    if (filter === 'verified') return e.isPayrollVerified;
    if (filter === 'pending') return !e.isPayrollVerified;
    return true;
  });

  const handleBatchVerify = () => {
    setIsBatchProcessing(true);
    setTimeout(() => {
      if (onBatchVerifyPayroll) {
        onBatchVerifyPayroll();
      } else {
        employees.forEach((emp) => {
          if (!emp.isPayrollVerified) {
            onToggleVerifyPayroll(emp.id);
          }
        });
      }
      setIsBatchProcessing(false);
    }, 400);
  };

  const handleExport = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Department',
      'Role',
      'Base Salary ($)',
      'Allowances ($)',
      'Deductions ($)',
      'Net Salary ($)',
      'Payroll Verification',
      'Attendance Status'
    ];

    const rows = filteredEmployees.map((emp) => [
      `"${emp.id}"`,
      `"${emp.name.replace(/"/g, '""')}"`,
      `"${emp.email.replace(/"/g, '""')}"`,
      `"${emp.department.replace(/"/g, '""')}"`,
      `"${emp.role.replace(/"/g, '""')}"`,
      emp.baseSalary.toFixed(2),
      emp.allowances.toFixed(2),
      emp.deductions.toFixed(2),
      emp.netSalary.toFixed(2),
      emp.isPayrollVerified ? 'Verified' : 'Pending Review',
      emp.attendanceStatus
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `workforce_payroll_report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Downloaded workforce_payroll_report_${dateStr}.csv (${filteredEmployees.length} records).`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1B1D]">
            Payroll Verification & Processing
          </h1>
          <p className="text-xs sm:text-sm text-[#76777D] mt-1">
            Bi-weekly workforce compensation schedules, allowances, and statutory deductions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 border border-[#C6C6CD] text-xs font-semibold rounded-lg hover:bg-[#F6F3F5] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer bg-white"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleBatchVerify}
            disabled={isBatchProcessing || pendingCount === 0}
            className="bg-black hover:bg-[#3F465C] disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isBatchProcessing ? 'refresh' : 'verified'}
            </span>
            <span>{isBatchProcessing ? 'Processing...' : `Batch Verify All (${pendingCount})`}</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-[#76777D]">Total Base Salaries</span>
          <div className="text-xl font-bold font-mono-numbers text-[#1B1B1D] mt-1">
            ${totalBase.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#76777D] mt-1">For current cycle (14d)</div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-[#76777D]">Total Allowances</span>
          <div className="text-xl font-bold font-mono-numbers text-emerald-600 mt-1">
            +${totalAllowances.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#76777D] mt-1">Health, transport & stipends</div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-[#76777D]">Total Deductions</span>
          <div className="text-xl font-bold font-mono-numbers text-rose-600 mt-1">
            -${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#76777D] mt-1">Tax, insurance & benefits</div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-2xs bg-gradient-to-br from-white to-blue-50/30">
          <span className="text-xs font-medium text-[#76777D]">Net Payroll Outflow</span>
          <div className="text-xl font-bold font-mono-numbers text-[#0058BE] mt-1">
            ${totalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#76777D] mt-1">Approved for disbursement</div>
        </div>

        <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-[#76777D]">Verification Status</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-numbers text-[#1B1B1D]">
              {verifiedCount} / {employees.length}
            </span>
          </div>
          <div className="w-full bg-[#F0EDEF] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${employees.length > 0 ? (verifiedCount / employees.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'all' ? 'bg-black text-white' : 'bg-white text-[#45464D] border border-[#E4E2E4]'
          }`}
        >
          All Employees ({employees.length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'verified' ? 'bg-black text-white' : 'bg-white text-[#45464D] border border-[#E4E2E4]'
          }`}
        >
          Verified ({verifiedCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'pending' ? 'bg-black text-white' : 'bg-white text-[#45464D] border border-[#E4E2E4]'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E4E2E4] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E2E4] bg-[#FAF8F9] text-[11px] font-bold text-[#76777D] uppercase tracking-wider">
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-5 text-right font-mono-numbers">Base Salary</th>
                <th className="py-3 px-5 text-right font-mono-numbers">Allowances</th>
                <th className="py-3 px-5 text-right font-mono-numbers">Deductions</th>
                <th className="py-3 px-5 text-right font-mono-numbers">Net Salary</th>
                <th className="py-3 px-5 text-center">Verification</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDEF] text-xs">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#FAF8F9] transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EAE7E9] text-[#1B1B1D] font-bold text-xs flex items-center justify-center shrink-0">
                        {emp.initials}
                      </div>
                      <div>
                        <div
                          onClick={() => onSelectEmployee(emp)}
                          className="font-bold text-[#1B1B1D] hover:text-[#0058BE] cursor-pointer"
                        >
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-[#76777D]">
                          {emp.department} • {emp.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono-numbers font-medium text-[#1B1B1D]">
                    ${emp.baseSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono-numbers font-medium text-emerald-600">
                    +${emp.allowances.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono-numbers font-medium text-rose-600">
                    -${emp.deductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono-numbers font-bold text-[#1B1B1D]">
                    ${emp.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    {emp.isPayrollVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onToggleVerifyPayroll(emp.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                        emp.isPayrollVerified
                          ? 'text-[#76777D] hover:bg-slate-100 hover:text-black'
                          : 'bg-black text-white hover:bg-[#3F465C]'
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