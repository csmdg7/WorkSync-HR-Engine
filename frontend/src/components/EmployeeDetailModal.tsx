import React from 'react';
import { Employee } from '../types';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onToggleVerifyPayroll: (id: string) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onToggleVerifyPayroll
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[88vh] flex flex-col border border-[#E4E2E4] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-[#E4E2E4] bg-[#F6F3F5] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {employee.initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1B1B1D]">{employee.name}</h2>
              <p className="text-xs text-[#45464D] font-medium">{employee.role} • {employee.department}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                  {employee.status}
                </span>
                <span className="text-xs text-[#76777D] font-mono-numbers">ID: {employee.id}</span>
              </div>
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
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* General Information */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#FCF8FA] rounded-lg border border-[#E4E2E4]">
              <span className="text-[#76777D] block mb-0.5">Email Address</span>
              <strong className="text-[#1B1B1D] font-medium">{employee.email}</strong>
            </div>
            <div className="p-3 bg-[#FCF8FA] rounded-lg border border-[#E4E2E4]">
              <span className="text-[#76777D] block mb-0.5">Contact Phone</span>
              <strong className="text-[#1B1B1D] font-medium">{employee.phone}</strong>
            </div>
            <div className="p-3 bg-[#FCF8FA] rounded-lg border border-[#E4E2E4]">
              <span className="text-[#76777D] block mb-0.5">Location</span>
              <strong className="text-[#1B1B1D] font-medium">{employee.location}</strong>
            </div>
            <div className="p-3 bg-[#FCF8FA] rounded-lg border border-[#E4E2E4]">
              <span className="text-[#76777D] block mb-0.5">Onboard Date</span>
              <strong className="text-[#1B1B1D] font-medium">{employee.joinDate}</strong>
            </div>
          </div>

          {/* Payroll Breakdown Card */}
          <div className="border border-[#E4E2E4] rounded-xl p-4 bg-white shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDEF] mb-3">
              <span className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#0058BE]">price_check</span>
                <span>Compensation Schedule</span>
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  employee.isPayrollVerified
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {employee.isPayrollVerified ? 'Verified' : 'Verification Required'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono-numbers">
              <div className="flex justify-between text-[#45464D]">
                <span>Base Salary:</span>
                <span>${employee.baseSalary.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Monthly Allowances:</span>
                <span>+${employee.allowances.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Statutory Deductions:</span>
                <span>-${employee.deductions.toLocaleString()}.00</span>
              </div>
              <div className="pt-2 border-t border-[#F0EDEF] flex justify-between font-bold text-sm text-black">
                <span>Net Pay:</span>
                <span>${employee.netSalary.toLocaleString()}.00</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0EDEF] flex justify-end">
              <button
                onClick={() => onToggleVerifyPayroll(employee.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  employee.isPayrollVerified
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-[#0058BE] text-white hover:bg-[#004395] shadow-xs'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {employee.isPayrollVerified ? 'refresh' : 'check_circle'}
                </span>
                <span>{employee.isPayrollVerified ? 'Re-open Verification' : 'Verify Payroll'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E2E4] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white hover:bg-[#3F465C] rounded-lg font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
