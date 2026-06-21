# Aliore Café ☕

> A full-stack luxury restaurant & café website — built solo to showcase frontend, 3D, i18n, and full-stack engineering.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=three.js)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**Live demo:** [your-live-url-here]
**By:** Aliore — full-stack developer & AI specialist

---

## ✨ Highlights

- **3D hero** — a procedural coffee cup scene built entirely in code (React Three Fiber, no external 3D model files)
- **Interactive floor map** — SVG restaurant layout with 4 zones and real-time table status, color-coded
- **Reservation flow** — 4-step booking experience with seat-level pricing for premium zones
- **Online ordering** — full cart, checkout, delivery/pickup selection, and live order tracking UI
- **5 languages** — English, Français, Deutsch, 中文, فارسی, with complete right-to-left layout support for Persian
- **Admin dashboard** — live analytics charts, table management, menu/blog/gallery CMS panels
- **Authentication** — NextAuth v5 with credentials login, Google OAuth ready
- **Dark & light mode** — fully themed across every page

## 🛠 Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 3D | Three.js / React Three Fiber |
| Animation | Framer Motion |
| Database | SQLite (dev) — swappable to PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth v5 |
| i18n | next-intl |
| Charts | Recharts |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/aliore-cafe.git
cd aliore-cafe
npm install
```

### Environment setup

Copy the example env file and fill in your secret:

```bash
cp .env.example .env
```

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database setup

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Run it

```bash
npm run dev
```

Visit **http://localhost:3000** — it redirects to `/en` automatically.

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@aliore.cafe` | `admin123456` |
| Customer | `guest@aliore.cafe` | `user123456` |

## 📁 Project Structure

```
aliore-cafe/
├── prisma/
│   ├── schema.prisma       # Database schema (SQLite — no enums)
│   └── seed.ts             # Seed data: menu, tables, users, blog, testimonials
├── messages/                # i18n translation files (en, fr, de, zh, fa)
├── src/
│   ├── app/
│   │   ├── [locale]/        # All locale-aware pages
│   │   │   ├── page.tsx           # Home
│   │   │   ├── menu/              # Menu with category filters
│   │   │   ├── reservation/       # 4-step reservation + SVG floor map
│   │   │   ├── gallery/           # Masonry gallery + lightbox
│   │   │   ├── blog/              # Blog listing + [slug] articles
│   │   │   ├── about/             # Story, timeline, team
│   │   │   ├── contact/           # Contact form
│   │   │   ├── auth/              # Login / register
│   │   │   ├── dashboard/         # Customer dashboard
│   │   │   ├── admin/             # Admin panel with analytics
│   │   │   └── order/checkout/    # Online ordering checkout
│   │   └── api/              # API routes (auth, menu, reservations, orders...)
│   ├── components/
│   │   ├── 3d/                # Three.js scenes (HeroCanvas)
│   │   ├── sections/           # Homepage sections
│   │   ├── reservation/        # SVG floor map
│   │   ├── layout/              # Navbar, Footer
│   │   ├── providers/           # Theme, Session, Cart context
│   │   └── ui/                  # Reusable UI primitives
│   ├── lib/
│   │   ├── auth/                # NextAuth config
│   │   ├── db/                   # Prisma client
│   │   ├── i18n/                 # Locale config
│   │   └── hooks/                # Custom React hooks
│   └── i18n/request.ts       # next-intl server config
└── next.config.js
```

## 🌐 Deployment

### Vercel

1. Push to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add environment variables (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`)
4. This project uses PostgreSQL in production. Set `DATABASE_URL` to a hosted Postgres connection string ([Neon](https://neon.tech) or [Supabase](https://supabase.com) both have free tiers)
5. Deploy

### Self-hosted / VPS

```bash
npm run build
npm start
```

See `nginx.conf` and `ecosystem.config.js` in the repo for a reference reverse-proxy + PM2 setup.

## 📜 License

MIT — feel free to use, modify, and showcase this in your own portfolio.

---

> Built with Next.js, Three.js, and a lot of coffee. ☕
