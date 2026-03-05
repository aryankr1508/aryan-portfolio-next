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

## Contact Form Email Setup (Gmail)

1. Copy `.env.example` to `.env.local`.
2. Set `SMTP_USER` to your Gmail address.
3. Set `SMTP_PASS` to a Gmail App Password (not your normal Gmail password):
   - Open Google Account Security: https://myaccount.google.com/security
   - Turn on 2-Step Verification.
   - Open App Passwords: https://myaccount.google.com/apppasswords
   - Create a password for "Mail" and use that 16-character value as `SMTP_PASS`.
4. Keep `CONTACT_TO_EMAIL=aryankumar15082002@gmail.com` (or change if needed).

Without SMTP credentials, the form UI will work but email sending will fail with a config error.

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
