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
- Vercel Blob store: `aryan-portfolio-media`
- Vercel Blob store ID: `store_jYu3bmcmdXXODw9x`
- Vercel Blob region/access: `sin1`, public
- Neon resource: `aryan-portfolio-content`
- Neon Vercel resource ID: `store_jZoeXPx3kLFaoeEN`
- Neon project/region: `long-night-57824262`, `sin1`
- Vercel Function region: `sin1` through `vercel.json`, colocated with Neon
- Framework: Next.js 16 App Router with React 19 and TypeScript
- Runtime: Node.js 24

Do not create a replacement Vercel project when this exact project exists. Reconnect local checkouts to it.

## Product architecture

- `app/page.tsx`: cached server entry for the public portfolio
- `components/portfolio-page-client.tsx`: main interactive portfolio experience and scene selection
- `app/projects/[slug]/page.tsx`: dynamic project case studies
- `app/admin`: owner-only content administration, draft/publish, media, revisions, and audit history
- `app/admin/(protected)/loading.tsx`: instant admin route skeleton while dynamic data streams
- `components/admin/admin-navigation.tsx`: active/pending-aware admin navigation
- `lib/content/repository.ts`: cached published-content reads and admin content mutations
- `lib/content/schema.ts`: full portfolio snapshot validation
- `lib/db/schema.ts`: Neon PostgreSQL content, revision, media, and audit tables
- `lib/portfolio-data.ts`: typed static fallback and initial database seed content
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
| `NEXT_PUBLIC_SPLINE_SCENE_URL` | No | Optional general Spline fallback scene. |
| `DATABASE_URL` | Yes | Neon PostgreSQL connection used by the admin platform and database content source. |
| `PORTFOLIO_CONTENT_SOURCE` | No | `static` for guarded rollout/fallback; `database` for cached published content. |
| `BETTER_AUTH_SECRET` | Yes | Encrypts and signs Better Auth state/session cookies. |
| `BETTER_AUTH_URL` | No | Canonical application origin used by Better Auth. |
| `GITHUB_CLIENT_ID` | Private | GitHub OAuth application client ID. |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth application client secret. |
| `ADMIN_GITHUB_ID` | Private | Immutable numeric GitHub account ID allowlisted for admin access. |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob token for admin-managed images and resume PDFs. |

Gmail SMTP is configured in Vercel Production. Store and rotate its App Password only through Vercel Project Settings and Aryan's password manager under `Portfolio / contact delivery`.

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
- `npm run verify` runs ESLint with zero warnings, content tests, then a full Next.js production build.
- A migration or release is complete only when GitHub CI, the Vercel check, the production alias, primary routes, and the contact API validation path pass.

Useful commands:

```bash
npm run dev
npm run lint
npm test
npm run build
npm run verify
npm run start
npm run db:migrate
npm run db:seed
npm run db:verify
```

Production smoke checks should cover `/`, `/projects/syncdev`, `/MNC`, `/prep`, static images/resume, and an invalid `/api/contact` request. Do not send a real contact message during automated smoke testing.

## Change safety

- Preserve unrelated local changes and inspect `git status` before staging.
- Use an `Aryan/<description>` branch, stage explicit files, run `npm run verify`, push, and open a draft pull request.
- Keep portfolio claims synchronized with the actual sister repositories and live URLs.
- Do not remove Tailwind, PostCSS, Three.js, Spline, Lenis, or React Three Fiber based only on a basic dependency scan; they are used by configuration or dynamic UI paths.
- Do not expose server mail secrets through `NEXT_PUBLIC_` variables.
- Do not enable `PORTFOLIO_CONTENT_SOURCE=database` before migrations, seeding, and draft/publish smoke tests pass.
- The production GitHub OAuth callback is `https://aryankr1508.vercel.app/api/auth/callback/github`.
- Public content mutations must preserve full-snapshot validation, immutable revisions, audit events, and cache-tag invalidation on publish.
- Do not delete or replace infrastructure without explicit authorization and an exact project-ID check.
- Update this file when production URLs, project IDs, runtime versions, or environment requirements change.

## Current known caveats

- Contact delivery uses Gmail SMTP in Vercel Production. Preview and Development intentionally do not have the complete SMTP configuration, so they cannot send mail.
- Interactive scenes intentionally fall back when their public configuration variables are empty.
- The public portfolio has a checked-in content fallback. Database errors must not turn into a public outage.
- The `Aryan/admin-content-platform` preview branch overrides `PORTFOLIO_CONTENT_SOURCE=database`; Production remains `static` until explicit promotion approval.
- Admin authentication requires a separately registered GitHub OAuth application; Vercel, Neon, and Blob provisioning do not create it.
- Heavy 3D and glass effects require regression testing on mobile and reduced-motion settings when animation code changes.
