import React, { useState, useRef, useEffect } from 'react';
import { Employee, PendingLeave, MissingCheckout, PayrollReview, AuthUser } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  employees: Employee[];
  pendingLeaves: PendingLeave[];
  missingCheckouts?: MissingCheckout[];
  payrollReviews: PayrollReview[];
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onSelectEmployee: (employee: Employee) => void;
  onOpenActionCenter: (type: 'leaves' | 'checkouts' | 'payroll') => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
  employees,
  pendingLeaves,
  missingCheckouts = [],
  payrollReviews,
  currentUser,
  onLogout,
  onSelectEmployee,
  onOpenActionCenter,
  onOpenHelp
}) => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const filteredEmployees = searchQuery.trim()
    ? employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingLeavesList = pendingLeaves.filter((l) => l.status === 'pending');
  const pendingCheckoutsList = missingCheckouts.filter((c) => c.status === 'pending');
  const pendingPayrollList = payrollReviews.filter((p) => p.status === 'pending');

  const totalActionCount =
    pendingLeavesList.length + pendingCheckoutsList.length + pendingPayrollList.length;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 bg-[#FAF8F9]/90 backdrop-blur-md border-b border-[#E4E2E4] px-4 md:px-8 py-3 flex items-center justify-between gap-4"
    >
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#1B1B1D] hover:bg-[#EAE7E9] transition-colors"
          title="Open mobile navigation"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        <div className="text-lg font-bold text-[#1B1B1D] tracking-tight hidden sm:block">
          Command Center
        </div>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777D] text-[18px]">
              search
            </span>
            <input
              id="global-hr-search"
              type="text"
              placeholder="Search employees, payroll, shifts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F0EDEF] focus:bg-white border border-transparent focus:border-[#0058BE] rounded-lg focus:outline-none transition-all placeholder:text-[#76777D] text-[#1B1B1D]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#76777D] hover:text-[#1B1B1D] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-[#E4E2E4] rounded-xl shadow-xl max-h-80 overflow-y-auto z-50 p-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#76777D] px-3 py-1.5">
                Employees ({filteredEmployees.length})
              </div>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      onSelectEmployee(emp);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#F6F3F5] rounded-lg flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#EAE7E9] text-[#1B1B1D] font-bold text-xs flex items-center justify-center group-hover:bg-[#0058BE] group-hover:text-white transition-colors">
                        {emp.initials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1B1B1D]">{emp.name}</p>
                        <p className="text-[10px] text-[#76777D]">{emp.role} • {emp.department}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ${emp.netSalary.toLocaleString()}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-[#76777D]">
                  No matching employees found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <button
          id="header-help-btn"
          onClick={onOpenHelp}
          className="p-2 text-[#45464D] hover:text-[#1B1B1D] hover:bg-[#EAE7E9] rounded-lg transition-colors cursor-pointer"
          title="Quick Documentation & Shortcut Guide"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
        </button>

        {/* Notifications / Action Center */}
        <div ref={notifRef} className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#45464D] hover:text-[#1B1B1D] hover:bg-[#EAE7E9] rounded-lg transition-colors relative cursor-pointer"
            title="Workforce Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {totalActionCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#FCF8FA]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E4E2E4] rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#F0EDEF] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B1B1D]">Action Alerts ({totalActionCount})</span>
                <span
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#0058BE] hover:underline cursor-pointer"
                >
                  Close
                </span>
              </div>
              <div className="divide-y divide-[#F0EDEF] max-h-72 overflow-y-auto">
                {pendingLeavesList.length > 0 && (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onOpenActionCenter('leaves');
                    }}
                    className="p-3 hover:bg-[#F6F3F5] cursor-pointer flex items-start gap-3 transition-colors"
                  >
                    <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-[18px]">beach_access</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1B1B1D]">
                        {pendingLeavesList.length} Pending Leave Request{pendingLeavesList.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-[11px] text-[#76777D]">
                        {pendingLeavesList.slice(0, 2).map((l) => l.employeeName).join(', ')}
                        {pendingLeavesList.length > 2 ? ` & ${pendingLeavesList.length - 2} others` : ''} awaiting approval
                      </p>
                      <span className="text-[10px] text-rose-600 font-medium">Urgent review required</span>
                    </div>
                  </div>
                )}

                {pendingCheckoutsList.length > 0 && (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onOpenActionCenter('checkouts');
                    }}
                    className="p-3 hover:bg-[#F6F3F5] cursor-pointer flex items-start gap-3 transition-colors"
                  >
                    <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1B1B1D]">
                        {pendingCheckoutsList.length} Missing Checkout{pendingCheckoutsList.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-[11px] text-[#76777D]">
                        {pendingCheckoutsList.slice(0, 2).map((c) => c.employeeName).join(', ')}
                        {pendingCheckoutsList.length > 2 ? ` & ${pendingCheckoutsList.length - 2} others` : ''}
                      </p>
                      <span className="text-[10px] text-amber-600 font-medium">Auto-closing in 6 hours</span>
                    </div>
                  </div>
                )}

                {pendingPayrollList.length > 0 && (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onOpenActionCenter('payroll');
                    }}
                    className="p-3 hover:bg-[#F6F3F5] cursor-pointer flex items-start gap-3 transition-colors"
                  >
                    <div className="p-1.5 bg-blue-100 text-[#0058BE] rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1B1B1D]">
                        {pendingPayrollList.length} Payroll Discrepanc{pendingPayrollList.length > 1 ? 'ies' : 'y'}
                      </p>
                      <p className="text-[11px] text-[#76777D]">
                        {pendingPayrollList.slice(0, 2).map((p) => p.employeeName).join(', ')} awaiting sign-off
                      </p>
                      <span className="text-[10px] text-blue-600 font-medium">Next run in 4 days</span>
                    </div>
                  </div>
                )}

                {totalActionCount === 0 && (
                  <div className="p-6 text-center text-xs text-[#76777D]">
                    <span className="material-symbols-outlined text-[24px] text-emerald-500 block mb-1">
                      check_circle
                    </span>
                    All workforce actions are up to date!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div ref={profileRef} className="relative">
          <button
            id="user-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-1 rounded-full hover:ring-2 hover:ring-[#0058BE] transition-all flex items-center cursor-pointer"
            title={`${currentUser?.name || 'Administrator'} Profile`}
          >
            {currentUser?.avatarUrl ? (
              <img
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#C6C6CD]"
                src={currentUser.avatarUrl}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center border border-[#C6C6CD]">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'HR'}
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E4E2E4] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-[#F0EDEF]">
                <p className="text-sm font-bold text-[#1B1B1D] truncate">
                  {currentUser?.name || 'Chandana Rukmini'}
                </p>
                <p className="text-[11px] text-[#76777D] truncate">
                  {currentUser?.email || 'chandana@dayflow.io'}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    {currentUser?.role || 'Super Admin'}
                  </span>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#45464D] hover:bg-[#F6F3F5] flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  <span>{currentUser?.department || 'Executive HR'}</span>
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#45464D] hover:bg-[#F6F3F5] flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                  <span>Audit Logs & Security</span>
                </button>
              </div>
              {onLogout && (
                <div className="pt-1 border-t border-[#F0EDEF]">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};