# 팀사랑꾼들 Portfolio Monorepo

Original editorial portfolio implementation for **팀사랑꾼들** with:
- `frontend/`: Next.js 14 + TypeScript + Tailwind + Framer Motion
- `backend/`: NestJS + Prisma + PostgreSQL

## Quick start in GitHub Codespaces

```bash
# 1) Start PostgreSQL
cd /workspaces/<your-repo>
docker compose up -d

# 2) Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run start:dev

# 3) Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:4000/api`

## Admin login
Use the admin credentials from `backend/.env`:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

