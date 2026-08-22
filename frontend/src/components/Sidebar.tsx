import React from 'react';
import { NavTab, AuthUser } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAddEmployee: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddEmployee,
  isMobileOpen = false,
  onCloseMobile,
  currentUser,
  onLogout
}) => {
  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'employees', label: 'Employees', icon: 'group' },
    { id: 'payroll', label: 'Payroll', icon: 'payments' },
    { id: 'attendance', label: 'Attendance', icon: 'calendar_month' },
    { id: 'lifecycle', label: 'Lifecycle', icon: 'timeline' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <nav
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-[#FAF8F9] border-r border-[#E4E2E4] p-5 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-base shadow-sm">
              HR
            </div>
            <div>
              <span className="text-lg font-bold text-[#1B1B1D] tracking-tight block leading-tight">
                HR Command
              </span>
              <span className="text-xs text-[#76777D] font-normal">Admin Portal</span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-[#76777D] hover:text-[#1B1B1D]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EAE7E9] text-black font-semibold shadow-2xs'
                      : 'text-[#45464D] hover:bg-[#F0EDEF] hover:text-[#1B1B1D]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-black font-bold' : 'text-[#76777D]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom CTA & User Section */}
        <div className="mt-auto pt-4 border-t border-[#F0EDEF] space-y-3">
          <button
            id="add-employee-sidebar-btn"
            onClick={onOpenAddEmployee}
            className="w-full bg-black text-white py-2.5 px-4 rounded-xl font-semibold text-xs hover:bg-[#3F465C] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Employee</span>
          </button>

          {currentUser && (
            <div className="pt-2 border-t border-[#F0EDEF] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#EAE7E9] text-[#1B1B1D] font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1B1B1D] truncate leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-[#76777D] truncate">{currentUser.role}</p>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 text-[#76777D] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};