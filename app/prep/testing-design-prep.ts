import { PrepCategory } from "./prep-types";
import { q } from "./prep-types";

export const testingDesignCategory: PrepCategory = {
  name: "Testing & Design",
  color: "#fb7185",
  bg: "#241013",
  icon: "🧪",
  description: "Patterns, JUnit/Mockito, coding patterns, and practical system design",
  sections: [
    {
      label: "🧰 Design patterns",
      questions: [
        q(
          "Explain the Singleton pattern and its risks.",
          "Singleton ensures one accessible instance within a defined scope. In Java an enum singleton handles serialization and reflection safely. In Spring, singleton is a container scope. Global mutable singletons hide dependencies and make tests interfere.",
          "I rarely implement Singleton manually in a Spring application because the container already manages singleton beans. I keep them stateless. If I need a JVM-level singleton outside a container, an enum is the safest simple form.",
          {
            code: `public enum AppClock {
    INSTANCE;
    public Instant now() { return Instant.now(); }
}`,
          },
        ),
        q(
          "Explain the Factory pattern.",
          "A factory centralizes object creation and returns an abstraction. It is useful when selection depends on type, configuration, or input and callers should not know concrete constructors.",
          "A PaymentProcessorFactory can select card, UPI, or PayPal processing while the checkout flow depends only on PaymentProcessor. In Spring I often inject a map of strategies instead of writing a large switch.",
        ),
        q(
          "Explain the Builder pattern.",
          "Builder constructs a complex object step by step, making optional values readable and avoiding telescoping constructors. A final build step can validate cross-field invariants and return an immutable object.",
          "I use Builder when an object has many optional parameters or construction needs validation. I avoid it for a record with two obvious fields because the extra ceremony adds no clarity.",
        ),
        q(
          "Explain the Strategy pattern.",
          "Strategy puts interchangeable algorithms behind one interface. The context delegates work to the selected strategy, avoiding growing conditionals and allowing new behavior without modifying the core flow.",
          "For pricing, DiscountStrategy implementations handle loyalty, seasonal, and partner rules. Spring can inject all strategies keyed by type. Strategy is composition and runtime polymorphism applied to a varying business rule.",
        ),
        q(
          "Explain the Observer pattern.",
          "Observers subscribe to a subject and are notified when an event occurs. It decouples the producer from reactions, but synchronous observers can add hidden latency and failure coupling; asynchronous events add delivery complexity.",
          "Inside one process I might publish an application event for a decoupled reaction. Across services I use a broker and design for duplicates, ordering, and retries. Observer is the idea; Kafka is one infrastructure that can support event subscribers.",
        ),
        q(
          "Is Dependency Injection a design pattern?",
          "Dependency Injection is a technique and commonly described pattern for supplying collaborators from outside an object. It implements Inversion of Control and often works with Factory and Strategy patterns.",
          "DI makes dependencies explicit and substitutes abstractions during tests or configuration. Spring is the container, but constructor injection remains useful design even without Spring.",
        ),
      ],
    },
    {
      label: "🧪 JUnit 5 & Mockito",
      questions: [
        q(
          "What are the important JUnit 5 concepts and annotations?",
          "JUnit Jupiter uses `@Test`, lifecycle hooks, nested and parameterized tests, assertions, assumptions, tags, and extensions. Tests should describe behavior, arrange inputs, act once, and assert observable outcomes.",
          "I use JUnit 5 for fast, deterministic tests. I prefer descriptive method names and parameterized tests for behavior tables. I avoid sharing mutable state across tests and test business outcomes rather than private implementation.",
        ),
        q(
          "What is Mockito and when should you mock?",
          "Mockito creates test doubles for collaborators so one unit can be exercised in isolation. Mock boundaries such as repositories, clocks, and external clients—not simple value objects or the class under test.",
          "I mock a dependency when its real behavior is slow, nondeterministic, or outside the unit. If a test mocks half the application and only verifies internal calls, it is too coupled and may need a smaller design or an integration test.",
        ),
        q(
          "What do when(), thenReturn(), thenThrow(), and verify() do?",
          "`when(...).thenReturn(...)` stubs a collaborator result; `thenThrow` stubs failure. `verify` checks an interaction occurred. State/output assertions should remain primary unless the interaction itself is the behavior.",
          "I stub only calls required by the scenario, then assert the returned state or exception. I verify important side effects such as publishing one event, and use `never()` for a call that must not happen.",
          {
            code: `when(repository.findById(id)).thenReturn(Optional.of(order));

service.cancel(id);

assertEquals(CANCELLED, order.status());
verify(repository).findById(id);
verify(events).publish(any(OrderCancelled.class));`,
          },
        ),
        q(
          "What is @MockBean, and how is it different from @Mock?",
          "`@Mock` creates a Mockito mock with no Spring context. `@MockBean` is the commonly known Spring Boot test feature that replaces/adds a bean in the test ApplicationContext, though newer Spring versions provide `@MockitoBean` as its successor.",
          "For a pure service unit test I use Mockito `@Mock` and `@InjectMocks` or plain construction. For a Spring slice/integration test where one real bean must be replaced, I use the framework's bean-override annotation. Loading Spring for every unit test is slower and unnecessary.",
        ),
        q(
          "What is a spy?",
          "A spy wraps a real object: unstubbed methods execute real code while selected calls can be stubbed or verified. Partial mocking can hide a class with mixed responsibilities, and `when(spy.method())` may call the real method during stubbing.",
          "I use spies rarely. When needed, I prefer `doReturn(value).when(spy).method()` to avoid executing the real method while stubbing. Frequent spying is a signal to extract a collaborator.",
        ),
        q(
          "Which JUnit assertions should you know?",
          "Common assertions include equals/not-equals, true/false, null/not-null, same/not-same, iterable equality, `assertThrows`, `assertAll`, and timeout assertions.",
          "I assert behavior precisely: exception type plus useful fields, not just ‘an exception happened.’ I use assertAll when several independent properties should be reported together and avoid brittle assertions on incidental text.",
        ),
        q(
          "Unit vs integration vs end-to-end tests?",
          "A unit test isolates one small behavior and is fast. An integration test verifies real components work together, such as JPA with a database. An end-to-end test exercises the deployed path through external boundaries and is slower and more fragile.",
          "I use many unit tests for business rules, focused integration tests for mappings, queries, serialization, and security, and a small set of end-to-end critical journeys. Testcontainers helps test against the real database engine instead of an incompatible in-memory substitute.",
        ),
        q(
          "How do you test a Spring MVC controller?",
          "A web slice test can load MVC infrastructure and the controller while replacing service collaborators. MockMvc or WebTestClient sends HTTP-like requests and verifies status, headers, JSON, validation, and exception mapping.",
          "Controller tests focus on the HTTP contract, not service business logic. I test success, invalid input, unauthenticated/forbidden access, not-found mapping, and important headers.",
        ),
      ],
    },
    {
      label: "⌨️ Collection & coding questions",
      questions: [
        q(
          "How would you design an LRU Cache?",
          "Use a HashMap from key to node for O(1) lookup and a doubly linked list for O(1) recency movement and eviction. The head is most recent, tail least recent. Get and put move a node to the head.",
          "I state the invariant first: every map entry has exactly one list node. On capacity overflow I remove the tail from both list and map. In production I consider concurrency, weighted capacity, expiration, and use Caffeine rather than reinventing it.",
        ),
        q(
          "How would you implement a rate limiter?",
          "Token bucket supports controlled bursts: tokens refill at a fixed rate and each request consumes one. Fixed window is simple but spikes at boundaries; sliding window is more accurate but stores more data.",
          "For one process I can use a synchronized token bucket. For distributed APIs I use gateway or Redis with an atomic Lua script, key by user/API/tenant, set expiry, and return 429 plus Retry-After. I define fail-open versus fail-closed explicitly.",
        ),
        q(
          "How would you design a logger?",
          "Separate the logging API from appenders/sinks and formatters. A record carries timestamp, level, message, context, exception, and correlation ID. An async bounded queue can protect request latency, with a clear overload policy.",
          "I support level filtering, structured output, pluggable appenders, batching, rotation, and redaction. I never block critical application threads indefinitely or log passwords/tokens. Existing logging frameworks are the production choice.",
        ),
        q(
          "How would you model a Parking Lot system?",
          "Identify vehicles, spots by size/type, floors, tickets, gates, pricing strategy, and payment. Allocation and release must be atomic so two entries cannot receive the same spot.",
          "I start with use cases and invariants rather than classes. Spot assignment is a strategy, fee calculation is another, and repositories protect state. For multiple gates I use a database conditional update or lock, not only an in-memory synchronized block.",
        ),
        q(
          "How would you design an inventory system?",
          "Model available, reserved, and sold quantities per SKU and location. Reservation needs expiry and an atomic condition preventing stock below zero. Events update downstream search and analytics.",
          "My core invariant is `available >= 0`. I reserve with an atomic update such as `UPDATE ... SET available=available-? WHERE available>=?`, attach an idempotency key, expire abandoned reservations, and reconcile with an audit ledger.",
        ),
        q(
          "How would you design a banking transfer?",
          "Represent money with decimal/minor units, keep an immutable ledger, and update both accounts in one database transaction where possible. Validate currency, authorization, limits, and idempotency.",
          "I lock or atomically update accounts in a consistent order, write balanced debit/credit ledger entries, and commit once. Across institutions I use an asynchronous workflow with pending states and reconciliation rather than pretending there is one ACID database.",
        ),
        q(
          "How would you model an employee hierarchy?",
          "An employee can hold an optional manager ID, forming an adjacency list. A recursive CTE reads reporting chains. Writes must prevent cycles and may store a materialized path or closure table when hierarchy queries dominate.",
          "I start with employee plus manager_id and index manager_id. I validate that a manager assignment does not point to self or a descendant. For deep, frequently queried trees I discuss closure-table trade-offs.",
        ),
        q(
          "How would you design a library system?",
          "Separate a book title/edition from physical copies. Members borrow copies through loans; a reservation queue handles unavailable titles. Due dates, fines, renewals, and lost-copy state are business policies.",
          "The key concurrency rule is that one copy has at most one active loan. I enforce it with a unique/conditional database rule, not only a check in Java. Notification and fine calculation are separate collaborators.",
        ),
        q(
          "How would you design order management?",
          "An Order aggregate owns lines, totals, customer snapshot, and a controlled state machine. Payment, inventory, fulfillment, and notifications are separate capabilities connected through commands/events.",
          "I make state transitions explicit—created, confirmed, paid, shipped, cancelled—and reject invalid transitions. Creation uses idempotency. Cross-service steps use a saga and outbox; the order keeps a durable history for support and audit.",
        ),
        q(
          "Solve a frequency-counting or duplicate-element problem.",
          "Traverse once and update a HashMap from value to count. A duplicate exists when count exceeds one or when `Set.add` returns false. This is O(n) expected time and O(k) space for k distinct values.",
          "I clarify output order and memory limits. For deterministic first occurrence I use LinkedHashMap; for a tiny bounded domain an array may be simpler and faster.",
          {
            code: `Map<String, Long> counts = values.stream()
    .collect(Collectors.groupingBy(
        Function.identity(),
        LinkedHashMap::new,
        Collectors.counting()));`,
          },
        ),
        q(
          "How do you group anagrams?",
          "Map every word to a canonical signature, then append it to that signature's group. Sorting the letters is simple at O(m log m) per word; a fixed character-frequency signature can be O(m).",
          "For lowercase English letters I use a 26-count signature; for arbitrary Unicode I may sort normalized code points. Total grouping is one HashMap pass.",
        ),
        q(
          "How do you merge intervals?",
          "Sort intervals by start, then scan. If the next start is at or before the current end, extend the end; otherwise emit the current interval and start a new one.",
          "Sorting dominates at O(n log n); the scan is O(n). I clarify whether touching intervals such as [1,2] and [2,3] should merge and avoid mutating caller-owned input unless allowed.",
        ),
        q(
          "How do you solve Two Sum?",
          "Scan once with a HashMap from previously seen value to index. For each number, check whether target minus that number already exists; if so, return the two indices.",
          "The brute force is O(n²). The complement map gives expected O(n) time and O(n) space. I check before inserting so I do not pair an element with itself and I clarify duplicate behavior.",
          {
            code: `Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int needed = target - nums[i];
    if (seen.containsKey(needed)) return new int[] { seen.get(needed), i };
    seen.put(nums[i], i);
}`,
          },
        ),
        q(
          "How do you solve Top K frequent elements?",
          "Count with a HashMap, then keep a min-heap of size K or use frequency buckets. The heap solution is O(n log k); bucket grouping can be O(n) with more memory.",
          "I choose heap for general K and streaming-like constraints. The heap stores the K best frequencies and evicts the smallest. I define tie ordering if the expected output must be deterministic.",
        ),
        q(
          "How do you recognize a sliding-window problem?",
          "It asks about a contiguous substring or subarray while the validity condition can be updated as the ends move. Expand the right boundary, then shrink the left until the window is valid, tracking the best answer.",
          "I state what the window contains and its invariant. For longest substring without repeating characters, the invariant is each character occurs at most once; a map of last index lets the left edge jump forward.",
        ),
      ],
    },
    {
      label: "🏗️ Scenario & system design",
      questions: [
        q(
          "Design a URL shortener.",
          "The write path validates a long URL, creates a unique short code, stores the mapping, and returns it. The read path looks up the code and redirects. Popular links benefit from cache; analytics should stay off the redirect hot path.",
          "I estimate traffic first, choose random/Base62 IDs with collision handling, shard or partition by code, cache hot mappings, and return 301 or 302 according to mutability. I also cover expiry, abuse prevention, custom aliases, and async click events.",
        ),
        q(
          "Design a notification service.",
          "Accept a notification command with recipient, template, channel, variables, priority, schedule, and idempotency key. Persist intent, publish to per-channel workers, apply preferences, render, send, retry transient errors, and dead-letter permanent failures.",
          "The API acknowledges durable acceptance, not final delivery. Channel adapters isolate email/SMS/push providers. I add rate limits, deduplication, user preferences, provider failover, delivery status, templates, and observability.",
        ),
        q(
          "Design a payment API.",
          "Expose payment intent creation with amount, currency, customer, method reference, and idempotency key. Keep a strict state machine and immutable ledger; process provider webhooks as untrusted, repeatable events.",
          "I never store raw card data unless the system is designed for PCI scope. I tokenize through a provider, verify webhook signatures, deduplicate events, reconcile provider and internal states, and return the same result for a repeated idempotency key.",
        ),
        q(
          "Design an inventory system for flash-sale traffic.",
          "Keep inventory authoritative in a transactional store, reserve with an atomic conditional decrement, and expire reservations. Cache can speed reads but must not decide correctness. Queueing can smooth bursts.",
          "I prevent overselling at the write boundary, not with a prior read. Requests are idempotent, reservations have TTL, releases are retried, and a ledger supports reconciliation. I partition by SKU carefully because a viral SKU is a hot key.",
        ),
        q(
          "Design a large file-upload service.",
          "The application authenticates and creates upload metadata, then issues a short-lived pre-signed multipart upload URL to object storage. The client uploads directly and completes the session. Background workers scan, extract metadata, and generate derivatives.",
          "I support resumable chunks, checksums, size/type validation, quotas, cancellation, and orphan cleanup. Downloads use authorized short-lived URLs. Metadata state moves from initiated to uploaded to processing to ready or failed.",
        ),
        q(
          "Design an employee-management system.",
          "Model employees, departments, roles, reporting relationships, employment status, and audit history. Separate authentication identity from HR data and enforce field-level authorization for sensitive compensation and personal data.",
          "I expose paged search, hierarchy queries, onboarding/offboarding workflows, and immutable audit events. Manager updates prevent cycles. PII is encrypted or masked, access is least-privilege, and retention policies are explicit.",
        ),
        q(
          "Design a library-management system at API level.",
          "Expose catalog search, copy availability, checkout, return, renew, reservation, and account endpoints. Use transactional rules for one active loan per copy and an ordered reservation queue per title.",
          "I separate Book metadata from BookCopy inventory. Checkout is idempotent and concurrency-safe. Overdue notifications are asynchronous, while fines and renewal limits are policy strategies.",
        ),
        q(
          "How do you approach any system-design interview?",
          "Clarify users, functional scope, scale, latency, consistency, security, and out-of-scope items. Sketch APIs and data model, draw the main read/write flow, find bottlenecks, then discuss failure and trade-offs.",
          "I narrate decisions instead of listing technologies. I start simple, estimate the dominant load, protect correctness invariants, and then scale the actual bottleneck. I finish with observability, security, deployment, and what I would validate next.",
        ),
      ],
    },
  ],
};
