# Web Admin Portal (`web/`)

Built with **React (Vite) + Tailwind CSS + Lucide Icons + Shadcn UI**.

## User Personas Served
1. **Superadmin (Trustees / Management):** Consolidated Trust-wide overview with 1-click branch toggle.
2. **School Admin (Principal / Headmaster):** School admissions, fee receipts, student records, bus routes.
3. **College Admin (Director / HOD):** College admissions, kitchen lab scheduling, industrial training placements.
4. **Teachers & Faculty:** Attendance marker, homework publisher, grade entry.

## Folder Structure
```
web/
├── src/
│   ├── components/         # Reusable UI cards, tables, modal dialogs, charts
│   ├── pages/              # Superadmin, School, College, and Teacher dashboards
│   ├── context/            # Auth and active branch context
│   ├── services/           # Axios / Fetch client for API
│   ├── App.tsx             # Route definitions
│   └── main.tsx            # App bootstrapping
├── package.json
└── vite.config.ts
```
