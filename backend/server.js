/**
 * DayFlow HR Command Center - Backend REST API
 * Node.js + Express + SQLite3
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.resolve(__dirname, 'database.db');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite3 Database Connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database:', DB_PATH);
  }
});

// Promisified database helper methods
const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      err ? reject(err) : resolve({ id: this.lastID, changes: this.changes });
    });
  });

/* ==========================================================================
   1. EMPLOYEES ENDPOINTS
   ========================================================================== */

// GET /api/employees - List all employees
app.get('/api/employees', async (req, res) => {
  try {
    const { department, status, search } = req.query;
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (department && department !== 'All') {
      query += ' AND department = ?';
      params.push(department);
    }
    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (name LIKE ? OR role LIKE ? OR id LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY joinDate DESC';
    const employees = await dbAll(query, params);

    // Format boolean fields
    const formatted = employees.map((emp) => ({
      ...emp,
      isPayrollVerified: Boolean(emp.isPayrollVerified)
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/employees - Onboard new employee
app.post('/api/employees', async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      department,
      baseSalary,
      allowances = 0,
      deductions = 0,
      status = 'Active',
      phone = '',
      location = 'San Francisco, CA'
    } = req.body;

    if (!name || !email || !role || !department || baseSalary === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required employee fields' });
    }

    // Auto-generate employee ID and initials
    const parts = name.trim().split(' ');
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();

    const empId = `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const joinDate = new Date().toISOString().split('T')[0];
    const netSalary = Number(baseSalary) + Number(allowances) - Number(deductions);

    // 1. Insert Employee Record
    await dbRun(
      `INSERT INTO employees (
        id, name, initials, email, role, department,
        baseSalary, allowances, deductions, netSalary,
        isPayrollVerified, status, attendanceStatus, joinDate, phone, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'Present', ?, ?, ?)`,
      [
        empId,
        name,
        initials,
        email,
        role,
        department,
        baseSalary,
        allowances,
        deductions,
        netSalary,
        status,
        joinDate,
        phone,
        location
      ]
    );

    // 2. Automatically log a lifecycle milestone
    await dbRun(
      `INSERT INTO lifecycle_milestones (
        id, type, title, subtitle, timeLabel, date, employeeName, employeeId, icon, iconBg, iconColor
      ) VALUES (?, 'joined', 'Joined', ?, 'JUST NOW', ?, ?, ?, 'how_to_reg', 'bg-emerald-100', 'text-emerald-700')`,
      [
        `LM-${Date.now()}`,
        `${role} joined ${department}`,
        joinDate,
        name,
        empId
      ]
    );

    const createdEmp = await dbGet('SELECT * FROM employees WHERE id = ?', [empId]);
    res.status(201).json({
      success: true,
      message: 'Employee onboarded successfully',
      data: { ...createdEmp, isPayrollVerified: Boolean(createdEmp.isPayrollVerified) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ==========================================================================
   2. LEAVE REQUESTS & APPROVAL RULE ENGINE
   ========================================================================== */

// GET /api/leaves/pending - Get pending leave requests
app.get('/api/leaves/pending', async (req, res) => {
  try {
    const leaves = await dbAll(
      "SELECT * FROM leave_requests WHERE status = 'pending' ORDER BY appliedDate DESC"
    );
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper: generate array of date strings between start and end
function getDatesInRange(startDateStr, endDateStr) {
  const dates = [];
  const curr = new Date(startDateStr);
  const end = new Date(endDateStr);
  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

// PATCH /api/leaves/:id/approve - Approve leave & execute Rule Engine
app.patch('/api/leaves/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await dbGet('SELECT * FROM leave_requests WHERE id = ?', [id]);

    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }

    // 1. Update Leave Request status
    await dbRun("UPDATE leave_requests SET status = 'approved' WHERE id = ?", [id]);

    // 2. Rule Engine: Automatically update attendance logs to 'Leave' for the date range
    const dates = getDatesInRange(leave.startDate, leave.endDate);
    for (const date of dates) {
      const existing = await dbGet(
        'SELECT id FROM attendance_logs WHERE employeeId = ? AND date = ?',
        [leave.employeeId, date]
      );
      if (existing) {
        await dbRun(
          "UPDATE attendance_logs SET status = 'Leave', checkInTime = NULL, checkOutTime = NULL WHERE id = ?",
          [existing.id]
        );
      } else {
        await dbRun(
          "INSERT INTO attendance_logs (employeeId, date, status, shift) VALUES (?, ?, 'Leave', 'Approved Leave')",
          [leave.employeeId, date]
        );
      }
    }

    // 3. Update current employee attendance status if today falls within the leave
    const todayStr = new Date().toISOString().split('T')[0];
    if (dates.includes(todayStr)) {
      await dbRun(
        "UPDATE employees SET status = 'On Leave', attendanceStatus = 'Leave' WHERE id = ?",
        [leave.employeeId]
      );
    }

    // 4. Log Lifecycle Milestone
    await dbRun(
      `INSERT INTO lifecycle_milestones (
        id, type, title, subtitle, timeLabel, date, employeeName, employeeId, icon, iconBg, iconColor
      ) VALUES (?, 'leave_approved', 'Leave Approved', ?, 'JUST NOW', ?, ?, ?, 'flight_takeoff', 'bg-slate-100', 'text-slate-600')`,
      [
        `LM-${Date.now()}`,
        `${leave.leaveType} (${leave.days}d) approved`,
        todayStr,
        leave.employeeName,
        leave.employeeId
      ]
    );

    res.json({ success: true, message: 'Leave approved and attendance synchronized' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/leaves/:id/reject - Reject leave
app.patch('/api/leaves/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun("UPDATE leave_requests SET status = 'rejected' WHERE id = ?", [id]);
    res.json({ success: true, message: 'Leave request rejected' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ==========================================================================
   3. PAYROLL SUMMARY & VERIFICATION
   ========================================================================== */

// GET /api/payroll/summary - Calculate aggregate & individual payroll records
app.get('/api/payroll/summary', async (req, res) => {
  try {
    const employees = await dbAll('SELECT * FROM employees');

    let totalBaseSalary = 0;
    let totalAllowances = 0;
    let totalDeductions = 0;
    let totalNetSalary = 0;
    let verifiedCount = 0;

    const payrollList = employees.map((emp) => {
      // Dynamic Net Salary Formula: Base + Allowances - Deductions
      const net = Number(emp.baseSalary) + Number(emp.allowances) - Number(emp.deductions);
      const isVerified = Boolean(emp.isPayrollVerified);

      totalBaseSalary += Number(emp.baseSalary);
      totalAllowances += Number(emp.allowances);
      totalDeductions += Number(emp.deductions);
      totalNetSalary += net;
      if (isVerified) verifiedCount++;

      return {
        id: emp.id,
        name: emp.name,
        initials: emp.initials,
        role: emp.role,
        department: emp.department,
        baseSalary: emp.baseSalary,
        allowances: emp.allowances,
        deductions: emp.deductions,
        netSalary: net,
        isPayrollVerified: isVerified
      };
    });

    res.json({
      success: true,
      summary: {
        totalEmployees: employees.length,
        verifiedCount,
        pendingCount: employees.length - verifiedCount,
        totalBaseSalary,
        totalAllowances,
        totalDeductions,
        totalNetSalary
      },
      records: payrollList
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/payroll/:employeeId/verify - Toggle or set payroll verification
app.patch('/api/payroll/:employeeId/verify', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { isVerified } = req.body;

    const emp = await dbGet('SELECT isPayrollVerified FROM employees WHERE id = ?', [employeeId]);
    if (!emp) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const nextState = isVerified !== undefined ? (isVerified ? 1 : 0) : emp.isPayrollVerified ? 0 : 1;
    await dbRun('UPDATE employees SET isPayrollVerified = ? WHERE id = ?', [nextState, employeeId]);

    // Also clear pending payroll review tickets for this employee
    if (nextState === 1) {
      await dbRun("UPDATE payroll_records SET status = 'verified' WHERE employeeId = ?", [employeeId]);
    }

    res.json({
      success: true,
      employeeId,
      isPayrollVerified: Boolean(nextState),
      message: `Payroll ${nextState === 1 ? 'verified' : 'reset'} for employee ${employeeId}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ==========================================================================
   4. ATTENDANCE CALENDAR & BIOMETRIC KIOSK SCAN
   ========================================================================== */

// GET /api/attendance/calendar - Attendance stats aggregated by date
app.get('/api/attendance/calendar', async (req, res) => {
  try {
    const { month = '2023-10' } = req.query; // YYYY-MM

    // Aggregate attendance counts by date
    const rows = await dbAll(
      `SELECT 
        date,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absentCount,
        SUM(CASE WHEN status = 'Half-day' THEN 1 ELSE 0 END) as halfDayCount,
        SUM(CASE WHEN status = 'Leave' THEN 1 ELSE 0 END) as leaveCount
      FROM attendance_logs
      WHERE date LIKE ?
      GROUP BY date`,
      [`${month}%`]
    );

    res.json({ success: true, month, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/attendance/scan - Turnstile biometric check-in / check-out
app.post('/api/attendance/scan', async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({ success: false, error: 'employeeId is required' });
    }

    const employee = await dbGet('SELECT * FROM employees WHERE id = ?', [employeeId]);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const existingLog = await dbGet(
      'SELECT * FROM attendance_logs WHERE employeeId = ? AND date = ?',
      [employeeId, todayStr]
    );

    if (!existingLog) {
      // First scan of the day -> Check In
      await dbRun(
        `INSERT INTO attendance_logs (employeeId, date, status, checkInTime, shift)
         VALUES (?, ?, 'Present', ?, 'General Day (9h)')`,
        [employeeId, todayStr, nowTimeStr]
      );
      await dbRun("UPDATE employees SET attendanceStatus = 'Present' WHERE id = ?", [employeeId]);

      return res.json({
        success: true,
        type: 'CHECK_IN',
        employeeName: employee.name,
        time: nowTimeStr,
        message: `Badge check-in recorded for ${employee.name} at ${nowTimeStr}`
      });
    } else if (!existingLog.checkOutTime) {
      // Second scan of the day -> Check Out
      await dbRun('UPDATE attendance_logs SET checkOutTime = ? WHERE id = ?', [
        nowTimeStr,
        existingLog.id
      ]);

      return res.json({
        success: true,
        type: 'CHECK_OUT',
        employeeName: employee.name,
        time: nowTimeStr,
        message: `Badge check-out recorded for ${employee.name} at ${nowTimeStr}`
      });
    } else {
      return res.json({
        success: true,
        type: 'ALREADY_COMPLETED',
        employeeName: employee.name,
        message: `${employee.name} has already logged check-in (${existingLog.checkInTime}) and check-out (${existingLog.checkOutTime}) today.`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ==========================================================================
   5. LIFECYCLE MILESTONES
   ========================================================================== */

// GET /api/lifecycle/milestones - Fetch chronological milestone feed
app.get('/api/lifecycle/milestones', async (req, res) => {
  try {
    const milestones = await dbAll(
      'SELECT * FROM lifecycle_milestones ORDER BY rowid DESC'
    );
    res.json({ success: true, count: milestones.length, data: milestones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/lifecycle/milestones - Record new milestone
app.post('/api/lifecycle/milestones', async (req, res) => {
  try {
    const { title, subtitle, employeeName, employeeId, type = 'promotion' } = req.body;
    if (!title || !employeeName) {
      return res.status(400).json({ success: false, error: 'title and employeeName are required' });
    }

    const id = `LM-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    let icon = 'military_tech';
    let iconBg = 'bg-amber-100';
    let iconColor = 'text-amber-700';

    if (type === 'joined') {
      icon = 'how_to_reg';
      iconBg = 'bg-emerald-100';
      iconColor = 'text-emerald-700';
    } else if (type === 'profile_completed') {
      icon = 'account_box';
      iconBg = 'bg-blue-100';
      iconColor = 'text-blue-700';
    }

    await dbRun(
      `INSERT INTO lifecycle_milestones (
        id, type, title, subtitle, timeLabel, date, employeeName, employeeId, icon, iconBg, iconColor
      ) VALUES (?, ?, ?, ?, 'JUST NOW', ?, ?, ?, ?, ?, ?)`,
      [id, type, title, subtitle, dateStr, employeeName, employeeId || '', icon, iconBg, iconColor]
    );

    const created = await dbGet('SELECT * FROM lifecycle_milestones WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 DayFlow HR Command Backend Server running on http://localhost:${PORT}`);
});