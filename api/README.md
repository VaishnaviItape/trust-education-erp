# Backend API Service (`api/`)

Built with **Node.js, Express, TypeScript, and Prisma ORM** connected to **PostgreSQL**.

## Architecture & Responsibilities
- Multi-tenant data isolation by `trust_id` and `branch_id`.
- JWT-based authentication with Role-Based Access Control (`SUPERADMIN`, `BRANCH_ADMIN`, `TEACHER`, `PARENT`, `STUDENT`, `DRIVER`).
- Cloud file upload integration (Supabase Storage / AWS S3) for KYC documents and gallery photos.
- Realtime WebSockets for bus tracking and instant notifications.

## Folder Structure
```
api/
├── prisma/
│   └── schema.prisma       # Database models and relations
├── src/
│   ├── controllers/        # Request handlers (admission, fees, attendance, bus)
│   ├── middlewares/        # Auth, role-validation, error-handling
│   ├── routes/             # API routes
│   ├── services/           # Business logic & payment receipt generation
│   └── index.ts            # Application entrypoint
├── package.json
└── tsconfig.json
```
