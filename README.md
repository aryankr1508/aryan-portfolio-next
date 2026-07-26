# Aryan Portfolio (Next.js + Tailwind)

This project is a modern Next.js portfolio with a redesigned UI, rich motion, smooth scrolling, and interactive 3D sections.

Production: [aryankr1508.vercel.app](https://aryankr1508.vercel.app)

## Stack

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- Neon PostgreSQL + Drizzle ORM
- Better Auth with GitHub OAuth
- Vercel Blob
- Framer Motion
- Lenis (smooth scrolling)
- Three.js + React Three Fiber + Drei
- Spline (`@splinetool/react-spline`)
- Unicorn Studio embed integration

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3001`.

## Contact Form Email Setup (Google Apps Script + SMTP Fallback)

The contact API now tries providers in this order:
1. Google Apps Script webhook
2. SMTP fallback (if configured)

### Option A: Google Apps Script

1. Copy `.env.example` to `.env.local`.
2. Create a new Google Apps Script project: https://script.google.com
3. Paste the code from [`google-apps-script/contact-webhook.gs`](google-apps-script/contact-webhook.gs).
4. In Apps Script, set Script Properties:
   - `CONTACT_WEBHOOK_SECRET` = a long random string
   - `CONTACT_TO_EMAIL` = optional fallback inbox
5. Deploy as Web App:
   - `Deploy` -> `New deployment` -> `Web app`
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
   - Copy the generated `/exec` URL
6. Set these in `.env.local`:
   - `CONTACT_TO_EMAIL=aryankumar15082002@gmail.com`
   - `GOOGLE_APPS_SCRIPT_WEBHOOK_URL=<your_web_app_url>`
   - `GOOGLE_APPS_SCRIPT_SECRET=<same_secret_as_CONTACT_WEBHOOK_SECRET>`
7. Restart your Next.js server.

If Google returns login/401 pages, redeploy the web app and ensure access is `Anyone`.

### Option B: SMTP (fallback or primary)

Set these in `.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=<app_password_or_smtp_password>
SMTP_FROM=Portfolio Contact <you@gmail.com>
SMTP_SECURE=false
```

For Gmail, use an App Password (not your normal account password).

## 3D and Interactive Setup

Add these to `.env.local`:

```bash
NEXT_PUBLIC_SPLINE_SCENE_URL=
NEXT_PUBLIC_UNICORN_PROJECT_ID=
```

- `NEXT_PUBLIC_SPLINE_SCENE_URL`: your published `.splinecode` scene URL (used inside the existing About section visual card).
- `NEXT_PUBLIC_UNICORN_PROJECT_ID`: Unicorn Studio project id (used inside the existing Projects section).
- If either value is empty, the site falls back gracefully without broken placeholders.

## Build

```bash
npm test
npm run build
npm run start
```

## Private Content Administration

The owner-only admin application is available at `/admin`. It manages a private
draft and a separately published portfolio snapshot, including:

- profile details, site copy, navigation, social links, facts, and skills;
- companies, experience, nested company projects, personal projects, and
  freelance projects;
- education and internships;
- featured-project ordering;
- profile/project images and resume PDFs;
- revision history, restore-to-draft, publishing, and an audit log.

Public routes do not fetch content from the browser. They receive a cached,
validated snapshot from the server, so the existing animations and layout do not
gain a loading state. If the database is disabled or unavailable, the checked-in
snapshot in `lib/portfolio-data.ts` is used automatically.

### Local content-platform setup

Copy `.env.example` to `.env.local`, configure the private values, and then run:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Keep `PORTFOLIO_CONTENT_SOURCE=static` until the database is migrated and
seeded. Set it to `database` only after verifying the admin draft/publish flow.

Register a GitHub OAuth application with:

- Homepage URL: `http://localhost:3001` for a local-only app, or the production
  portfolio URL.
- Local callback: `http://localhost:3001/api/auth/callback/github`
- Production callback:
  `https://aryankr1508.vercel.app/api/auth/callback/github`

The application authorizes the immutable numeric GitHub ID in
`ADMIN_GITHUB_ID`; signing in with any other GitHub account does not grant admin
access.

Database and migration commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

See [`docs/admin-content-platform.md`](docs/admin-content-platform.md) for the
architecture, caching behavior, environment variables, and production rollout.

## Deployment

Vercel deploys the `main` branch to production and creates preview deployments for pull requests. Both GitHub Actions and Vercel run the repository verification gate:

```bash
npm run verify
```

The Vercel project is `aryankr2104/aryankr1508`. Contact delivery secrets and optional interactive-scene variables are configured in Vercel Project Settings; never commit their values.

## Project Structure

- `app/page.tsx`: cached server entry for the main portfolio
- `components/portfolio-page-client.tsx`: existing interactive portfolio UI
- `app/projects/[slug]/page.tsx`: dynamic project detail route
- `app/admin`: owner-only content administration
- `lib/content`: validation and cached content repository
- `lib/db`: Drizzle schema and Neon connection
- `lib/portfolio-data.ts`: typed checked-in content fallback and seed source
- `components/`: reusable UI components
- `public/images`: profile images
- `public/resume`: resume PDF
