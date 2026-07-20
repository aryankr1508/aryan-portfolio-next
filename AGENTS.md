# Portfolio project context and operations runbook

Read this file before changing the portfolio, its content, deployment, CI/CD, or credentials.

## Security

Never commit passwords, API tokens, mail credentials, webhook secrets, `.env` files, or copied dashboard credentials. This document records secret names and storage locations, never secret values. Only variables prefixed with `NEXT_PUBLIC_` may be exposed to the browser.

## Ownership and canonical resources

- Owner/GitHub account: `aryankr1508`
- Repository: `https://github.com/aryankr1508/aryan-portfolio-next`
- Production branch: `main`
- Production application: `https://aryankr1508.vercel.app`
- Vercel team/scope: `aryankr2104`
- Vercel organization ID: `team_IK6kA1dRODHNNYq1gX6v1Xtv`
- Vercel project: `aryankr1508`
- Vercel project ID: `prj_bV0gEB1hsV7mbEvN7Ip9nyWuh8Zq`
- Framework: Next.js 16 App Router with React 19 and TypeScript
- Runtime: Node.js 24

Do not create a replacement Vercel project when this exact project exists. Reconnect local checkouts to it.

## Product architecture

- `app/page.tsx`: main portfolio experience and interactive scene selection
- `app/projects/[slug]/page.tsx`: dynamic project case studies
- `lib/portfolio-data.ts`: canonical portfolio, experience, freelance, and project content
- `components/`: reusable UI, motion, scrolling, 3D, and project components
- `app/api/contact/route.ts`: Node.js contact endpoint using a Google Apps Script webhook with SMTP fallback
- `google-apps-script/contact-webhook.gs`: optional Google Apps Script mail relay
- `public/images` and `public/resume`: deployed static assets

The contact API validates input, tries the Google webhook first, then SMTP, and returns a controlled configuration error when neither provider is configured.

## Environment inventory

| Variable | Secret | Purpose |
| --- | --- | --- |
| `CONTACT_TO_EMAIL` | No | Destination inbox; defaults to Aryan's portfolio email. |
| `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` | Treat as private | Deployed Apps Script `/exec` endpoint. |
| `GOOGLE_APPS_SCRIPT_SECRET` | Yes | Shared secret matching Apps Script property `CONTACT_WEBHOOK_SECRET`. |
| `SMTP_HOST` | No | SMTP fallback host. |
| `SMTP_PORT` | No | SMTP fallback port. |
| `SMTP_USER` | Private | SMTP account username. |
| `SMTP_PASS` | Yes | SMTP/App Password; never use a normal Google password. |
| `SMTP_FROM` | No | Contact-message sender identity. |
| `SMTP_SECURE` | No | `true` for implicit TLS, normally port 465. |
| `NEXT_PUBLIC_HERO_SPLINE_SCENE_URL` | No | Optional hero Spline scene. |
| `NEXT_PUBLIC_HERO_INTERACTIVE_SPLINE_SCENE_URL` | No | Optional interactive hero Spline scene. |
| `NEXT_PUBLIC_SPLINE_SCENE_URL` | No | Optional general Spline fallback scene. |
| `NEXT_PUBLIC_UNICORN_PROJECT_ID` | No | Optional Unicorn Studio project identifier. |

The mail-provider values are not currently present in the legacy deployment and must be supplied through Vercel Project Settings before expecting live contact delivery. Store them in Aryan's password manager under `Portfolio / contact delivery`.

## New-laptop bootstrap

```bash
git clone https://github.com/aryankr1508/aryan-portfolio-next.git
cd aryan-portfolio-next
npm ci
npm run verify
npm run dev
```

The development server runs at `http://localhost:3001`.

Reconnect Vercel when infrastructure access is needed:

```bash
npx vercel login
npx vercel link --scope aryankr2104 --project aryankr1508
npx vercel whoami
```

The generated `.vercel/` directory and `.env.local` are ignored and must never be committed. Avoid pulling production secrets locally unless required for a specific test, and remove temporary copies immediately.

Authenticate GitHub tooling before publishing:

```bash
gh auth login -h github.com
gh auth status
```

## CI/CD and verification

- Vercel watches `main`, deploys it to production, and creates pull-request previews.
- GitHub Actions runs `npm ci` and `npm run verify` on pushes and pull requests targeting `main`.
- `npm run verify` runs ESLint with zero warnings, then a full Next.js production build.
- A migration or release is complete only when GitHub CI, the Vercel check, the production alias, primary routes, and the contact API validation path pass.

Useful commands:

```bash
npm run dev
npm run lint
npm run build
npm run verify
npm run start
```

Production smoke checks should cover `/`, `/projects/syncdev`, `/MNC`, `/prep`, static images/resume, and an invalid `/api/contact` request. Do not send a real contact message during automated smoke testing.

## Change safety

- Preserve unrelated local changes and inspect `git status` before staging.
- Use an `agent/<description>` branch, stage explicit files, run `npm run verify`, push, and open a draft pull request.
- Keep portfolio claims synchronized with the actual sister repositories and live URLs.
- Do not remove Tailwind, PostCSS, Three.js, Spline, Lenis, or React Three Fiber based only on a basic dependency scan; they are used by configuration or dynamic UI paths.
- Do not expose server mail secrets through `NEXT_PUBLIC_` variables.
- Do not delete or replace infrastructure without explicit authorization and an exact project-ID check.
- Update this file when production URLs, project IDs, runtime versions, or environment requirements change.

## Current known caveats

- Contact delivery remains unavailable until a Google webhook or SMTP fallback is configured in Vercel.
- Interactive scenes intentionally fall back when their public configuration variables are empty.
- Heavy 3D and glass effects require regression testing on mobile and reduced-motion settings when animation code changes.
