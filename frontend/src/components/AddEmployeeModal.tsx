import React, { useState } from 'react';
import { Employee } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Employee) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [baseSalary, setBaseSalary] = useState<number>(5000);
  const [allowances, setAllowances] = useState<number>(300);
  const [deductions, setDeductions] = useState<number>(100);
  const [location, setLocation] = useState('San Francisco, CA');
  const [phone, setPhone] = useState('+1 (555) 000-1122');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Probation'>('Active');

  if (!isOpen) return null;

  const netSalary = baseSalary + allowances - deductions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    // Generate initials
    const parts = name.trim().split(' ');
    const initials = parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();

    const newEmp: Employee = {
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name,
      initials,
      email,
      role,
      department,
      baseSalary,
      allowances,
      deductions,
      netSalary,
      isPayrollVerified: false,
      status,
      attendanceStatus: 'Present',
      joinDate: new Date().toISOString().split('T')[0],
      phone,
      location
    };

    onAddEmployee(newEmp);
    onClose();

    // Reset form
    setName('');
    setEmail('');
    setRole('');
    setBaseSalary(5000);
    setAllowances(300);
    setDeductions(100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-[#E4E2E4] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E4E2E4] bg-[#F6F3F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-white rounded-lg">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1B1B1D]">Add New Employee</h2>
              <p className="text-xs text-[#76777D]">Onboard and register new workforce talent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#76777D] hover:text-black p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#45464D] uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Henderson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[#C6C6CD] rounded-lg text-sm focus:ring-2 focus:ring-[#0058BE] focus:outline-none"
              />
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-bold text-[#45464D] uppercase tracking-wider mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                placeholder="alex.h@dayflow.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#C6C6CD] rounded-lg text-sm focus:ring-2 focus:ring-[#0058BE] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Title / Role */}
            <div>
              <label className="block text-xs font-bold text-[#45464D] uppercase tracking-wider mb-1">
                Job Title / Role *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Backend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-[#C6C6CD] rounded-lg text-sm focus:ring-2 focus:ring-[#0058BE] focus:outline-none"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-[#45464D] uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-[#C6C6CD] rounded-lg text-sm focus:ring-2 focus:ring-[#0058BE] focus:outline-none bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="People Operations">People Operations</option>
                <option value="Executive HR">Executive HR</option>
                <option value="Finance & HR">Finance & HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Security & IT">Security & IT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-[#45464D] uppercase tracking-wider mb-1">
                Work Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-[#C6C6CD] rounded-lg text-sm focus:ring-2 focus:ring-[#0058BE] focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-[#45464D] uppercase tracking-wider mb-1">
                Employment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#C6C6CD] rounded-lg text-sm focus:ring-2 focus:ring-[#0058BE] focus:outline-none bg-white"
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation (New Hire)</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Compensation Section */}
          <div className="border-t border-[#E4E2E4] pt-4 mt-2">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#0058BE]">payments</span>
              <span>Compensation & Payroll Breakdown</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#76777D] mb-1">
                  Base Salary ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-[#C6C6CD] rounded-lg text-sm font-mono-numbers focus:ring-2 focus:ring-[#0058BE] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#76777D] mb-1">
                  Allowances (+$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="25"
                  value={allowances}
                  onChange={(e) => setAllowances(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-[#C6C6CD] rounded-lg text-sm font-mono-numbers text-emerald-600 focus:ring-2 focus:ring-[#0058BE] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#76777D] mb-1">
                  Deductions (-$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="25"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-[#C6C6CD] rounded-lg text-sm font-mono-numbers text-rose-600 focus:ring-2 focus:ring-[#0058BE] focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Net Salary Box */}
            <div className="mt-3 bg-[#F0EDEF] p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs font-semibold text-[#45464D]">Calculated Monthly Net Salary:</span>
              <span className="text-base font-bold font-mono-numbers text-black">
                ${netSalary.toLocaleString()}.00
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E4E2E4] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#45464D] hover:bg-[#F0EDEF] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-black text-white hover:bg-[#3F465C] font-semibold text-xs rounded-lg transition-all shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Register Employee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
