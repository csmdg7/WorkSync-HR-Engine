import axios from 'axios';
import { Employee, PendingLeave, LifecycleMilestone } from './types';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Employees
  getEmployees: async () => {
    const res = await apiClient.get<{ success: boolean; data: Employee[] }>('/employees');
    return res.data.data;
  },
  createEmployee: async (employeeData: Partial<Employee>) => {
    const res = await apiClient.post<{ success: boolean; data: Employee }>('/employees', employeeData);
    return res.data.data;
  },

  // Leaves & Rule Engine
  getPendingLeaves: async () => {
    const res = await apiClient.get<{ success: boolean; data: PendingLeave[] }>('/leaves/pending');
    return res.data.data;
  },
  approveLeave: async (leaveId: string) => {
    const res = await apiClient.patch<{ success: boolean }>(`/leaves/${leaveId}/approve`);
    return res.data;
  },
  rejectLeave: async (leaveId: string) => {
    const res = await apiClient.patch<{ success: boolean }>(`/leaves/${leaveId}/reject`);
    return res.data;
  },

  // Payroll
  getPayrollSummary: async () => {
    const res = await apiClient.get('/payroll/summary');
    return res.data;
  },
  toggleVerifyPayroll: async (employeeId: string, isVerified?: boolean) => {
    const res = await apiClient.patch<{ success: boolean; isPayrollVerified: boolean }>(
      `/payroll/${employeeId}/verify`,
      { isVerified }
    );
    return res.data;
  },

  // Attendance & Kiosk
  getAttendanceCalendar: async (month: string = '2023-10') => {
    const res = await apiClient.get(`/attendance/calendar?month=${month}`);
    return res.data.data;
  },
  scanBiometricBadge: async (employeeId: string) => {
    const res = await apiClient.post('/attendance/scan', { employeeId });
    return res.data;
  },

  // Lifecycle
  getMilestones: async () => {
    const res = await apiClient.get<{ success: boolean; data: LifecycleMilestone[] }>('/lifecycle/milestones');
    return res.data.data;
  },
  createMilestone: async (milestone: Partial<LifecycleMilestone>) => {
    const res = await apiClient.post<{ success: boolean; data: LifecycleMilestone }>('/lifecycle/milestones', milestone);
    return res.data.data;
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> 3621019 (feat: add backend integration, api client, and login view)
