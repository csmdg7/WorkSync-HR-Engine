# DayFlow — Smart HR Workflow Automation

**WorkSync HR Engine** 🚀

*Dayflow Enterprise HRMS Solution | Developed for the Odoo Hackathon 2026*

WorkSync HR Engine is a production-ready, full-stack Human Resource Management System (HRMS) built to replace fragmented spreadsheets with a centralized enterprise workspace. Designed around the Dayflow framework, it streamlines employee lifecycle management, automated leave workflows, real-time attendance tracking, and dynamic payroll calculations—all within a secure, role-based access control (RBAC) environment.

---

## 🌟 Key Modules & System Features

### 👨‍💼 HR & Administrator Console

- **Employee Directory & Onboarding**: Onboard new staff with auto-generated unique Employee IDs (e.g., EMP-1001), role assignments, and department routing.

- **Live Attendance Dashboard**: Monitor real-time organization-wide check-in/check-out timestamps and active status counters (Present, Half-Day, Absent).

- **Leave Approval Queue**: Review incoming time-off requests with customizable leave categories, auto-calculation of leave balances, and workflow-based approvals with administrative feedback.

- **Payroll Engine**: Generate monthly compensation records with dynamic net salary calculations:
  $$\text{Net Salary} = \text{Base Salary} + \text{Bonuses} - \text{Deductions}$$

### 👤 Employee Self-Service Portal

- **One-Click Workday Clock**: Instant Clock-In / Clock-Out execution that dynamically computes shift duration.

- **Leave Request Workflow**: Submit time-off applications (Paid, Sick, Unpaid) with date pickers and track live approval status updates.

- **Pay Slip Transparency**: View and download historical salary disbursements and line-item compensation breakdowns.

- **Profile Management**: View organizational info and securely update credentials.

### ⚡ Smart HR Workflow Automation

- **HR Action Center**: Consolidated alerts for pending approvals, missing checkouts, and unverified payroll.

- **Smart Attendance Calendar**: Color-coded monthly workforce grid (Present, Absent, Half-Day, Leave).

- **Employee Lifecycle Timeline**: History tracking from onboarding to promotions.

### 🛡️ Engineering & Security Standards

- **Role-Based Access Control (RBAC)**: Server-side route guards enforcing administrative boundary isolation.

- **Cryptographic Security**: JWT-based token authentication and bcrypt salted password hashing.

- **Relational Data Integrity**: Built on a normalized schema with explicit Foreign Key constraints to prevent orphan data.

- **Defensive Error Handling**: Input sanitization and error boundary toasts preventing system crashes on edge cases.

---

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite 6, TailwindCSS 4, React Router 7
- **Backend**: Node.js, Express 5, SQLite3
- **Database**: SQLite (embedded, no external dependencies)
- **Authentication**: JWT + bcryptjs
- **Additional Libraries**: Axios (API calls), Lucide React (icons), Motion (animations)

---

## 📁 Project Structure

```
WorkSync-HR-Engine/
├── backend/                    # Node.js + Express REST API
│   ├── server.js              # Main Express app, API endpoints, database middleware
│   ├── seed.js                # Database initialization & sample data
│   ├── package.json           # Backend dependencies
│   └── database.db            # SQLite database (created on first run)
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Root app component
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page-level components
│   │   ├── styles/            # TailwindCSS styling
│   │   └── assets/            # Images, logos, icons
│   ├── vite.config.js         # Vite bundler configuration
│   ├── package.json           # Frontend dependencies
│   └── .env.example           # Environment variables template
│
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

### How It Works

**Request Flow:**
1. React SPA (frontend) running on `http://localhost:3000` renders the UI
2. User interactions trigger API calls via Axios to the backend
3. Backend Express server (running on `http://localhost:5000`) receives requests
4. Server queries SQLite database (`backend/database.db`)
5. Response is serialized as JSON and sent back to frontend
6. Frontend updates state and re-renders components

**Data Flow:**
- Employee lifecycle events trigger automatic lifecycle milestones
- Leave approvals trigger attendance log synchronization
- Payroll calculations use the formula: `Base Salary + Allowances - Deductions`
- All operations are logged with timestamps and employee context

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v18.0+ (LTS recommended)
- **npm**: v9.0+ (comes with Node.js)
- **Git**: For cloning the repository
- **Bash/Terminal**: For running commands

### Step 1: Clone the Repository

