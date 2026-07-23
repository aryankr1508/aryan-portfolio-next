import { PrepCategory } from "./prep-types";
import { q } from "./prep-types";

const honestyNote =
  "Keep only details you personally implemented or can defend. Replace generic wording with your exact service names, numbers, and result before using this answer.";

export const experienceCategory: PrepCategory = {
  name: "Experience",
  color: "#2dd4bf",
  bg: "#0b201d",
  icon: "🎯",
  description: "Resume-led questions and ready-to-personalize project stories",
  sections: [
    {
      label: "🤖 Emerge AI & Drive",
      questions: [
        q(
          "Explain your Emerge AI architecture.",
          "Emerge AI is best explained as an enterprise AI chat platform with a Next.js/React client, backend APIs, a drive/file capability, external connectors, and an AI retrieval/tool layer. Authentication and workspace/resource authorization guard every path before data reaches the model.",
          "Emerge AI is an enterprise AI platform. I worked on full-stack flows around drive-like file management and connector integration. The client called backend APIs for files, folders, favorites, recycle-bin actions, and connector configuration. The backend enforced user, cloud or workspace, connector, and resource permissions. File metadata and content providers sat behind that layer, and the AI retrieval or tool flow received only authorized context. The most important design principle was that the model never became the authorization boundary.",
          {
            details: "A useful whiteboard flow is: client → API/auth context → file or connector service → metadata store/external provider → permission-filtered retrieval → AI. Add audit logs, background indexing, token references, timeouts, and failure handling when the interviewer goes deeper.",
            trap: honestyNote,
          },
        ),
        q(
          "How did you implement cloud-scoped OAuth?",
          "OAuth handles delegated provider access, while cloud/workspace scope is an application authorization boundary. The callback must bind provider state to the authenticated user and intended cloud, validate state, exchange the code server-side, and store only an encrypted token reference plus scope/expiry metadata.",
          "When a user connected a provider, I tied the OAuth state to the current user and cloud/workspace context. After validating state in the callback, the backend exchanged the code, stored protected token material and metadata, and associated the connector instance with that cloud. Every later tool call checked membership, connector ownership, granted provider scopes, and resource permission. If refresh failed, the connector moved to a reauthorization-required state.",
          {
            trap: `Never say the cloud ID from the browser was trusted on its own. The backend must derive or verify membership. ${honestyNote}`,
          },
        ),
        q(
          "Explain the Drive-like file system you built.",
          "The system separates metadata such as hierarchy, ownership, favorites, deletion state, and permissions from file bytes or external-provider content. Operations include listing, folder creation, move, rename, soft delete, restore, favorite, upload, and permission-aware retrieval.",
          "I worked on APIs and frontend workflows for files and folders inside a cloud or workspace. Folder listing used parent and cloud context; favorites were user-specific mappings; recycle bin used soft-delete metadata; restore handled the original parent and naming conflicts. The backend remained the source of truth and enforced permission checks for every operation, including AI retrieval.",
          {
            details: "For scale, discuss an index such as `(cloud_id, parent_id, deleted, name)`, object storage for bytes, async search indexing, audit events, cursor pagination, and pre-signed uploads.",
            trap: honestyNote,
          },
        ),
        q(
          "How did you use optimistic updates in the UI?",
          "An optimistic update changes the UI before the server confirms, stores enough previous state to roll back, then reconciles with the server result. It suits reversible low-risk actions such as favorite/unfavorite, not financial or permission-critical changes.",
          "For a safe action such as favorite, I updated the cached item immediately so the UI felt instant, sent the mutation, then either replaced the optimistic value with the server response or rolled back and showed an error. I cancelled or accounted for in-flight reads and invalidated the exact affected query so an older response could not overwrite the optimistic state.",
          {
            trap: honestyNote,
          },
        ),
        q(
          "Explain the authentication and permission flow.",
          "Authentication establishes the user from a verified token or session. Authorization then checks workspace membership, role/permission, connector ownership, and the requested file or folder. Frontend visibility improves UX but never replaces server enforcement.",
          "A request first passed token verification and created a trusted user context. The API then checked cloud/workspace membership and action-level permission. For connector or file operations it also verified that the resource belonged to that scope and that provider scopes allowed the action. The same checks protected retrieval before any context reached the AI.",
          {
            trap: honestyNote,
          },
        ),
      ],
    },
    {
      label: "⚡ Backend reliability & performance",
      questions: [
        q(
          "Explain how you used Redis.",
          "A strong project answer uses Redis as a cache, not as a vague speed tool. A cache-aside flow checks Redis, loads the database on miss, writes with TTL, and returns. Hot-key expiry may need locking or jitter to prevent a thundering herd.",
          "I used Redis for frequently read permission or reference data so requests did not repeatedly hit the database. The database remained the source of truth. On a miss, the service loaded and cached the value with a TTL. For a hot miss, a distributed lock allowed one request to repopulate while others retried briefly. I monitored hit rate and latency, and invalidated keys when the underlying permission changed.",
          {
            trap: honestyNote,
          },
        ),
        q(
          "How did you handle cache invalidation?",
          "Invalidation must follow every authoritative write that can make cached data stale. Common choices are delete-on-write, update-on-write, short TTL, or versioned keys. Deletion is often simpler because the next read rebuilds from the source of truth.",
          "For permission changes, the database transaction updated the source of truth and the relevant user or workspace cache keys were evicted. The next read repopulated them. TTL was a safety net, not the primary consistency mechanism. For cross-service writes I would publish an invalidation event through an outbox.",
          {
            trap: honestyNote,
          },
        ),
        q(
          "How did you optimize API performance?",
          "A credible answer starts with measurement: endpoint latency percentiles, trace breakdown, generated SQL, row counts, query plan, dependency timings, payload size, and pool saturation. Only then choose indexes, query changes, batching, caching, async work, or pagination.",
          "I first reproduced the slow path and split the latency between application, database, and external calls. I removed unnecessary data loading, fixed query or index issues, and avoided repeated round trips. For stable read-heavy data I added caching, and for non-critical side effects I moved work off the request path. I compared before-and-after latency and watched error rate and resource use after release.",
          {
            trap: "Add your real endpoint, measured before/after result, and exact query/index. Do not invent a percentage.",
          },
        ),
        q(
          "How do you handle database transactions?",
          "A transaction should match one business invariant and remain short. In Spring that usually means `@Transactional` on a service use case. Remote calls should not sit inside a database transaction unless the locking and failure cost is fully understood.",
          "I put the transaction around the service operation that changed related database state. I validated first, loaded the required rows, applied the domain transition, and let commit make it atomic. For concurrent edits I used a version check or atomic update. Cross-service actions used events or a saga rather than trying to stretch one database transaction over the network.",
          {
            trap: honestyNote,
          },
        ),
        q(
          "How did you implement webhooks safely?",
          "A webhook endpoint must verify provider authenticity using the raw request body and signature/timestamp, reject replay outside a time window, persist or deduplicate the provider event ID, acknowledge quickly, and process longer work asynchronously.",
          "I treated webhook delivery as at-least-once. The endpoint verified the signature before parsing trusted fields, checked the provider event ID, recorded receipt, and returned quickly. A worker handled the domain update idempotently. Unknown event types were logged safely, and failed processing went through bounded retry and alerting.",
          {
            trap: `Some providers use a secret header, some an HMAC signature, and some a verification handshake. Describe the exact provider you used. ${honestyNote}`,
          },
        ),
        q(
          "How did you implement idempotency?",
          "The server accepts a client-generated operation key, atomically associates it with a request fingerprint and eventual result, and returns the stored result on a retry. Reusing the key with a different request must be rejected.",
          "For a create or payment-like operation, I scoped the idempotency key to the caller, inserted it under a unique constraint, and stored the operation status and response. A retry with the same payload received the original result; a different payload under the same key returned a conflict. Downstream consumers also deduplicated by event ID.",
          {
            trap: honestyNote,
          },
        ),
        q(
          "Explain a difficult production bug you solved.",
          "Use STAR: state impact, your responsibility, evidence-driven diagnosis, exact root cause, minimal fix, validation, and prevention. One prepared project story is stale client state after a move/delete/reconnect mutation in a shared file or connector workflow.",
          "In a file or connector flow, the UI could show stale state after a successful mutation. I traced one request end to end, compared the backend response with client cache keys, and found that only one view was being invalidated while another affected listing retained old data. I made the mutation response deterministic, invalidated the exact source and destination queries, and refetched from the backend after success. I added a regression case and monitored errors after release. The lesson was that shared-workspace state needs an explicit cache-consistency plan.",
          {
            trap: `Use this only if it matches a bug you truly handled. Include real impact, tools, and validation; never claim a hypothetical as production experience. ${honestyNote}`,
          },
        ),
        q(
          "Explain one scalability challenge you handled.",
          "Choose one pressure point and explain why the old path would fail: repeated permission queries, synchronous downstream work, a hot cache key, time-series scans, or high-volume CRM documents. Then show the measured design change and trade-off.",
          "One scalability concern was repeated access to permission or reference data on a high-traffic path. Querying the database for every request increased latency and connection pressure. I used cache-aside with bounded TTL, explicit invalidation on writes, and protection against concurrent hot-key refresh. The database stayed authoritative, and I tracked hit rate and fallback latency so the cache did not hide a growing query problem.",
          {
            trap: honestyNote,
          },
        ),
        q(
          "Explain a database optimization you implemented.",
          "A good story connects a query pattern to an execution plan and a targeted change. Time-series data often benefits from a composite index such as sensor ID plus timestamp; multi-tenant listings often need tenant/cloud plus parent/status and ordering.",
          "I started from the slow endpoint and inspected its query and plan. The filter used a resource identifier plus a time or status range, but the existing index did not match that access pattern. I added or reordered a composite index, selected only required columns, and kept pagination bounded. I compared reads and latency before and after, then watched write overhead because every index has a cost.",
          {
            trap: "Replace the generic columns with the actual query, engine, execution-plan evidence, and measured result you can defend.",
          },
        ),
      ],
    },
    {
      label: "💳 Architecture & ownership stories",
      questions: [
        q(
          "Explain your Spring Boot architecture.",
          "A clean Spring Boot service uses controllers for HTTP concerns, services for use cases and transaction boundaries, repositories for persistence, DTOs for external contracts, entities for persistence identity, and centralized validation/error handling.",
          "I structure the service as controller → application service → repository. The controller binds and validates a DTO; the service authorizes, runs business rules, and owns the transaction; the repository loads or persists entities. Mappers isolate the API contract, and controller advice returns consistent errors. Cross-cutting security, metrics, and tracing sit at framework boundaries.",
          {
            trap: honestyNote,
          },
        ),
        q(
          "Explain a PayPal onboarding flow.",
          "Partner or merchant onboarding is a stateful external workflow: create an onboarding/referral request, redirect the merchant to PayPal, correlate the return, verify status from PayPal server-side, process signed webhooks idempotently, and enable capabilities only after authoritative confirmation.",
          "I model onboarding as states such as not-started, pending, action-required, active, and failed. The backend creates the PayPal onboarding request and stores its correlation ID. After the user returns, I do not trust the browser alone; I query PayPal and also process signed webhooks. Webhook event IDs are deduplicated, status transitions are validated, tokens are protected, and the UI can resume an incomplete flow.",
          {
            trap: `The supplied prep list names PayPal, but the portfolio source does not record the exact implementation. Treat this as a preparation framework and replace it with the real PayPal product, endpoint, OAuth model, webhook events, and state names you used.`,
          },
        ),
        q(
          "Explain one pull request you are most proud of.",
          "Choose a PR where your reasoning is visible: a cross-layer feature, a risky refactor, a reliability fix, or a security boundary. Explain the problem, alternatives, review feedback, tests, rollout, and outcome—not just lines changed.",
          "I would choose the PR that made a file or connector mutation consistent across API, permission checks, and client state. I documented the failure mode, changed the backend contract and targeted cache invalidation, added regression coverage, and split the changes so reviewers could verify each layer. The part I am proud of is not its size; it removed an entire class of stale-state bugs and left the flow easier to reason about.",
          {
            trap: "Replace this with the real PR title, your exact contribution, reviewer feedback you acted on, and a result you can substantiate.",
          },
        ),
        q(
          "How do you explain architecture decisions without overclaiming ownership?",
          "Separate what you personally implemented, what you proposed or reviewed, and what the team owned together. Then explain the system-level reasoning you understand. Honest scope increases credibility and still shows technical depth.",
          "The feature was collaborative. I personally owned the API/UI integration and permission-aware flow, contributed to the design discussion, and reviewed how the connector capability fit the framework. Another developer implemented part of the custom connector. I can still explain the full request, auth, schema, failure, and audit flow, but I am precise about my contribution.",
        ),
        q(
          "How do you answer follow-up questions when you do not remember an implementation detail?",
          "State what you remember, separate it from an inference, then reason from fundamentals or offer how you would verify. Guessing a library version, metric, or production behavior can damage an otherwise strong answer.",
          "I do not remember the exact configuration value, so I do not want to invent it. The design used bounded retry with backoff and a terminal failure path. In production I would confirm the attempt count in configuration and the dashboard. The important behavior I owned was idempotent processing and visibility of exhausted failures.",
        ),
      ],
    },
  ],
};
