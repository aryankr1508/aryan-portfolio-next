# Admin content platform architecture

## Objective

Add a private admin application for managing the public portfolio without changing
the existing public experience or adding a client-side content-loading step.

The public site must remain fast and available even when the database or admin
services are temporarily unavailable.

## Decisions

### PostgreSQL with a typed JSONB content document

Use managed PostgreSQL (Neon through the existing Vercel project) rather than
MongoDB.

The provisioned preview resource is `aryan-portfolio-content`
(`store_jZoeXPx3kLFaoeEN`, Neon project `long-night-57824262`) in `sin1`.
Vercel Functions also execute in `sin1`, avoiding a cross-continent round trip
for every authenticated admin read and write. Static public output remains
served globally from Vercel's CDN.

The portfolio is read-heavy, edited by one owner, and published atomically. A
single typed JSONB document is a better fit than dozens of runtime joins:

- `draft_content` contains the current admin working copy.
- `published_content` contains the public snapshot.
- publishing copies the validated draft to the published snapshot in one atomic
  database batch;
- immutable revision rows make rollback and auditing straightforward;
- PostgreSQL still provides transactions, constraints, timestamps, and reliable
  backups.

Separate relational tables hold media metadata and audit events because those
records have their own lifecycle and query patterns.

### Public delivery

The existing portfolio remains the presentation layer.

- A server component loads the published snapshot.
- The current interactive page becomes a client presentation component receiving
  the snapshot as props.
- The database query is cached with a long-lived Next.js data-cache entry.
- Admin publication invalidates the content tag immediately.
- No public browser request is added, so there is no loading spinner or layout
  shift.
- The checked-in static content remains a safe fallback and rollback source.

`PORTFOLIO_CONTENT_SOURCE=database` enables database-backed public content.
Without that flag, or when a published database document is unavailable, the
site renders the checked-in snapshot.

### Authentication and authorization

Use Better Auth with GitHub OAuth in stateless encrypted-cookie mode.

- The GitHub profile's immutable numeric ID is mapped to a non-deliverable
  identity.
- `ADMIN_GITHUB_ID` is the only authorized identity.
- `/admin` receives an optimistic proxy check for fast redirects.
- Every protected page, server action, upload route, and data-access method also
  performs a full authorization check.
- No admin password is stored by this application.

The production OAuth callback is:

`https://aryankr1508.vercel.app/api/auth/callback/github`

### Media and resume files

Use a public Vercel Blob store for portfolio images and downloadable resumes.

- Production store: `aryan-portfolio-media` (`store_jYu3bmcmdXXODw9x`) in
  `sin1`.
- Upload tokens are issued only after a verified admin session.
- File type and size are checked before a token is issued.
- Blob paths are versioned instead of overwritten, avoiding stale CDN objects.
- The selected media URL is stored in the draft portfolio document.
- Existing files under `public/` remain valid and provide rollback assets.

### Admin experience

The admin application lives under `/admin` and has independent styling so public
portfolio CSS and interaction code remain untouched.

Masters:

- Dashboard and publish status
- Profile, navigation, social links, highlights, and facts
- Skills
- Companies, experience, and nested company projects
- Personal and freelance projects
- Education and internships
- Media library, profile/project images, and resume
- Revision history and audit log

The admin shell prefetches its primary routes, exposes active and pending
navigation states, and streams route-level skeletons during uncached work.
Editors show one content area at a time, collapse large record collections, and
keep unsaved/saved state visible while the owner works.

Editors operate on the draft document. Saving never changes the public site.
Publishing validates the full document and atomically promotes it.

Experience entries, nested company projects, detailed projects, freelance
cards, education entries, and internships have an `isActive` master switch.
Missing flags default to active for backward compatibility. Inactive records
remain available in the private draft, immutable revisions, and audit history,
while `lib/content/visibility.ts` removes them from the public snapshot,
Featured Work order, and direct project routes.

## Data model

### `portfolio_documents`

One row with ID `main`:

- draft and published JSONB snapshots
- draft and published version numbers
- timestamps and actor identifiers

### `portfolio_revisions`

Immutable content snapshots:

- document version
- `draft` or `publish` event
- full validated JSONB content
- actor and timestamp

### `portfolio_media`

Uploaded file metadata:

- Blob URL/path
- original filename
- media kind
- content type and byte size
- alt text
- actor and timestamp

### `portfolio_audit_log`

Append-only security and mutation history:

- actor
- action
- entity
- structured metadata
- timestamp

## Cache behavior

- Cache key: `portfolio:published:v3`
- Cache tag: `portfolio:published`
- Normal reads reuse the persistent server cache across requests and deployments.
- Publish calls `updateTag("portfolio:published")` for immediate
  read-your-writes behavior. Restoring a revision changes only the private draft.
- Public assets use Vercel Blob's CDN.
- Redis is intentionally not required. It would duplicate the Next/Vercel cache
  for a single-document workload and add another network dependency.

## Rollout

1. Deploy the code with the static source flag. Public behavior is unchanged.
2. Provision Neon and Vercel Blob and add production secrets.
3. Apply committed database migrations.
4. Seed draft and published snapshots from the checked-in portfolio data.
5. Configure the GitHub OAuth application and verify the allowlisted admin.
6. Test CRUD, media upload, publish, cache invalidation, and restore-to-draft on preview.
7. Enable `PORTFOLIO_CONTENT_SOURCE=database` in production.
8. Smoke-test public routes and compare rendered content before and after the
   switch.

## Required environment variables

- `DATABASE_URL`
- `PORTFOLIO_CONTENT_SOURCE`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `ADMIN_GITHUB_ID`
- `BLOB_READ_WRITE_TOKEN`

Only `PORTFOLIO_CONTENT_SOURCE` is non-secret. None of these variables may be
prefixed with `NEXT_PUBLIC_`.
