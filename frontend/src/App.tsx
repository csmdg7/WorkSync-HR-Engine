import React, { useState, useEffect } from 'react';
import { NavTab, Employee, CalendarDay, LifecycleMilestone, PendingLeave, MissingCheckout, PayrollReview, AuthUser } from './types';
import {
  initialPendingLeaves,
  initialMissingCheckouts,
  initialPayrollReviews,
  initialLifecycleMilestones
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { PayrollView } from './components/PayrollView';
import { AttendanceView } from './components/AttendanceView';
import { LifecycleView } from './components/LifecycleView';
import { SettingsView } from './components/SettingsView';
import { LoginView } from './components/loginView';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { ActionCenterModal } from './components/ActionCenterModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { DayDetailModal } from './components/DayDetailModal';
import { HelpModal } from './components/HelpModal';

const DEFAULT_AUTH_USER: AuthUser = {
  id: 'usr-1',
  name: 'Chandana Rukmini',
  email: 'chandana@dayflow.io',
  role: 'Super Admin (HR Lead)',
  department: 'Executive HR',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBHUtv8TZrwdhV01R9RcvbOwWfQrM9EG5KMANhkGZnCEsxzcf0EeOnZp0vABNBCRlCzSBOahT5XaHNWZoQfB_DLfkyDI2qe5wDc9D79CitLcHrlst3DvAIe3W6FWkQqikLdX2OtIwDVgMlwqHzuQf5138JlT1oM0eeRLx37uSeJYJqP86iq8_ktvjfGgIpHF5U5XGb4Uc-NeUslsbmmoBvIYtRzc3rf_M_PllsIS7cbQN-GC2OTlsr8cA'
};

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('dayflow_auth_user') || sessionStorage.getItem('dayflow_auth_user');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_AUTH_USER;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data States - initialized from LocalStorage and optional backend
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('dayflow_employees_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [pendingLeaves, setPendingLeaves] = useState<PendingLeave[]>(() => {
    try {
      const saved = localStorage.getItem('dayflow_leaves_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialPendingLeaves;
  });

  const [missingCheckouts, setMissingCheckouts] = useState<MissingCheckout[]>(() => {
    try {
      const saved = localStorage.getItem('dayflow_checkouts_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMissingCheckouts;
  });

  const [payrollReviews, setPayrollReviews] = useState<PayrollReview[]>(() => {
    try {
      const saved = localStorage.getItem('dayflow_payroll_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialPayrollReviews;
  });

  const [lifecycleMilestones, setLifecycleMilestones] = useState<LifecycleMilestone[]>(() => {
    try {
      const saved = localStorage.getItem('dayflow_milestones_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialLifecycleMilestones;
  });

  // Modals State
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [actionCenterTab, setActionCenterTab] = useState<'leaves' | 'checkouts' | 'payroll'>('leaves');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state changes directly to LocalStorage
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('dayflow_employees_db', JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_leaves_db', JSON.stringify(pendingLeaves));
  }, [pendingLeaves]);

  useEffect(() => {
    localStorage.setItem('dayflow_checkouts_db', JSON.stringify(missingCheckouts));
  }, [missingCheckouts]);

  useEffect(() => {
    localStorage.setItem('dayflow_payroll_db', JSON.stringify(payrollReviews));
  }, [payrollReviews]);

  useEffect(() => {
    localStorage.setItem('dayflow_milestones_db', JSON.stringify(lifecycleMilestones));
  }, [lifecycleMilestones]);

  // Exact 1:1 Fetch from backend database if available
  useEffect(() => {
    const fetchFromDatabase = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees');
        if (res.ok) {
          const result = await res.json();
          const dbEmployees = result.data || result;
          if (Array.isArray(dbEmployees) && dbEmployees.length > 0) {
            const normalized: Employee[] = dbEmployees.map((e: any) => ({
              id: e.id,
              name: e.name,
              initials:
                e.initials ||
                (e.name ? e.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'NA'),
              email: e.email,
              role: e.role,
              department: e.department || 'Engineering',
              baseSalary: Number(e.base_salary || e.baseSalary || 5000),
              allowances: Number(e.allowances || 300),
              deductions: Number(e.deductions || 100),
              netSalary:
                Number(e.net_salary || e.netSalary) ||
                (Number(e.baseSalary || 5000) + Number(e.allowances || 300) - Number(e.deductions || 100)),
              isPayrollVerified: Boolean(e.is_payroll_verified ?? e.isPayrollVerified ?? true),
              status: e.status || 'Active',
              attendanceStatus: e.attendance_status || e.attendanceStatus || (e.status === 'On Leave' ? 'Leave' : 'Present'),
              joinDate: e.join_date || e.joinDate || '2023-01-15',
              phone: e.phone || '+1 (555) 019-2834',
              location: e.location || 'San Francisco, CA'
            }));
            setEmployees(normalized);
            localStorage.setItem('dayflow_employees_db', JSON.stringify(normalized));
          }
        }
      } catch (err) {
        console.warn('Backend server not connected, using offline cache');
      }
    };
    fetchFromDatabase();
  }, []);

  // Add Employee Handler (Instantly updates UI & persists to backend database)
  const handleAddEmployee = async (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);

    const milestone: LifecycleMilestone = {
      id: `LM-${Date.now()}`,
      type: 'joined',
      title: 'New Hire Onboarded',
      subtitle: `${newEmp.role} joined ${newEmp.department}`,
      timeLabel: 'JUST NOW',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      employeeName: newEmp.name,
      icon: 'how_to_reg',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700'
    };
    setLifecycleMilestones((prev) => [milestone, ...prev]);

    try {
      await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp)
      });
    } catch {}

    showToast(`New employee ${newEmp.name} onboarded successfully.`);
  };

  const handleOpenActionCenter = (tab: 'leaves' | 'checkouts' | 'payroll') => {
    setActionCenterTab(tab);
    setIsActionCenterOpen(true);
  };

  const handleApproveLeave = (id: string) => {
    const item = pendingLeaves.find((l) => l.id === id);
    setPendingLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'approved' } : l)));
    if (item) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === item.employeeId ? { ...e, status: 'On Leave', attendanceStatus: 'Leave' } : e))
      );
      showToast(`Approved leave request for ${item.employeeName}.`);

      // Try backend patch
      try {
        fetch(`http://localhost:5000/api/leaves/${id}/approve`, { method: 'PATCH' }).catch(() => {});
      } catch (_) {}
    }
  };

  const handleRejectLeave = (id: string) => {
    const item = pendingLeaves.find((l) => l.id === id);
    setPendingLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l)));
    if (item) showToast(`Rejected leave request for ${item.employeeName}.`);
  };

  const handleResolveCheckout = (id: string, time: string) => {
    const item = missingCheckouts.find((c) => c.id === id);
    setMissingCheckouts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'resolved' } : c)));
    if (item) showToast(`Checkout timestamp reconciled at ${time} for ${item.employeeName}.`);
  };

  const handleVerifyPayrollReview = (id: string) => {
    const item = payrollReviews.find((p) => p.id === id);
    setPayrollReviews((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'verified' } : p)));
    if (item) {
      setEmployees((prev) => prev.map((e) => (e.id === item.employeeId ? { ...e, isPayrollVerified: true } : e)));
      showToast(`Payroll discrepancy verified for ${item.employeeName}.`);
    }
  };

  const handleToggleVerifyPayroll = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextState = !e.isPayrollVerified;
          showToast(nextState ? `Payroll verified for ${e.name}.` : `Verification reset for ${e.name}.`);
          try {
            fetch(`http://localhost:5000/api/payroll/${id}/verify`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isVerified: nextState })
            }).catch(() => {});
          } catch (_) {}
          return { ...e, isPayrollVerified: nextState };
        }
        return e;
      })
    );
  };

  const handleBatchVerifyPayroll = () => {
    setEmployees((prev) => prev.map((e) => ({ ...e, isPayrollVerified: true })));
    setPayrollReviews((prev) => prev.map((p) => ({ ...p, status: 'verified' })));
    showToast('All employee payroll records verified and approved.');
  };

  const handleToggleAttendanceStatus = (empId: string, newStatus?: 'Present' | 'Leave' | 'Half-day' | 'Absent') => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === empId) {
          const status = newStatus || (e.attendanceStatus === 'Present' ? 'Half-day' : 'Present');
          showToast(`Attendance updated: ${e.name} is now ${status}.`);
          return { ...e, attendanceStatus: status };
        }
        return e;
      })
    );
  };

  const handleAddMilestone = (newMilestone: LifecycleMilestone) => {
    setLifecycleMilestones((prev) => [newMilestone, ...prev]);
    showToast(`Milestone '${newMilestone.title}' logged for ${newMilestone.employeeName}.`);
    try {
      fetch('http://localhost:5000/api/lifecycle/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMilestone)
      }).catch(() => {});
    } catch (_) {}
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('dayflow_auth_user');
    sessionStorage.removeItem('dayflow_auth_user');
    setCurrentUser(null);
  };

  const handleRegisterUser = (newUser: AuthUser) => {
    showToast(`Account created for ${newUser.name}. Welcome!`);
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} onRegisterUser={handleRegisterUser} />;
  }

  return (
    <div className="min-h-screen bg-[#FCF8FA] text-[#1B1B1D] flex font-sans antialiased">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="md:ml-[280px] min-h-screen flex flex-col flex-1 relative w-full overflow-x-hidden">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          employees={employees}
          pendingLeaves={pendingLeaves}
          missingCheckouts={missingCheckouts}
          payrollReviews={payrollReviews}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSelectEmployee={(emp) => setSelectedEmployee(emp)}
          onOpenActionCenter={handleOpenActionCenter}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-150">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              employees={employees}
              pendingLeaves={pendingLeaves}
              missingCheckouts={missingCheckouts}
              payrollReviews={payrollReviews}
              lifecycleMilestones={lifecycleMilestones}
              onOpenActionCenter={handleOpenActionCenter}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onOpenDayDetail={(day) => setSelectedDay(day)}
              onToggleVerifyPayroll={handleToggleVerifyPayroll}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView
              employees={employees}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
              onToggleVerifyPayroll={handleToggleVerifyPayroll}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollView
              employees={employees}
              onToggleVerifyPayroll={handleToggleVerifyPayroll}
              onBatchVerifyPayroll={handleBatchVerifyPayroll}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              employees={employees}
              pendingLeaves={pendingLeaves}
              missingCheckouts={missingCheckouts}
              onOpenActionCenter={handleOpenActionCenter}
              onToggleAttendance={handleToggleAttendanceStatus}
            />
          )}

          {activeTab === 'lifecycle' && (
            <LifecycleView
              milestones={lifecycleMilestones}
              employees={employees}
              onAddMilestone={handleAddMilestone}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      <ActionCenterModal
        isOpen={isActionCenterOpen}
        onClose={() => setIsActionCenterOpen(false)}
        initialTab={actionCenterTab}
        pendingLeaves={pendingLeaves}
        missingCheckouts={missingCheckouts}
        payrollReviews={payrollReviews}
        onApproveLeave={handleApproveLeave}
        onRejectLeave={handleRejectLeave}
        onResolveCheckout={handleResolveCheckout}
        onVerifyPayrollReview={handleVerifyPayrollReview}
      />

      <EmployeeDetailModal
        isOpen={selectedEmployee !== null}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        onToggleVerifyPayroll={handleToggleVerifyPayroll}
      />

      <DayDetailModal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        day={selectedDay}
        employees={employees}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
