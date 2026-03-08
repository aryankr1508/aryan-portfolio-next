# Aryan Portfolio (Next.js + Tailwind)

This project is a modern Next.js portfolio with a redesigned UI, rich motion, smooth scrolling, and interactive 3D sections.

## Stack

- Next.js (App Router)
- Tailwind CSS
- TypeScript
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

Then open `http://localhost:3000`.

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
npm run build
npm run start
```

## Project Structure

- `app/page.tsx`: main portfolio page
- `app/projects/[slug]/page.tsx`: dynamic project detail route
- `lib/portfolio-data.ts`: portfolio content rendered dynamically
- `components/`: reusable UI components
- `public/images`: profile images
- `public/resume`: resume PDF
