# DayFlow — Smart HR Workflow Automation

WorkSync HR Engine 🚀

Dayflow Enterprise HRMS Solution | Developed for the Odoo Hackathon 2026

WorkSync HR Engine is a production-ready, full-stack Human Resource Management System (HRMS) built to replace fragmented spreadsheets with a centralized enterprise workspace. Designed around the Daflow workflow automation, it streamlines HR operations and enhances employee engagement.

## 🌟 Key Modules & System Features

### 👨‍💼 HR & Administrator Console

**Employee Directory & Onboarding**: Onboard new staff with auto-generated unique Employee IDs (e.g., EMP-1001), role assignments, and department routing.

**Live Attendance Dashboard**: Monitor real-time organization-wide check-in/check-out timestamps and active status counters (Present, Half-Day, Absent).

Leave Approval Queue: Review incoming time-off requests with customizable leave categories, auto-calculation of leave balances, and workflow-based approvals with administrative feedback.

Payroll Engine: Generate monthly compensation records with dynamic net salary calculations:
$$\text{Net Salary} = \text{Base Salary} + \text{Bonuses} - \text{Deductions}$$

👤 Employee Self-Service Portal
One-Click Workday Clock: Instant Clock-In / Clock-Out execution that dynamically computes shift duration.

Leave Request Workflow: Submit time-off applications (Paid, Sick, Unpaid) with date pickers and track live approval status updates.

Pay Slip Transparency: View and download historical salary disbursements and line-item compensation breakdowns.

Profile Management: View organizational info and securely update credentials.

⚡ Smart HR Workflow Automation
HR Action Center: Consolidated alerts for pending approvals, missing checkouts, and unverified payroll.

Smart Attendance Calendar: Color-coded monthly workforce grid (Present, Absent, Half-Day, Leave).

Employee Lifecycle Timeline: History tracking from onboarding to promotions.

🛡️ Engineering & Security Standards
Role-Based Access Control (RBAC): Server-side route guards enforcing administrative boundary isolation.

Cryptographic Security: JWT-based token authentication and bcrypt salted password hashing.

Relational Data Integrity: Built on a normalized schema with explicit Foreign Key constraints to prevent orphan data.

Defensive Error Handling: Input sanitization and error boundary toasts preventing system crashes on edge cases.




