export type NavTab = 'dashboard' | 'employees' | 'payroll' | 'attendance' | 'lifecycle' | 'settings';

export interface Employee {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  department: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  isPayrollVerified: boolean;
  status: 'Active' | 'On Leave' | 'Terminated';
  attendanceStatus: 'Present' | 'Leave' | 'Half-day' | 'Absent';
  joinDate: string;
  phone: string;
  location: string;
}

export interface PendingLeave {
  id: string;
  employeeId: string;
  employeeName: string;
  initials: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MissingCheckout {
  id: string;
  employeeId: string;
  employeeName: string;
  initials: string;
  department: string;
  date: string;
  checkInTime: string;
  shift: string;
  status: 'pending' | 'resolved';
}

export interface PayrollReview {
  id: string;
  employeeId: string;
  employeeName: string;
  initials: string;
  department: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  issue: string;
  discrepancyNote: string;
  status: 'pending' | 'verified';
}

export interface LifecycleMilestone {
  id: string;
  type: 'joined' | 'promotion' | 'profile_completed' | 'checkin' | 'leave_approved' | 'review';
  title: string;
  subtitle: string;
  timeLabel: string;
  date: string;
  employeeName: string;
  employeeId?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface CalendarDay {
  dayNumber: number;
  dateString: string;
  isCurrentMonth: boolean;
  status?: 'present' | 'absent' | 'half-day' | 'leave' | 'weekend';
  presentCount?: number;
  absentCount?: number;
  leaveCount?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarUrl?: string;
}