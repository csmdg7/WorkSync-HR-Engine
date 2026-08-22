import React, { useState, useRef, useEffect } from 'react';
import { Employee, PendingLeave, PayrollReview } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  employees: Employee[];
  pendingLeaves: PendingLeave[];
  payrollReviews: PayrollReview[];
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
  payrollReviews,
  onSelectEmployee,
  onOpenActionCenter,
  onOpenHelp
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Filtered employees for search preview
  const searchResults = searchQuery.trim()
    ? employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalActionCount = pendingLeaves.filter(l => l.status === 'pending').length +
    payrollReviews.filter(p => p.status === 'pending').length + 4;

  return (
    <header
      id="top-header"
      className="sticky top-0 bg-[#FCF8FA]/95 backdrop-blur-md border-b border-[#E4E2E4] flex justify-between items-center h-16 px-4 md:px-8 z-40"
    >
      {/* Left side: Mobile menu toggle + Title + Search */}
      <div className="flex items-center gap-4 w-full max-w-xl">
        <div className="md:hidden">
          <button
            id="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            className="text-[#1B1B1D] hover:bg-[#EAE7E9] p-2 rounded-lg transition-colors"
            title="Open Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>

        <div className="hidden md:block text-[22px] font-black text-[#1B1B1D] tracking-tight whitespace-nowrap mr-2">
          Command Center
        </div>

        {/* Interactive Search Bar */}
        <div ref={searchRef} className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464D] text-[20px] pointer-events-none">
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search employees, payroll..."
            className="w-full bg-white border border-[#C6C6CD] rounded-lg pl-9 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0058BE] focus:border-transparent text-[14px] placeholder-[#76777D] text-[#1B1B1D]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#76777D] hover:text-black p-0.5 rounded"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}

          {/* Instant Search Dropdown Results */}
          {showSearchDropdown && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E4E2E4] rounded-lg shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[11px] font-bold text-[#76777D] uppercase tracking-wider">
                Matching Employees ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-[#76777D]">
                  No matching employees found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      onSelectEmployee(emp);
                      setShowSearchDropdown(false);
                    }}
                    className="px-3 py-2 hover:bg-[#F6F3F5] cursor-pointer flex items-center justify-between border-b border-[#F0EDEF] last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#E4E2E4] text-black font-semibold text-xs flex items-center justify-center">
                        {emp.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1B1B1D]">{emp.name}</div>
                        <div className="text-xs text-[#76777D]">{emp.role} • {emp.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono-numbers font-medium text-emerald-600">
                        ${emp.netSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Notifications, Help, Profile Avatar */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            id="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-[#45464D] hover:text-black hover:bg-[#EAE7E9] p-2 rounded-full transition-all relative"
            title="Workforce Alerts"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {totalActionCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#BA1A1A] rounded-full ring-2 ring-[#FCF8FA] animate-pulse"></span>
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E4E2E4] rounded-xl shadow-xl py-3 z-50">
              <div className="px-4 pb-2.5 border-b border-[#F0EDEF] flex items-center justify-between">
                <span className="font-bold text-sm text-[#1B1B1D]">Action Alerts ({totalActionCount})</span>
                <span className="text-[11px] font-semibold text-[#0058BE] cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-[#F0EDEF] max-h-72 overflow-y-auto">
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
                    <p className="text-xs font-semibold text-[#1B1B1D]">5 Pending Leave Requests</p>
                    <p className="text-[11px] text-[#76777D]">David Thorne, Chloe Rivera & 3 others need approval</p>
                    <span className="text-[10px] text-rose-600 font-medium">Urgent review required</span>
                  </div>
                </div>

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
                    <p className="text-xs font-semibold text-[#1B1B1D]">4 Missing Checkouts</p>
                    <p className="text-[11px] text-[#76777D]">From yesterday's evening shift (Emily Lin, Marcus Vance)</p>
                    <span className="text-[10px] text-amber-600 font-medium">Auto-closing in 6 hours</span>
                  </div>
                </div>

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
                    <p className="text-xs font-semibold text-[#1B1B1D]">2 Payroll Discrepancies</p>
                    <p className="text-[11px] text-[#76777D]">Overtime and travel allowances awaiting sign-off</p>
                    <span className="text-[10px] text-blue-600 font-medium">Next run in 4 days</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          id="help-btn"
          onClick={onOpenHelp}
          className="text-[#45464D] hover:text-black hover:bg-[#EAE7E9] p-2 rounded-full transition-all hidden sm:flex items-center justify-center"
          title="Command Center Guide"
        >
          <span className="material-symbols-outlined text-[22px]">help</span>
        </button>

        {/* Profile Avatar Button */}
        <div ref={profileRef} className="relative">
          <button
            id="user-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-1 rounded-full hover:ring-2 hover:ring-[#0058BE] transition-all flex items-center cursor-pointer"
            title="HR Administrator Profile"
          >
            <img
              alt="HR Admin Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#C6C6CD]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHUtv8TZrwdhV01R9RcvbOwWfQrM9EG5KMANhkGZnCEsxzcf0EeOnZp0vABNBCRlCzSBOahT5XaHNWZoQfB_DLfkyDI2qe5wDc9D79CitLcHrlst3DvAIe3W6FWkQqikLdX2OtIwDVgMlwqHzuQf5138JlT1oM0eeRLx37uSeJYJqP86iq8_ktvjfGgIpHF5U5XGb4Uc-NeUslsbmmoBvIYtRzc3rf_M_PllsIS7cbQN-GC2OTlsr8cA"
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E4E2E4] rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#F0EDEF]">
                <p className="text-sm font-bold text-[#1B1B1D]">Chandana Rukmini</p>
                <p className="text-xs text-[#76777D]">Super Admin (HR Lead)</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  System Active
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#45464D] hover:bg-[#F6F3F5] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Admin Permissions</span>
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#45464D] hover:bg-[#F6F3F5] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                  <span>Audit Logs & Security</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