```bash
git clone https://github.com/csmdg7/WorkSync-HR-Engine.git
cd WorkSync-HR-Engine
```

### Step 2: Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

### Step 3: Initialize the Database

Navigate to the backend directory and run the seed script to create the database schema and populate sample data:

```bash
cd backend
node seed.js
```

**Expected Output:**
```
🔄 Initializing SQLite database schema and seeding initial records...
✅ Tables created successfully.
🎉 Seeding complete! Database ready in database.db
```

This script will:
- Create 5 database tables: `employees`, `leave_requests`, `attendance_logs`, `payroll_records`, `lifecycle_milestones`
- Seed 6 sample employees (Sarah Jenkins, Michael Ross, Emily Lin, David Thorne, Marcus Vance, Chloe Rivera)
- Add sample leave requests, attendance logs, and payroll records

### Step 4: Start the Backend Server

From the `backend/` directory:

```bash
npm start
```

Or manually:
```bash
node server.js
```

**Expected Output:**
```
✅ Connected to SQLite database: /path/to/database.db
🚀 DayFlow HR Command Backend Server running on http://localhost:5000
```

The backend will:
- Establish connection to `database.db`
- Start listening for API requests on port 5000
- Serve REST endpoints for employees, leaves, payroll, and attendance

### Step 5: Start the Frontend Development Server

From the `frontend/` directory:

```bash
npm run dev
```

**Expected Output:**
```
  VITE v6.2.3  ready in 456 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open your browser and navigate to **http://localhost:3000**

### Step 6: Verify the Application

Once both servers are running:

1. **Backend Health Check**: Visit `http://localhost:5000/api/employees` in your browser
   - Should return a JSON array of 6 sample employees

2. **Frontend Dashboard**: Visit `http://localhost:3000` in your browser
   - You should see the HR dashboard interface

---

## 📡 Available API Endpoints

### Employees
- `GET /api/employees` — List all employees (with filtering by department/status)
- `POST /api/employees` — Onboard a new employee

### Leave Requests
- `GET /api/leaves/pending` — Get pending leave approvals
- `PATCH /api/leaves/:id/approve` — Approve a leave request (auto-sync attendance)
- `PATCH /api/leaves/:id/reject` — Reject a leave request

### Payroll
- `GET /api/payroll/summary` — Get payroll summary and employee records
- `PATCH /api/payroll/:employeeId/verify` — Verify/toggle payroll status

### Attendance
- `GET /api/attendance/calendar` — Get attendance calendar for a month
- `POST /api/attendance/scan` — Check-in / Check-out (biometric simulation)

### Lifecycle
- `GET /api/lifecycle/milestones` — Fetch employee milestones timeline
- `POST /api/lifecycle/milestones` — Record a new milestone (promotion, onboarding, etc.)

---

## 🔧 Configuration & Environment Variables

### Backend Environment
Create a `.env` file in the `backend/` directory (optional, defaults are provided):

```env
# Server Port (default: 5000)
PORT=5000

# Database Path (default: ./database.db)
DB_PATH=./database.db

# CORS Origin (default: *)
CORS_ORIGIN=*
```

### Frontend Environment
The frontend automatically connects to `http://localhost:5000/api`. If you need to change the API endpoint, modify the Axios configuration in your components.

---

## 🗄️ Database Schema

### employees
```sql
CREATE TABLE employees (
  id TEXT PRIMARY KEY,              -- EMP-001, EMP-002, etc.
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  baseSalary REAL NOT NULL,
  allowances REAL DEFAULT 0,
  deductions REAL DEFAULT 0,
  netSalary REAL NOT NULL,          -- Auto-calculated: base + allowances - deductions
  isPayrollVerified INTEGER,        -- 0 or 1 (boolean)
  status TEXT,                      -- Active, On Leave, Inactive
  attendanceStatus TEXT,            -- Present, Absent, Half-day, Leave
  joinDate TEXT NOT NULL,           -- YYYY-MM-DD
  phone TEXT,
  location TEXT
)
```

### leave_requests
```sql
CREATE TABLE leave_requests (
  id TEXT PRIMARY KEY,
  employeeId TEXT NOT NULL,
  employeeName TEXT NOT NULL,
  leaveType TEXT NOT NULL,         -- Annual Leave, Casual Leave, Sick Leave
  startDate TEXT NOT NULL,         -- YYYY-MM-DD
  endDate TEXT NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT,
  appliedDate TEXT NOT NULL,
  status TEXT DEFAULT 'pending'    -- pending, approved, rejected
)
```

