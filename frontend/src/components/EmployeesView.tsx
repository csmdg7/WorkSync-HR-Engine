import React, { useState } from 'react';
import { Employee } from '../types';

interface EmployeesViewProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onOpenAddEmployee: () => void;
  onToggleVerifyPayroll: (id: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  onSelectEmployee,
  onOpenAddEmployee
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const departments = ['All', 'Engineering', 'Product & Design', 'People Operations', 'Executive HR', 'Finance & HR'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    const matchesSearch =
      localSearch === '' ||
      emp.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      emp.role.toLowerCase().includes(localSearch.toLowerCase()) ||
      emp.id.toLowerCase().includes(localSearch.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#1B1B1D] tracking-tight leading-tight">
            Employee Directory
          </h2>
          <p className="text-[16px] text-[#45464D] mt-1">
            Manage your workforce members, roles, and departmental structure.
          </p>
        </div>
        <button
          onClick={onOpenAddEmployee}
          className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3F465C] transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E4E2E4] rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-black text-white'
                  : 'bg-[#F0EDEF] text-[#45464D] hover:bg-[#EAE7E9]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 border border-[#C6C6CD] rounded-lg text-xs font-medium bg-white text-[#1B1B1D] focus:outline-none focus:ring-2 focus:ring-[#0058BE]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Probation">Probation</option>
          </select>

          <div className="relative w-full md:w-56">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#76777D] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Filter names or roles..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-[#C6C6CD] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0058BE] bg-white"
            />
          </div>
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="bg-white border border-[#E4E2E4] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-[#E4E2E4] text-[12px] font-bold text-[#45464D] uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Employee</th>
                <th className="py-3.5 px-5 font-semibold">Role</th>
                <th className="py-3.5 px-5 font-semibold">Department</th>
                <th className="py-3.5 px-5 font-semibold">Location</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold">Net Salary</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
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
                      <div className="text-[12px] text-[#76777D]">{emp.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-[#45464D] font-medium text-xs">
                    {emp.role}
                  </td>
                  <td className="py-3.5 px-5 text-[#45464D] text-xs">
                    {emp.department}
                  </td>
                  <td className="py-3.5 px-5 text-[#76777D] text-xs">
                    {emp.location}
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        emp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : emp.status === 'On Leave'
                          ? 'bg-blue-100 text-[#0058BE]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono-numbers text-xs font-bold text-[#1B1B1D]">
                    ${emp.netSalary.toLocaleString()}.00
                  </td>
                  <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectEmployee(emp)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0058BE] hover:bg-blue-50 rounded-md transition-colors"
                    >
                      View Profile
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
