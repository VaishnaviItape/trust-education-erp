# Trust Education ERP

[![Architecture](https://img.shields.io/badge/Architecture-Multi--Tenant-blue.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20React%20Native-brightgreen.svg)](#)
[![Brand](https://img.shields.io/badge/Brand%20Color-Orange%20%23EA580C-orange.svg)](#)

A modern, cloud-based, multi-institution Education ERP built specifically for an educational Trust running:
1. **School (K-12)** (~100 admissions/year)
2. **College of Hotel Management & Catering** (~200 admissions/year)

---

## ⚡ Quick Start (`npm start`)

You can now start any app simply by entering `npm start`:

### 1. Launch All Apps Together (One Command):
Open your terminal in `D:\trust-education-erp\trust-education-erp` and run:
```powershell
npm start
```
*(This automatically launches both the **Backend API (Port 5000)** and the **Web Portal (Port 3000)** concurrently!)*

---

### 2. Launch Individual Apps Separately:

#### A. Backend API (`api/`):
```powershell
cd api
npm start
```
👉 *API runs at: `http://localhost:5000`*

#### B. Web Portal & Public Website (`web/`):
```powershell
cd web
npm start
```
👉 *Web Portal opens at: `http://localhost:3000`*

#### C. Mobile App (`mobile/`):
```powershell
cd mobile
npm start
```
👉 *Expo Metro Bundler launches — scan QR code with Expo Go on your phone!*

---

## 📁 Repository Structure

```
trust-education-erp/
├── api/                    # Backend API (Node.js + Express + Prisma ORM)
├── web/                    # Web Admin Portal (React + Vite + Tailwind CSS)
├── mobile/                 # Mobile Application (React Native + Expo for Android & iOS)
└── docs/                   # Complete architectural, database & demo guides
    ├── architecture.md
    ├── database_schema.md
    ├── demo_presentation_guide.md
    ├── hotel_management_specialized_module.md
    ├── official_quotation_proposal.md
    └── client_requirement_questionnaire.md
```

---

## 👥 User Roles & Access

| Role | Web Portal | Mobile App | Main Purpose |
| :--- | :---: | :---: | :--- |
| **Superadmin (Trustee)** | ✅ | - | Trust-wide consolidated analytics, fees, branch oversight |
| **Branch Admin (Principal/Director)** | ✅ | - | Admissions, fees collection, timetable, staff management |
| **Teachers / Chef Instructors** | ✅ | ✅ | Attendance, homework, exam marks, practical lab sessions |
| **Parents (School)** | - | ✅ | Student attendance, fee payment, homework, live bus tracking |
| **Students (College)** | ✅ | ✅ | Semester syllabus, practical rosters, internship log, fees |
| **Bus Driver** | - | ✅ | One-tap live GPS bus route broadcast |