### attendance_logs
```sql
CREATE TABLE attendance_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employeeId TEXT NOT NULL,
  date TEXT NOT NULL,              -- YYYY-MM-DD
  status TEXT NOT NULL,            -- Present, Absent, Half-day, Leave
  checkInTime TEXT,                -- HH:MM AM/PM
  checkOutTime TEXT,
  shift TEXT                       -- General Day (9h), etc.
)
```

### payroll_records
```sql
CREATE TABLE payroll_records (
  id TEXT PRIMARY KEY,
  employeeId TEXT NOT NULL,
  employeeName TEXT NOT NULL,
  baseSalary REAL NOT NULL,
  allowances REAL DEFAULT 0,
  deductions REAL DEFAULT 0,
  netSalary REAL NOT NULL,
  issue TEXT,                      -- Description of payroll issue
  status TEXT DEFAULT 'pending'    -- pending, verified
)
```

### lifecycle_milestones
```sql
CREATE TABLE lifecycle_milestones (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,              -- joined, promotion, profile_completed
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  date TEXT NOT NULL,
  employeeName TEXT NOT NULL,
  employeeId TEXT,
  icon TEXT NOT NULL,              -- Material icon name
  iconBg TEXT NOT NULL,            -- Tailwind bg class
  iconColor TEXT NOT NULL          -- Tailwind text color class
)
```

---

## 🧪 Sample Data

The database is pre-seeded with 6 employees:

| ID | Name | Role | Department | Net Salary |
|---|---|---|---|---|
| EMP-001 | Sarah Jenkins | Senior Product Designer | Product & Design | $4,730 |
| EMP-002 | Michael Ross | Lead Fullstack Engineer | Engineering | $5,450 |
| EMP-003 | Emily Lin | Operations Specialist | People Operations | $4,220 |
| EMP-004 | David Thorne | VP of Global Talent | Executive HR | $6,250 |
| EMP-005 | Marcus Vance | DevOps Architect | Engineering | $6,030 |
| EMP-006 | Chloe Rivera | Talent Acquisition Partner | People Operations | $4,450 |

Sample leave requests, attendance logs, and payroll records are also included for testing.

---

## 📝 Scripts Reference

### Backend Scripts
```bash
# Start backend server
npm start

# Reinitialize database (careful: deletes all data)
node seed.js
```

### Frontend Scripts
```bash
# Start dev server (HMR enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Clean build artifacts
npm run clean
```

---

## 🔐 Security Considerations

1. **RBAC**: The system uses JWT tokens to enforce role-based access (Admin vs. Employee)
2. **Password Hashing**: Passwords are hashed with bcryptjs (not implemented in this version; ready for auth)
3. **Input Validation**: API endpoints validate required fields and reject malformed requests
4. **CORS**: Enabled for localhost development; restrict in production
5. **Database**: SQLite is file-based; use a production database (PostgreSQL/MySQL) for enterprise deployment

---

## 🐛 Troubleshooting

### Backend won't start: "Address already in use"
The port 5000 is already in use. Change the port:
```bash
PORT=5001 npm start
```

### Frontend can't connect to backend
- Verify backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Ensure API endpoint in frontend code points to correct backend URL

### Database errors: "SQLITE_CANTOPEN"
- Ensure `backend/` directory exists and has write permissions
- Delete `database.db` and run `node seed.js` again to reinitialize

### Sample data not loading
- Run `node backend/seed.js` from the repository root
- Verify no errors are printed to console

---

## 📚 Further Development

### Adding New Features
1. Create database migration scripts in `backend/migrations/`
2. Add new Express routes in `backend/server.js`
3. Build React components in `frontend/src/components/`
4. Update types/schemas as needed

### Deployment
- **Backend**: Deploy to Node.js runtime (Heroku, AWS Lambda, DigitalOcean, etc.)
- **Frontend**: Build and deploy static site to CDN (Vercel, Netlify, etc.)
- **Database**: Migrate from SQLite to PostgreSQL/MySQL for production scale

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is built for the Odoo Hackathon 2026. Check the repository for specific licensing details.

---

## 📧 Support & Questions

For issues, questions, or feature requests, please open a GitHub issue or contact the maintainers.

**Happy HR automation! 🎉**
