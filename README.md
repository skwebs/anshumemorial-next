# 🏫 Anshu Memorial Academy — School Website & API

A full-stack school website built with the **latest** stack:

| Package | Version | Notes |
|---------|---------|-------|
| **Next.js** | 15.x | App Router, Turbopack dev |
| **React** | 19.x | Server & Client Components |
| **Prisma ORM** | 7.x | Rust-free, ESM, driver adapters |
| **@prisma/adapter-pg** | 7.x | PostgreSQL driver adapter for NeonDB |
| **Tailwind CSS** | 4.x | CSS-first `@theme{}`, no tailwind.config.js |
| **TypeScript** | 5.7+ | ES2023 target |
| **NeonDB** | — | Serverless PostgreSQL |
| **Vercel** | — | Deployment (bom1 = Mumbai region) |

---

## 🗂 Project Structure

```
anshu-memorial/
├── generated/
│   └── prisma/             ← Prisma 7 generates client here (not node_modules!)
│       └── client/
├── app/
│   ├── page.tsx            Homepage
│   ├── about/              About school
│   ├── admissions/         Online admission form
│   ├── results/            Student result checker
│   ├── gallery/            Photo gallery
│   ├── notices/            Notices & announcements
│   ├── contact/            Contact form + map
│   ├── faculty/            Teachers listing
│   └── api/                REST API routes
│       ├── auth/login/     POST — JWT login
│       ├── auth/me/        GET  — User profile with results & fees
│       ├── students/       CRUD — Student management
│       ├── results/        GET/POST — Results
│       ├── notices/        GET/POST — Notices
│       ├── gallery/        GET/POST — Gallery
│       ├── contact/        POST — Contact form
│       ├── admissions/     GET/POST — Admission enquiries
│       ├── teachers/       GET/POST — Faculty
│       └── events/         GET/POST — Events
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── prisma.ts           PrismaClient singleton with PrismaPg adapter
│   ├── auth.ts             JWT helpers for mobile API
│   └── utils.ts            Shared helpers & API response wrappers
├── prisma/
│   ├── schema.prisma       DB schema (Prisma 7: prisma-client generator)
│   └── seed.ts             Seed data (run with tsx)
├── prisma.config.ts        ← NEW in Prisma 7: datasource URL config
├── next.config.ts          Next.js 15 config
├── postcss.config.js       Tailwind 4: uses @tailwindcss/postcss
└── .env.example            Environment variable template
```

---

## 🔑 Prisma 7 Key Changes

| What | Before (v5/v6) | After (v7) |
|------|---------------|-----------|
| Generator | `prisma-client-js` | `prisma-client` |
| Output path | `node_modules/@prisma/client` | `./generated/prisma/client` |
| Import | `from "@prisma/client"` | `from "@/generated/prisma/client"` |
| DB connection | Built-in Rust engine | Driver adapter (`PrismaPg`) |
| Datasource URL | `schema.prisma` | `prisma.config.ts` |
| Env loading | Automatic | `import "dotenv/config"` required |
| Min Node.js | 16+ | **20.19+** |

---

## ⚡ Quick Start

### 1. Install

```bash
npm install
# postinstall automatically runs: prisma generate
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# From neon.tech → your project → Connection Details
DATABASE_URL="postgresql://USER:PASSWORD@ep-XXXX.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@ep-XXXX.neon.tech/neondb?sslmode=require"

# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-min-32-char-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. NeonDB Setup

1. [neon.tech](https://neon.tech) → your project → **Connection Details**
2. Copy **Pooled connection** (has `pgbouncer=true`) → `DATABASE_URL`
3. Copy **Direct connection** → `DIRECT_URL`
4. `DIRECT_URL` is used by `prisma.config.ts` for migrations only

### 4. Database Setup

```bash
npm run db:push      # push schema to NeonDB (uses prisma.config.ts)
npm run db:seed      # seed initial data
```

### 5. Dev Server

```bash
npm run dev          # Turbopack at http://localhost:3000
```

**Default Admin login:**
- Email: `admin@anshumemorial.in`  
- Password: `Admin@AMA2024`  
- ⚠️ Change password immediately after first login!

---

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial"
git remote add origin https://github.com/YOU/anshu-memorial.git
git push -u origin main

# 2. Import at vercel.com → New Project → select repo
# 3. Add environment variables in Vercel dashboard
# 4. Build command (auto from vercel.json): prisma generate && next build
```

**Vercel Environment Variables to add:**

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | NeonDB pooled URL |
| `DIRECT_URL` | NeonDB direct URL |
| `NEXTAUTH_SECRET` | Random 32-char string |
| `NEXTAUTH_URL` | `https://anshumemorial.in` |
| `JWT_SECRET` | Secret for mobile JWT |
| `NEXT_PUBLIC_SITE_URL` | `https://anshumemorial.in` |

---

## 📱 REST API for Expo Android App

Base URL: `https://anshumemorial.in/api`

All responses: `{ success: boolean, message: string, data: any }`

### Authentication

```javascript
// Login — returns JWT
POST /api/auth/login
{ "email": "parent@email.com", "password": "password" }

// All protected requests need:
Authorization: Bearer <jwt_token>

// Get full profile (student + results + fees)
GET /api/auth/me
```

### Public Endpoints

```javascript
GET /api/notices                            // all notices
GET /api/notices?category=EXAM             // GENERAL|EXAM|HOLIDAY|ADMISSION|RESULT|FEE|EVENT
GET /api/events?upcoming=true              // upcoming events
GET /api/teachers                           // faculty list
GET /api/gallery?category=Sports           // photo gallery

// Check result (no login needed!)
GET /api/results?admissionNo=AMA2024001&session=2024-25&examType=ANNUAL
// examType: ANNUAL | HALF_YEARLY | UNIT_TEST_1 | UNIT_TEST_2 | QUARTERLY

POST /api/admissions  { studentName, fatherName, motherName, dob, gender, applyingClass, phone, address }
POST /api/contact     { name, mobile, email, subject, message }
```

### Protected Endpoints

```javascript
GET  /api/students?search=Ram&session=2024-25   // ADMIN, TEACHER
POST /api/students                               // ADMIN
POST /api/results   [{studentId, subjectId, examType, session, marksObt, maxMarks}]
GET  /api/admissions?status=PENDING             // ADMIN
GET  /api/contact?status=UNREAD                 // ADMIN
POST /api/notices / /api/events / /api/gallery  // ADMIN
```

### Expo Example

```javascript
const BASE = "https://anshumemorial.in/api";

export const api = {
  login: (email, password) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()),

  getProfile: (token) =>
    fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()),

  checkResult: (admissionNo, session = "2024-25", examType = "ANNUAL") =>
    fetch(`${BASE}/results?admissionNo=${admissionNo}&session=${session}&examType=${examType}`)
      .then(r => r.json()),

  getNotices: (category) =>
    fetch(category ? `${BASE}/notices?category=${category}` : `${BASE}/notices`)
      .then(r => r.json()),
};
```

---

## 🔧 All Commands

```bash
npm run dev          # Turbopack dev server
npm run build        # Production build
npm run db:generate  # Generate Prisma client → ./generated/prisma/
npm run db:push      # Push schema to NeonDB
npm run db:migrate   # Create migration + apply
npm run db:seed      # Seed initial data (tsx)
npm run db:studio    # Prisma Studio visual browser
```
