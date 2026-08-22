/**
 * Database Seed Script for DayFlow HR Command Center
 * Run with: node backend/seed.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(DB_PATH);

console.log('🔄 Initializing SQLite database schema and seeding initial records...');

db.serialize(() => {
  // 1. Drop existing tables
  db.run('DROP TABLE IF EXISTS employees');
  db.run('DROP TABLE IF EXISTS leave_requests');
  db.run('DROP TABLE IF EXISTS attendance_logs');
  db.run('DROP TABLE IF EXISTS payroll_records');
  db.run('DROP TABLE IF EXISTS lifecycle_milestones');

  // 2. Create Tables
  db.run(`
    CREATE TABLE employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      initials TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      baseSalary REAL NOT NULL,
      allowances REAL DEFAULT 0,
      deductions REAL DEFAULT 0,
      netSalary REAL NOT NULL,
      isPayrollVerified INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Active',
      attendanceStatus TEXT DEFAULT 'Present',
      joinDate TEXT NOT NULL,
      phone TEXT,
      location TEXT
    )
  `);

  db.run(`
    CREATE TABLE leave_requests (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      initials TEXT NOT NULL,
      department TEXT NOT NULL,
      leaveType TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      days INTEGER NOT NULL,
      reason TEXT,
      appliedDate TEXT NOT NULL,
      status TEXT DEFAULT 'pending'
    )
  `);

  db.run(`
    CREATE TABLE attendance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      checkInTime TEXT,
      checkOutTime TEXT,
      shift TEXT
    )
  `);

  db.run(`
    CREATE TABLE payroll_records (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      initials TEXT NOT NULL,
      department TEXT NOT NULL,
      baseSalary REAL NOT NULL,
      allowances REAL DEFAULT 0,
      deductions REAL DEFAULT 0,
      netSalary REAL NOT NULL,
      issue TEXT,
      discrepancyNote TEXT,
      status TEXT DEFAULT 'pending'
    )
  `);

  db.run(`
    CREATE TABLE lifecycle_milestones (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      timeLabel TEXT NOT NULL,
      date TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      employeeId TEXT,
      icon TEXT NOT NULL,
      iconBg TEXT NOT NULL,
      iconColor TEXT NOT NULL
    )
  `);

  console.log('✅ Tables created successfully.');

  // 3. Seed Initial Employees
  const insertEmp = db.prepare(`
    INSERT INTO employees (
      id, name, initials, email, role, department,
      baseSalary, allowances, deductions, netSalary,
      isPayrollVerified, status, attendanceStatus, joinDate, phone, location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialEmployees = [
    ['EMP-001', 'Sarah Jenkins', 'SJ', 'sarah.jenkins@dayflow.io', 'Senior Product Designer', 'Product & Design', 4500, 350, 120, 4730, 1, 'Active', 'Present', '2023-10-16', '+1 (555) 234-5678', 'San Francisco, CA'],
    ['EMP-002', 'Michael Ross', 'MR', 'michael.ross@dayflow.io', 'Lead Fullstack Engineer', 'Engineering', 5200, 400, 150, 5450, 1, 'Active', 'Present', '2022-04-10', '+1 (555) 345-6789', 'New York, NY'],
    ['EMP-003', 'Emily Lin', 'EL', 'emily.lin@dayflow.io', 'Operations Specialist', 'People Operations', 4100, 200, 80, 4220, 0, 'Active', 'Present', '2023-10-15', '+1 (555) 456-7890', 'Austin, TX'],
    ['EMP-004', 'David Thorne', 'DT', 'david.thorne@dayflow.io', 'VP of Global Talent', 'Executive HR', 6000, 500, 250, 6250, 0, 'On Leave', 'Leave', '2021-08-01', '+1 (555) 567-8901', 'Seattle, WA'],
    ['EMP-005', 'Marcus Vance', 'MV', 'marcus.vance@dayflow.io', 'DevOps Architect', 'Engineering', 5800, 420, 190, 6030, 1, 'Active', 'Present', '2023-10-12', '+1 (555) 678-9012', 'Chicago, IL'],
    ['EMP-006', 'Chloe Rivera', 'CR', 'chloe.rivera@dayflow.io', 'Talent Acquisition Partner', 'People Operations', 4300, 250, 100, 4450, 1, 'Active', 'Half-day', '2023-01-15', '+1 (555) 789-0123', 'Denver, CO']
  ];

  initialEmployees.forEach((emp) => insertEmp.run(...emp));
  insertEmp.finalize();

  // 4. Seed Leave Requests
  const insertLeave = db.prepare(`
    INSERT INTO leave_requests (id, employeeId, employeeName, initials, department, leaveType, startDate, endDate, days, reason, appliedDate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLeave.run('LV-101', 'EMP-004', 'David Thorne', 'DT', 'Executive HR', 'Annual Leave', '2023-10-12', '2023-10-14', 3, 'Family vacation scheduled earlier this quarter.', '2023-10-08', 'pending');
  insertLeave.run('LV-102', 'EMP-006', 'Chloe Rivera', 'CR', 'People Operations', 'Casual Leave', '2023-10-19', '2023-10-20', 2, 'Personal appointments and home maintenance.', '2023-10-14', 'pending');
  insertLeave.finalize();

  // 5. Seed Attendance Logs
  const insertAttendance = db.prepare(`
    INSERT INTO attendance_logs (employeeId, date, status, checkInTime, checkOutTime, shift)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAttendance.run('EMP-001', '2023-10-16', 'Present', '08:45 AM', '05:30 PM', 'General Day (9h)');
  insertAttendance.run('EMP-002', '2023-10-16', 'Present', '09:00 AM', '06:00 PM', 'Engineering Core (9h)');
  insertAttendance.run('EMP-003', '2023-10-15', 'Present', '08:45 AM', null, 'General Day (9h)'); // missing checkout
  insertAttendance.run('EMP-004', '2023-10-12', 'Leave', null, null, 'Approved Leave');
  insertAttendance.finalize();

  // 6. Seed Payroll Reviews
  const insertPR = db.prepare(`
    INSERT INTO payroll_records (id, employeeId, employeeName, initials, department, baseSalary, allowances, deductions, netSalary, issue, discrepancyNote, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPR.run('PR-301', 'EMP-003', 'Emily Lin', 'EL', 'People Operations', 4100, 200, 80, 4220, 'Overtime allowance mismatch with logged bi-weekly hours (+4.5 hrs).', 'System logged +$200 instead of standard $120.', 'pending');
  insertPR.run('PR-302', 'EMP-004', 'David Thorne', 'DT', 'Executive HR', 6000, 500, 250, 6250, 'Executive travel allowance voucher verification pending.', 'Receipt submission #TR-881 verified by accounting.', 'pending');
  insertPR.finalize();

  // 7. Seed Lifecycle Milestones
  const insertMilestone = db.prepare(`
    INSERT INTO lifecycle_milestones (id, type, title, subtitle, timeLabel, date, employeeName, employeeId, icon, iconBg, iconColor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMilestone.run('LM-401', 'joined', 'Joined', 'New hires onboarded', 'TODAY', 'Oct 16, 2023', 'Sarah Jenkins', 'EMP-001', 'how_to_reg', 'bg-emerald-100', 'text-emerald-700');
  insertMilestone.run('LM-402', 'profile_completed', 'Profile Completed', 'Documents verified', 'YESTERDAY', 'Oct 15, 2023', 'Emily Lin', 'EMP-003', 'account_box', 'bg-blue-100', 'text-blue-700');
  insertMilestone.run('LM-403', 'promotion', 'Promotion', 'Role updated in system', 'OCT 05', 'Oct 05, 2023', 'Michael Ross', 'EMP-002', 'military_tech', 'bg-amber-100', 'text-amber-700');
  insertMilestone.finalize();

  console.log('🎉 Seeding complete! Database ready in database.db');
  db.close();
});