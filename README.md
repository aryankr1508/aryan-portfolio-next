# Aryan Portfolio (Next.js + Tailwind)

This project is a full migration of the original static portfolio into a dynamic, responsive Next.js website with Tailwind CSS and fluid motion.

## Stack

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- Framer Motion

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Contact Form Email Setup (Gmail)

1. Copy `.env.example` to `.env.local`.
2. Set `SMTP_PASS` to a Gmail App Password for `aryankumar15082002@gmail.com`.
3. Keep `CONTACT_TO_EMAIL=aryankumar15082002@gmail.com` (or change if needed).

Without SMTP credentials, the form UI will work but email sending will fail with a config error.

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
