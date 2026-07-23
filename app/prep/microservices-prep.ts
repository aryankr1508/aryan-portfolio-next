import { PrepCategory } from "./prep-types";
import { q } from "./prep-types";

export const microservicesCategory: PrepCategory = {
  name: "Microservices",
  color: "#c084fc",
  bg: "#1c1025",
  icon: "🧩",
  description: "Service architecture, resilience, messaging, Kafka, and web services",
  sections: [
    {
      label: "🧩 Microservice architecture",
      questions: [
        q(
          "Why would you choose microservices?",
          "Microservices let independently owned business capabilities be developed, deployed, and scaled separately. They can improve team autonomy and fault isolation, but introduce network failure, observability, data consistency, deployment, and operational complexity.",
          "I choose microservices when independent release cadence, scaling, or ownership justifies the distributed-systems cost. A modular monolith is often the better starting point. Service boundaries should follow business capabilities, not technical layers.",
        ),
        q(
          "Monolith vs microservices: what are the trade-offs?",
          "A monolith deploys one application and usually makes local calls and transactions simple. Microservices split deployment and data ownership, allowing independent change but turning calls into unreliable network interactions.",
          "A well-structured monolith is not a failure. It is easier to test, deploy, and keep consistent. I split a service only when the boundary and operational benefit are clear, because microservices trade code complexity for distributed operational complexity.",
        ),
        q(
          "What is an API Gateway?",
          "An API Gateway is a single entry layer that routes requests to services and may handle authentication, TLS, rate limits, request shaping, aggregation, and observability. It should not become a giant home for domain logic.",
          "The gateway centralizes edge concerns and hides internal topology. I keep business rules in services, make the gateway horizontally scalable, and avoid a single point of failure with redundancy and health-based routing.",
        ),
        q(
          "What is service discovery?",
          "Service discovery maps a logical service name to healthy running instances whose addresses may change. Client-side discovery lets the client choose an instance; server-side discovery puts that choice in a proxy or load balancer.",
          "In Kubernetes, Services and DNS commonly provide discovery. In other environments a registry such as Eureka or Consul may do it. Discovery must integrate health, deregistration, and load balancing.",
        ),
        q(
          "What is a Config Server or centralized configuration service?",
          "It provides versioned external configuration to many services rather than baking environment values into artifacts. It can support refresh, encryption integration, audit, and environment separation.",
          "I keep deployable artifacts environment-neutral and inject configuration at runtime. Secrets come from a dedicated secret manager, access is least-privilege, and risky dynamic refresh is tested because changing live behavior across instances can cause inconsistency.",
        ),
        q(
          "How does a circuit breaker work?",
          "A circuit breaker counts relevant failures or slow calls. It is closed during normal traffic, opens to fail fast when a threshold is exceeded, then half-opens after a wait to test recovery.",
          "A circuit breaker stops repeated calls to an unhealthy dependency, protecting threads and helping recovery. I combine it with timeouts, limited retries, fallbacks only when semantically safe, and metrics. It is not a substitute for fixing the dependency.",
        ),
        q(
          "When should you retry a remote call?",
          "Retry only transient failures, with a small attempt limit, exponential backoff, jitter, and an overall deadline. The operation must be idempotent or protected by an idempotency key. Validation and most 4xx failures should not be retried.",
          "I retry connection resets, selected 5xx responses, or throttling according to contract. I do not retry every exception, and I prevent retry storms with jitter, budgets, and circuit breaking.",
        ),
        q(
          "What is a Feign client?",
          "Spring Cloud OpenFeign creates an HTTP client implementation from an annotated Java interface. It reduces request boilerplate and integrates with serialization, discovery, load balancing, and resilience tooling.",
          "Feign makes the client contract concise, but the call is still a network call. I configure connect/read timeouts, error mapping, authentication propagation, tracing, and safe retry behavior instead of treating it like a local method.",
        ),
        q(
          "What does a load balancer do?",
          "A load balancer distributes traffic among healthy service instances. Algorithms include round robin, weighted, least connections, or consistent hashing. Health checks and connection behavior matter as much as the algorithm.",
          "Load balancing improves capacity and availability but cannot fix a shared database bottleneck. I separate readiness from liveness, drain instances during deployment, and preserve affinity only when the application genuinely requires it.",
        ),
        q(
          "How do services communicate synchronously vs asynchronously?",
          "Synchronous HTTP/gRPC provides an immediate response and simpler request reasoning but couples availability and latency. Messaging decouples time and load, supports buffering, and enables fan-out, but adds eventual consistency and duplicate handling.",
          "I use synchronous calls when the caller needs an immediate answer, and events for facts other services can process later. I avoid long synchronous call chains and design consumers to be idempotent.",
        ),
        q(
          "Why is a distributed transaction difficult?",
          "A business operation may span databases owned by different services, but a normal local ACID transaction cannot atomically commit them. Two-phase commit adds coordinator and availability costs and is often unsuitable for loosely coupled services.",
          "I keep strong consistency inside one service boundary. Across services I use a saga with durable events, idempotency, retries, and compensating actions. The business must define what ‘undo’ really means.",
        ),
        q(
          "What is the Saga pattern?",
          "A saga is a sequence of local transactions. Each successful step triggers the next; a later failure invokes compensating actions for prior steps. Choreography uses events, while orchestration uses a coordinator.",
          "For an order, reserve inventory, authorize payment, and arrange shipping as local transactions. If payment fails, release inventory. I persist saga state, make commands idempotent, and handle a compensation that can also fail.",
        ),
        q(
          "What is event-driven architecture?",
          "Services publish facts about completed state changes and other services react asynchronously. This reduces direct coupling and supports fan-out, but contracts, ordering, duplicates, replay, and observability become first-class concerns.",
          "I publish domain facts such as `OrderPlaced`, not vague commands disguised as events. Events are immutable, versioned, traceable, and consumers are idempotent. I use the outbox pattern to avoid committing database state without publishing its event.",
        ),
        q(
          "What is the transactional outbox pattern?",
          "The service writes its business change and an outbox event in the same local database transaction. A relay later publishes the outbox row to the broker. This closes the gap between database commit and message publish.",
          "Outbox gives atomic local persistence, not exactly-once end-to-end delivery. The relay may publish twice, so consumers still deduplicate or process idempotently. I monitor unpublished outbox age and relay lag.",
        ),
        q(
          "What are distributed tracing and correlation IDs?",
          "A correlation or trace ID connects logs and operations for one request across services. Distributed tracing records spans, parent-child relationships, latency, and errors across network boundaries.",
          "I propagate standard trace context through HTTP and messages, include IDs in structured logs, and add useful business attributes without sensitive data. This lets me locate which downstream call caused end-to-end latency.",
        ),
      ],
    },
    {
      label: "📨 Kafka & messaging basics",
      questions: [
        q(
          "Explain Kafka topics, partitions, producers, consumers, and consumer groups.",
          "Producers append records to topic partitions. A partition is an ordered log with offsets. Consumers read offsets. Within one consumer group, each partition is assigned to at most one active consumer so work is shared.",
          "Kafka scales through partitions. Ordering is guaranteed within a partition, not across a whole topic. Consumer-group parallelism is limited by partition count, so I choose partitioning and message keys from ordering and throughput requirements.",
        ),
        q(
          "How do Kafka message keys affect ordering?",
          "A producer typically hashes the key to select a partition. Records for the same stable key therefore reach the same partition and retain order, subject to producer configuration and failure behavior.",
          "If all events for one order must stay ordered, I use order ID as the key. A hot key can overload one partition, so ordering scope and traffic distribution must be balanced.",
        ),
        q(
          "At-most-once, at-least-once, and exactly-once: what do they mean?",
          "At-most-once may lose work but does not redeliver. At-least-once retries and may duplicate. Exactly-once means one logical effect within a defined boundary and requires coordinated broker, producer, consumer, and destination semantics.",
          "Most business pipelines use at-least-once plus idempotent consumers. I never claim end-to-end exactly-once merely because Kafka has transactions; an external database or email side effect needs its own deduplication strategy.",
        ),
        q(
          "What is a dead-letter queue or dead-letter topic?",
          "It stores messages that still fail after the defined retry policy so one poison record does not block a partition or worker forever. It should include the original payload/reference, error context, attempts, and timestamps.",
          "I retry transient failures with backoff, then move permanent or exhausted failures to a DLQ. I alert on it, provide a safe replay process, and protect sensitive data. A DLQ without ownership and replay is only hidden data loss.",
        ),
        q(
          "What is Kafka consumer lag?",
          "Lag is the difference between the latest partition offset and a consumer group's committed or processed offset. Rising lag means arrival rate exceeds processing capacity or the consumer is unhealthy.",
          "I monitor lag per partition plus processing latency and error rate. I reduce it by fixing slow work, batching, adding consumers up to partition count, increasing partitions carefully, or moving blocking side effects out of the hot path.",
        ),
        q(
          "Kafka vs RabbitMQ: how do you choose?",
          "Kafka is a durable replayable distributed log suited to high-throughput event streams. RabbitMQ is a message broker with flexible exchanges, routing, acknowledgements, and queue-oriented work distribution.",
          "I choose from semantics, not popularity. Kafka fits retained event streams, replay, and analytics pipelines. RabbitMQ fits complex routing and task queues. Both need idempotency, retry, monitoring, and capacity planning.",
        ),
        q(
          "Queue vs topic: what is the difference?",
          "A work queue normally delivers each message to one competing worker. A topic publishes an event that multiple independent subscriptions or consumer groups can each receive.",
          "I use a queue to distribute one job, such as image processing. I use a topic for a business fact such as OrderPlaced that billing, notifications, and analytics each consume independently.",
        ),
      ],
    },
    {
      label: "🕸️ Web services",
      questions: [
        q(
          "SOAP vs REST: what is the difference?",
          "SOAP is a protocol with an XML envelope, formal contracts, and WS-* standards for concerns such as security and reliable messaging. REST is an architectural style that commonly uses HTTP resources and JSON but is not tied to JSON.",
          "SOAP can suit enterprise integrations requiring strict WSDL contracts and WS-Security. REST is usually lighter for web APIs and aligns naturally with HTTP semantics. The choice depends on integration requirements rather than one being universally better.",
        ),
        q(
          "XML vs JSON: what are the trade-offs?",
          "JSON is compact and maps naturally to web objects. XML supports attributes, namespaces, mixed content, comments, and strong schema ecosystems but is more verbose. Both require safe parsing and explicit contracts.",
          "I default to JSON for REST APIs. I use XML when integrating with an existing SOAP or document-centric standard. I protect XML parsers from external entity attacks and do not rely on format alone for validation.",
        ),
        q(
          "What is WSDL?",
          "Web Services Description Language is an XML contract describing SOAP operations, messages, types, bindings, and service endpoints. Tools can generate strongly typed client/server stubs from it.",
          "WSDL is the machine-readable contract for a SOAP service. It provides strong interoperability but makes contract evolution and tooling more formal than a typical OpenAPI-described REST service.",
        ),
        q(
          "How do you design a REST endpoint for a nested resource?",
          "Use nesting when the parent provides necessary identity or scope, and keep nesting shallow. `/orders/{orderId}/items` clearly scopes order items; a globally addressable item can still use `/items/{itemId}`.",
          "I use nested paths for ownership and creation context, query parameters for filtering, and authorization from the authenticated user plus parent resource. Deep URL trees usually expose storage structure rather than a clean domain.",
        ),
        q(
          "How do you authenticate a service-to-service API?",
          "Common choices include OAuth 2.0 client credentials with short-lived tokens, mutual TLS, or platform workload identity. The receiving service validates identity, audience, expiry, and scopes, then authorizes the operation.",
          "I prefer short-lived workload identity or client-credentials tokens over shared static API keys. Secrets are rotated, permissions are least-privilege, and credentials are never forwarded to unrelated downstream services.",
        ),
      ],
    },
  ],
};
