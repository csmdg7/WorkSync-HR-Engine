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
  onOpenAddEmployee,
  onToggleVerifyPayroll
}) => {
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const departments = ['All', 'Engineering', 'Product & Design', 'People Operations', 'Executive HR', 'Finance & HR'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const handleExportEmployees = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Role',
      'Department',
      'Location',
      'Status',
      'Attendance',
      'Base Salary ($)',
      'Net Salary ($)',
      'Join Date',
      'Phone'
    ];
    const rows = filteredEmployees.map((emp) => [
      `"${emp.id}"`,
      `"${emp.name.replace(/"/g, '""')}"`,
      `"${emp.email.replace(/"/g, '""')}"`,
      `"${emp.role.replace(/"/g, '""')}"`,
      `"${emp.department.replace(/"/g, '""')}"`,
      `"${emp.location.replace(/"/g, '""')}"`,
      emp.status,
      emp.attendanceStatus,
      emp.baseSalary.toFixed(2),
      emp.netSalary.toFixed(2),
      emp.joinDate,
      `"${emp.phone}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employees_directory_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1B1D]">
            Employee Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#76777D] mt-1">
            Manage your workforce members, roles, and departmental structure.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportEmployees}
            className="px-3.5 py-2.5 border border-[#C6C6CD] bg-white text-xs font-semibold rounded-lg hover:bg-[#F6F3F5] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Export filtered directory to CSV"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddEmployee}
            className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3F465C] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E4E2E4] rounded-xl p-3 sm:p-4 mb-6 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  departmentFilter === dept
                    ? 'bg-black text-white'
                    : 'bg-[#F6F3F5] text-[#45464D] hover:bg-[#EAE7E9]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F6F3F5] text-xs font-semibold text-[#1B1B1D] px-3 py-2 rounded-lg border border-[#E4E2E4] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#76777D] text-[16px]">
                search
              </span>
              <input
                type="text"
                placeholder="Filter names or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F6F3F5] border border-[#E4E2E4] rounded-lg focus:outline-none focus:bg-white text-[#1B1B1D]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-[#E4E2E4] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E2E4] bg-[#FAF8F9] text-[11px] font-bold text-[#76777D] uppercase tracking-wider">
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Location</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right font-mono-numbers">Net Salary</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDEF] text-xs">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#FAF8F9] transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EAE7E9] text-[#1B1B1D] font-bold text-xs flex items-center justify-center shrink-0">
                        {emp.initials}
                      </div>
                      <div>
                        <div
                          onClick={() => onSelectEmployee(emp)}
                          className="font-bold text-[#1B1B1D] hover:text-[#0058BE] cursor-pointer"
                        >
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-[#76777D]">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-[#1B1B1D]">{emp.role}</td>
                  <td className="py-3.5 px-5 text-[#45464D]">{emp.department}</td>
                  <td className="py-3.5 px-5 text-[#76777D]">{emp.location}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        emp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono-numbers font-bold text-emerald-700">
                    ${emp.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onSelectEmployee(emp)}
                      className="text-[#0058BE] hover:underline font-semibold text-xs cursor-pointer"
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