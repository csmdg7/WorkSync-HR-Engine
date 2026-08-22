import React, { useState, useEffect } from 'react';
import { NavTab, Employee, CalendarDay, LifecycleMilestone, PendingLeave, MissingCheckout, PayrollReview } from './types';
import {
  initialEmployees,
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
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { ActionCenterModal } from './components/ActionCenterModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { DayDetailModal } from './components/DayDetailModal';
import { HelpModal } from './components/HelpModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data States (Initialized with fallback data, dynamically syncable with backend)
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [pendingLeaves, setPendingLeaves] = useState<PendingLeave[]>(initialPendingLeaves);
  const [missingCheckouts, setMissingCheckouts] = useState<MissingCheckout[]>(initialMissingCheckouts);
  const [payrollReviews, setPayrollReviews] = useState<PayrollReview[]>(initialPayrollReviews);
  const [lifecycleMilestones, setLifecycleMilestones] = useState<LifecycleMilestone[]>(initialLifecycleMilestones);

  // Modals State
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [actionCenterTab, setActionCenterTab] = useState<'leaves' | 'checkouts' | 'payroll'>('leaves');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Optional: Dynamic sync from backend if running on localhost:5000
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setEmployees(data.data);
          }
        }
      } catch (e) {
        // Backend not running on :5000; safely fallback to standard local state
        console.info('Running with integrated local state storage.');
      }
    };
    fetchBackendData();
  }, []);

  // Add Employee Handler
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
    const milestone: LifecycleMilestone = {
      id: `LM-${Date.now()}`,
      type: 'joined',
      title: 'Joined',
      subtitle: `${newEmp.role} joined ${newEmp.department}`,
      timeLabel: 'JUST NOW',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      employeeName: newEmp.name,
      icon: 'how_to_reg',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700'
    };
    setLifecycleMilestones((prev) => [milestone, ...prev]);
    showToast(`New employee ${newEmp.name} onboarded successfully.`);

    // Try posting to backend if online
    try {
      fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp)
      }).catch(() => {});
    } catch (_) {}
  };

  // Action Center Handlers
  const handleOpenActionCenter = (tab: 'leaves' | 'checkouts' | 'payroll') => {
    setActionCenterTab(tab);
    setIsActionCenterOpen(true);
  };

  const handleApproveLeave = (id: string) => {
    const item = pendingLeaves.find((l) => l.id === id);
    setPendingLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'approved' } : l))
    );
    if (item) {
      const milestone: LifecycleMilestone = {
        id: `LM-${Date.now()}`,
        type: 'leave_approved',
        title: 'Leave Approved',
        subtitle: `${item.leaveType} (${item.days}d) approved`,
        timeLabel: 'JUST NOW',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        employeeName: item.employeeName,
        icon: 'flight_takeoff',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600'
      };
      setLifecycleMilestones((prev) => [milestone, ...prev]);
      showToast(`Approved leave request for ${item.employeeName}.`);

      // Try backend patch
      try {
        fetch(`http://localhost:5000/api/leaves/${id}/approve`, { method: 'PATCH' }).catch(() => {});
      } catch (_) {}
    }
  };

  const handleRejectLeave = (id: string) => {
    const item = pendingLeaves.find((l) => l.id === id);
    setPendingLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l))
    );
    if (item) {
      showToast(`Rejected leave request for ${item.employeeName}.`);
      try {
        fetch(`http://localhost:5000/api/leaves/${id}/reject`, { method: 'PATCH' }).catch(() => {});
      } catch (_) {}
    }
  };

  const handleResolveCheckout = (id: string, time: string) => {
    const item = missingCheckouts.find((c) => c.id === id);
    setMissingCheckouts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved' } : c))
    );
    if (item) {
      showToast(`Checkout timestamp reconciled at ${time} for ${item.employeeName}.`);
    }
  };

  const handleVerifyPayrollReview = (id: string) => {
    const item = payrollReviews.find((p) => p.id === id);
    setPayrollReviews((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'verified' } : p))
    );
    if (item) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === item.employeeId ? { ...e, isPayrollVerified: true } : e))
      );
      showToast(`Payroll discrepancy verified and cleared for ${item.employeeName}.`);
      try {
        fetch(`http://localhost:5000/api/payroll/${item.employeeId}/verify`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isVerified: true })
        }).catch(() => {});
      } catch (_) {}
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

  return (
    <div className="min-h-screen bg-[#FCF8FA] text-[#1B1B1D] flex font-sans antialiased">
      {/* Fixed Side Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:ml-[280px] min-h-screen flex flex-col flex-1 relative w-full overflow-x-hidden">
        {/* Sticky Top Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          employees={employees}
          pendingLeaves={pendingLeaves}
          payrollReviews={payrollReviews}
          onSelectEmployee={(emp) => setSelectedEmployee(emp)}
          onOpenActionCenter={handleOpenActionCenter}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-150">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Routing */}
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
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              employees={employees}
              pendingLeaves={pendingLeaves}
              missingCheckouts={missingCheckouts}
              onOpenActionCenter={handleOpenActionCenter}
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

      {/* Modals & Dialogs */}
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
