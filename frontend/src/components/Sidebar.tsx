import React from 'react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAddEmployee: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddEmployee,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'employees', label: 'Employees', icon: 'group' },
    { id: 'payroll', label: 'Payroll', icon: 'payments' },
    { id: 'attendance', label: 'Attendance', icon: 'calendar_today' },
    { id: 'lifecycle', label: 'Lifecycle', icon: 'timeline' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <nav
        id="main-sidebar"
        className={`fixed left-0 top-0 h-full w-[280px] bg-white border-r border-[#E4E2E4] shadow-xs flex flex-col py-6 px-4 z-50 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-base shadow-xs">
              HR
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-black leading-tight tracking-tight">HR Command</h1>
              <p className="text-[13px] text-[#45464D] font-normal">Admin Portal</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-[#45464D] hover:text-black p-1.5 rounded-lg hover:bg-[#F0EDEF]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <ul className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-all text-left ${
                    isActive
                      ? 'text-[#0058BE] font-bold bg-[#EAE7E9]/60 border-r-4 border-[#0058BE] rounded-l-lg'
                      : 'text-[#45464D] hover:text-black hover:bg-[#F6F3F5] font-medium rounded-lg'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[15px]">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom CTA */}
        <div className="mt-auto pt-4 border-t border-[#F0EDEF]">
          <button
            id="add-employee-sidebar-btn"
            onClick={onOpenAddEmployee}
            className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-semibold text-[14px] hover:bg-[#3F465C] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Employee</span>
          </button>
        </div>
      </nav>
    </>
  );
};
