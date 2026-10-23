# System Architecture & Technical Blueprint

## 1. High-Level Architecture

The Trust Education ERP is a **multi-branch, multi-tenant platform** designed to cater to an educational Trust that oversees two distinct educational branches:
1. **School** (K-12 / Primary & High School)
2. **College of Hotel Management & Catering Technology**

```
+-----------------------------------------------------------------------------------+
|                                  TRUST LEVEL                                      |
|             Superadmin Dashboard (Trustees, President, Managing Director)          |
+----------------------------------------+------------------------------------------+
                                         |
               +-------------------------+-------------------------+
               |                                                   |
               v                                                   v
+-------------------------------+               +-----------------------------------+
|      BRANCH 1: SCHOOL         |               | BRANCH 2: HOTEL MGMT COLLEGE      |
|  - Principal & Accountant Web |               |  - College Director & Faculty Web |
|  - Teachers (Web & Mobile)    |               |  - Professors & Chefs (Web/Mobile)|
|  - Parents App (Primary User) |               |  - Students App (Self Login)      |
+-------------------------------+               +-----------------------------------+
```

---

## 2. Where & How to Store Data (Beginner-Friendly Guide)

When building an ERP for schools and colleges, you have three types of data:
1. **Relational / Structured Data** (Students, Parents, Fees, Invoices, Attendance, Marks)
2. **Documents & Files** (Aadhar cards, Transfer certificates, homework PDFs, event photos)
3. **Live GPS Data** (Bus tracking coordinates)

Here is exactly where to store each one, and why:

### A. Structured Data -> PostgreSQL Database (Recommended: Supabase or Neon Cloud)
* **What is it?** PostgreSQL is the world's most trusted relational database. It ensures that fee payments, student balances, and records never get corrupted or duplicated.
* **Why Supabase for Beginners?**
  * **Visual Table Editor:** It provides a clean dashboard that looks just like Microsoft Excel or Google Sheets. You can click on tables, view rows, edit data, and add columns with zero SQL knowledge needed during initial development.
  * **Free Tier:** Comes with **500 MB** of free storage. For 300 new admissions a year, 500 MB will easily hold **10 to 15 years** of student, attendance, and fee history!
  * **Integrated Auth:** Built-in email/password and phone OTP authentication with role-based access.
  * **Realtime Support:** Built-in WebSockets for instant notification and bus tracking.

### B. Files, Photos & Documents -> Cloud Storage Bucket (Supabase Storage or AWS S3)
* **Rule of Thumb:** **Never store images or PDF documents directly inside database tables.** Storing images in a database makes it slow, bloated, and expensive to back up.
* **How it works:**
  1. The user (or admin) uploads an Aadhar card PDF or an Annual Day photo from the web/mobile app.
  2. The file is uploaded directly to a **Supabase Storage Bucket** (e.g., `trust-documents/` or `trust-gallery/`).
  3. Supabase gives back a secure URL: `https://xyz.supabase.co/storage/v1/object/public/documents/student_101.pdf`.
  4. Only this text URL string is stored in your PostgreSQL `student_documents` table.

### C. Live School Bus Tracking -> Realtime Channel
* **How it works:**
  1. The bus driver's mobile app opens a GPS session: "Route #1 - Morning Pick-up".
  2. The phone transmits current latitude & longitude every 5 to 10 seconds.
  3. The server broadcasts this coordinate to a lightweight Realtime channel (Supabase Realtime or Socket.io).
  4. Parents registered to Route #1 see the school bus icon move smoothly across Google Maps or OpenStreetMap in real time.

---

## 3. Technology Stack Selection

| Component | Recommended Technology | Why this choice is best for beginners |
| :--- | :--- | :--- |
| **Database** | PostgreSQL via Supabase | Visual table editor, zero server maintenance, free cloud hosting. |
| **Backend API** | Node.js + Express + Prisma ORM | JavaScript/TypeScript everywhere; Prisma generates type-safe database queries automatically without raw SQL. |
| **Web Admin Portal** | React.js (Vite) + Tailwind CSS + Lucide Icons | Fast loading, modern aesthetic dashboard, large community, pre-built responsive components. |
| **Mobile App** | React Native with **Expo** | Write **one code** that runs on both Android and iPhone; instant live demo on physical phones using the free **Expo Go** app. |
| **Hosting (Demo / Free)** | Vercel (Web), Render/Railway (API), Supabase (DB & Storage) | All offer generous free tiers perfect for client demos and small-scale initial production. |

---

## 4. Role-Based Access Control (RBAC)

1. **Superadmin (Trust Level):**
   * Accessible only via Web.
   * Central dashboard displaying aggregated numbers: Total Trust Revenue, School vs. College enrollment, pending fees across both institutions, staff strength.
   * Can switch between School and College views with a single click.

2. **Branch Admin (School Principal / College Director):**
   * Accessible via Web.
   * Limited strictly to their branch data. A School Admin cannot see College student records or financial ledgers, and vice-versa.
   * Handles admissions, fee schedules, class allocations, timetable, and exams.

3. **Faculty / Teacher:**
   * Accessible via Web and Mobile App.
   * School teachers mark daily attendance, assign homework, upload study notes, and enter exam marks.
   * College professors schedule kitchen practicals, mark attendance for theoretical & culinary labs, and review internship reports.

4. **Parents (For School):**
   * Accessible primarily via Mobile App.
   * View student profile, attendance percentage, fee payment history & upcoming installment dues.
   * Download homework assignments, digital report cards, view school photo albums, and track the school bus in real time.

5. **Students (For College of Hotel Management):**
   * Accessible via Mobile App & Web.
   * Adult college students have their own login (instead of parents).
   * Check semester schedule, practical kitchen rosters, exam grades, fee status, and industrial training (internship) logs.

6. **Bus Driver / Transport Attendant:**
   * Accessible via Mobile App.
   * Simple one-button interface: "Start Trip" / "End Trip".
   * Runs in the background sending GPS coordinates to parents on the route.
