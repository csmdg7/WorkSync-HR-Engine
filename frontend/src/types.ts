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
  status: 'Active' | 'On Leave' | 'Probation' | 'Terminated';
  attendanceStatus: 'Present' | 'Absent' | 'Half-day' | 'Leave';
  joinDate: string;
  phone: string;
  location: string;
  avatarUrl?: string;
}

export interface PendingLeave {
  id: string;
  employeeId: string;
  employeeName: string;
  initials: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity Leave';
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
  expectedCheckOutTime: string;
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
  type: 'joined' | 'profile_completed' | 'first_checkin' | 'leave_approved' | 'promotion';
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
  isCurrentMonth: boolean;
  status: 'present' | 'absent' | 'half-day' | 'leave' | 'neutral';
  hasDot?: boolean;
  presentCount?: number;
  absentCount?: number;
  leaveCount?: number;
}
