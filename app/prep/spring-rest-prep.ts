import { PrepCategory } from "./prep-types";
import { q } from "./prep-types";
import { springBootRapidFireSection } from "./spring-boot-rapid-fire";

export const springRestCategory: PrepCategory = {
  name: "Spring & REST",
  color: "#6db33f",
  bg: "#11200d",
  icon: "🍃",
  description: "50 transcript-style Spring Boot questions, plus deeper Spring, MVC, REST, and HTTP",
  sections: [
    springBootRapidFireSection,
    {
      label: "🌱 Spring Core",
      questions: [
        q(
          "What is the Spring Framework?",
          "Spring is a Java application framework centered on an IoC container. It creates and wires application objects, then adds modules for web APIs, data access, transactions, security, testing, messaging, and more.",
          "Spring lets me build loosely coupled Java applications. The container manages object creation and dependencies, while modules such as Spring MVC and Spring Data solve common infrastructure concerns so business code stays focused.",
        ),
        q(
          "What are IoC and Dependency Injection?",
          "Inversion of Control means application objects do not control the creation of all their collaborators; the framework does. Dependency Injection is the mechanism: dependencies arrive through a constructor, method, or field.",
          "IoC is the broader principle and DI is how Spring implements it. Instead of `new`-ing a repository inside a service, I declare the repository in the constructor and Spring supplies the configured bean. That lowers coupling and makes unit testing easy.",
          {
            code: `@Service
class OrderService {
    private final OrderRepository orders;

    OrderService(OrderRepository orders) {
        this.orders = orders;
    }
}`,
          },
        ),
        q(
          "What is a Spring bean?",
          "A bean is an object whose creation, configuration, dependencies, and lifecycle are managed by the Spring container. Beans can come from component scanning or explicit `@Bean` factory methods.",
          "A bean is simply a container-managed object. Making every data object a bean is unnecessary; I use beans for application components and infrastructure that benefit from lifecycle management and dependency injection.",
        ),
        q(
          "What bean scopes does Spring provide?",
          "Singleton is one bean instance per ApplicationContext and is the default. Prototype asks the container for a new instance each time. Web applications also provide request, session, application, and websocket scopes.",
          "Most services are stateless singletons. I use request scope only for truly request-specific state. Prototype has a lifecycle caveat: Spring creates it but does not automatically manage its full destruction after handing it out.",
          {
            trap: "A Spring singleton is per container, not necessarily one object for the entire JVM. Singleton beans must not keep mutable request-specific state.",
          },
        ),
        q(
          "What do @Component, @Service, @Repository, @Controller, and @RestController mean?",
          "They are stereotype annotations detected by component scanning. Component is generic; Service expresses business logic; Repository marks persistence and enables exception translation; Controller serves MVC views; RestController is Controller plus ResponseBody for response data.",
          "They all register beans, but the specific stereotype communicates architectural intent. I use RestController at the HTTP boundary, Service for use cases, and Repository for persistence. Those boundaries also make validation, transactions, and tests clearer.",
        ),
        q(
          "How does autowiring work in Spring?",
          "Spring resolves a dependency primarily by type. If several beans match, `@Primary` chooses a default or `@Qualifier` selects explicitly. A class with one constructor does not need `@Autowired` on that constructor.",
          "I use constructor injection and let Spring resolve by type. Multiple implementations are an intentional design choice, so I disambiguate with a meaningful qualifier or inject a map/list of strategies rather than depending on field names.",
        ),
        q(
          "Constructor injection vs field injection: why prefer constructors?",
          "Constructor injection makes required dependencies explicit, supports final fields, prevents partially initialized objects, and lets tests instantiate the class without the Spring container. Field injection hides dependencies and relies on reflection.",
          "I prefer constructor injection because invalid objects cannot be created without their required collaborators. It improves immutability and plain unit testing. A very large constructor also gives useful feedback that the class may have too many responsibilities.",
        ),
        q(
          "What is setter injection useful for?",
          "Setter injection can represent an optional or reconfigurable dependency, though optional behavior is often clearer through configuration or a no-op implementation. It allows mutation after construction, so it should not model required dependencies.",
          "Required dependencies go in the constructor. I use setter injection rarely and only when a dependency is genuinely optional. I avoid using it just to shorten a constructor because that hides a design problem.",
        ),
        q(
          "Explain the Spring bean lifecycle.",
          "Spring instantiates a bean, populates dependencies, calls aware callbacks and BeanPostProcessors, runs initialization callbacks, makes it available, then calls destruction callbacks when the context closes.",
          "The practical order I remember is construct, inject, initialize, use, destroy. Spring proxies may wrap the bean during post-processing, which is why calling an intercepted method from inside the same object can bypass the proxy.",
        ),
        q(
          "What are @PostConstruct and @PreDestroy?",
          "`@PostConstruct` runs after dependency injection and can validate or initialize the bean. `@PreDestroy` runs during managed shutdown and can release owned resources. They should not perform slow or failure-prone remote work if avoidable.",
          "I use PostConstruct for lightweight local validation and PreDestroy for cleanup. For application-wide startup ordering or async warm-up, lifecycle events or dedicated runners are usually clearer.",
        ),
        q(
          "What is the ApplicationContext?",
          "ApplicationContext is Spring's main IoC container. It extends the basic BeanFactory concept with events, resource loading, internationalization, environment configuration, and enterprise integrations.",
          "ApplicationContext owns the bean graph and application configuration. Business classes should usually receive their dependencies directly rather than calling `context.getBean`, which turns the container into a service locator and hides coupling.",
        ),
        q(
          "What is component scanning?",
          "Component scanning finds annotated classes in configured packages and registers bean definitions. In Spring Boot, scanning starts from the package containing the main application class and its subpackages by default.",
          "I keep the application class at a sensible root package so controllers, services, and repositories are discovered. When a bean is missing, I first check package boundaries, profiles, conditional configuration, and whether the class is actually registered.",
        ),
        q(
          "When do you use @Bean instead of a stereotype annotation?",
          "`@Bean` is a factory method inside a configuration class. It is useful for third-party classes you cannot annotate or for construction that needs explicit configuration. Stereotypes suit application classes discovered by scanning.",
          "I use `@Service` for my OrderService and `@Bean` for configuring an ObjectMapper or SDK client. Both create managed beans; `@Bean` gives explicit control over construction.",
        ),
        q(
          "What problem do circular dependencies create?",
          "A circular dependency means A needs B while B needs A. Constructor injection exposes the impossible construction cycle immediately. The cycle often signals mixed responsibilities or the need for an event/collaborator boundary.",
          "I fix the design instead of hiding the cycle with field injection or `@Lazy`. Typical fixes are extracting a third service, reversing one dependency through an interface, or publishing a domain event.",
        ),
      ],
    },
    {
      label: "🥾 Spring Boot",
      questions: [
        q(
          "Why use Spring Boot instead of configuring Spring manually?",
          "Spring Boot provides opinionated defaults, dependency starters, auto-configuration, an embedded server, external configuration, and production tooling. It reduces setup while keeping normal Spring behavior customizable.",
          "Spring Boot helps me move from an empty project to a production-ready service quickly. Adding the web starter gives the MVC stack and embedded server; Actuator adds operational endpoints. It is convention with escape hatches, not a separate replacement for Spring.",
        ),
        q(
          "How does Spring Boot auto-configuration work?",
          "Boot inspects the classpath, existing beans, configuration properties, and environment, then conditionally contributes sensible beans. Conditions back off when the application provides its own bean or a required library is absent.",
          "Auto-configuration is conditional configuration. If MVC is on the classpath, Boot configures the normal web infrastructure; if I define my own compatible bean, the default usually backs off. I debug it using the condition evaluation report rather than treating it as magic.",
        ),
        q(
          "What are starter dependencies?",
          "A starter is a curated dependency descriptor for one capability. It brings compatible libraries and expected transitive dependencies together, reducing manual version selection.",
          "`spring-boot-starter-web` gives the common web stack, while data-jpa and test starters assemble their ecosystems. I let Spring Boot's dependency management control versions unless I have a verified reason to override one.",
        ),
        q(
          "application.properties vs application.yml: which is better?",
          "Both feed the same Spring Environment. Properties are flat and explicit; YAML is concise for nested configuration and lists. Choice is mostly team readability, and mixing both without a clear precedence policy can confuse overrides.",
          "I use one consistent format. YAML is readable for nested configuration; properties are easy to search and override. Secrets never belong in either committed file—I inject them through the deployment environment or a secret manager.",
        ),
        q(
          "What are Spring profiles?",
          "Profiles conditionally activate beans or configuration for an environment or mode. Profile-specific configuration can override common settings, but excessive profile branching makes behavior hard to reason about.",
          "I use profiles for legitimate infrastructure differences such as a local fake integration, not to fork business logic. Runtime secrets and environment values come from external configuration. Tests can activate a test profile explicitly.",
        ),
        q(
          "What is Spring Boot Actuator?",
          "Actuator exposes operational capabilities such as health, metrics, info, loggers, mappings, and Prometheus integration. Endpoints must be exposed deliberately and sensitive ones secured.",
          "I use Actuator health for orchestration probes and Micrometer metrics for latency, errors, JVM, pool, and business signals. I expose only required endpoints and keep health indicators fast and meaningful.",
        ),
        q(
          "What does @SpringBootApplication combine?",
          "It combines `@SpringBootConfiguration`, `@EnableAutoConfiguration`, and `@ComponentScan`. In practice it marks the main configuration class, enables Boot's conditional defaults, and scans the package tree.",
          "@SpringBootApplication is the usual entry annotation: configuration plus auto-configuration plus component scanning. I place it near the root package so discovery behaves predictably.",
        ),
        q(
          "How do you externalize and validate configuration?",
          "Spring can bind environment variables, files, command-line arguments, and secret-provider values into typed `@ConfigurationProperties` objects. Bean Validation annotations can fail startup when required configuration is invalid.",
          "I prefer typed configuration properties over scattered `@Value` strings. I validate required URLs, sizes, and credentials at startup, keep secrets outside source control, and document safe defaults.",
          {
            code: `@ConfigurationProperties("payment")
@Validated
record PaymentProperties(
    @NotBlank String baseUrl,
    @NotNull Duration timeout
) {}`,
          },
        ),
      ],
    },
    {
      label: "🛣️ Spring MVC request flow",
      questions: [
        q(
          "What is DispatcherServlet?",
          "DispatcherServlet is Spring MVC's front controller. It receives requests, finds a handler through mappings, invokes it through an adapter, coordinates binding and validation, then resolves a view or writes a response body.",
          "Every MVC request enters DispatcherServlet. It routes to the matching controller method, argument resolvers build parameters, the controller calls services, and message converters serialize the return value—usually JSON.",
        ),
        q(
          "Walk through a Spring Boot REST request from HTTP to database and back.",
          "A request passes through the server and filter chain, reaches DispatcherServlet, maps to a controller, binds and validates a DTO, calls a transactional service, uses a repository/entity manager, then serializes a response. Exceptions can be translated centrally.",
          "I describe the flow as filter → DispatcherServlet → controller → service → repository → database, then back through DTO mapping and JSON serialization. Authentication, validation, transactions, and exception mapping belong at clear boundaries.",
        ),
        q(
          "@RequestMapping vs @GetMapping, @PostMapping, @PutMapping, @PatchMapping, and @DeleteMapping?",
          "`@RequestMapping` is the general mapping annotation and can define path, method, consumes, and produces. The method-specific annotations are composed shortcuts that make endpoint intent obvious.",
          "I use RequestMapping at class level for a shared resource path and the specific mapping annotation on each action. I also declare consumed or produced media types when the contract requires it.",
        ),
        q(
          "What is @RequestParam?",
          "It binds a query-string or form parameter to a method argument. It is appropriate for filtering, sorting, pagination, or optional modifiers rather than resource identity.",
          "For `/orders?status=PAID&page=2`, status and page are request parameters. I validate ranges and give deliberate defaults instead of silently accepting unbounded page sizes.",
        ),
        q(
          "What is @PathVariable?",
          "It binds a URI path segment to a controller parameter. It identifies the resource or hierarchical context represented by the URL.",
          "In `/orders/{orderId}`, orderId is a path variable. I use nouns and stable identifiers in paths, and I still authorize access to that exact resource rather than assuming a valid ID is permitted.",
        ),
        q(
          "What is @RequestBody and how does conversion work?",
          "It asks an HttpMessageConverter—typically Jackson for JSON—to deserialize the request body into a Java object. Validation is triggered separately with `@Valid` or `@Validated`.",
          "I bind request bodies to API DTOs, not directly to persistence entities. That protects the domain from over-posting, keeps validation intentional, and prevents database mapping details from becoming the public API.",
        ),
        q(
          "What is ResponseEntity?",
          "ResponseEntity represents the entire HTTP response: status, headers, and optional body. It is useful when those need explicit control; returning a body object alone is enough for a conventional 200 response.",
          "I use ResponseEntity for cases such as 201 with a Location header, 204 without a body, conditional caching, or a deliberate status. I avoid wrapping every response mechanically when an annotation and return object communicate the same thing.",
        ),
        q(
          "@Controller vs @RestController?",
          "Controller normally participates in view rendering, so a String may be a view name. RestController adds `@ResponseBody` semantics, so return values are written through message converters as JSON, text, or another response format.",
          "I use RestController for APIs and Controller for server-rendered MVC views. A Controller method can still use ResponseBody individually, but RestController makes an API class's intent clear.",
        ),
        q(
          "How do validation and @Valid work in Spring MVC?",
          "Bean Validation annotations describe constraints on a DTO. `@Valid` triggers validation after binding and before the controller method proceeds. Nested objects also require `@Valid` for cascade validation.",
          "I validate shape at the API boundary—required fields, sizes, formats—and validate business rules in the service. A global handler converts field errors into a stable client-friendly error response.",
          {
            code: `record CreateUserRequest(
    @NotBlank String name,
    @Email String email
) {}

@PostMapping
ResponseEntity<UserDto> create(@Valid @RequestBody CreateUserRequest request) { ... }`,
          },
        ),
        q(
          "How do you implement global exception handling?",
          "`@RestControllerAdvice` can handle exceptions across controllers. `@ExceptionHandler` methods translate domain, validation, and infrastructure failures into a consistent status and safe error body.",
          "I throw meaningful exceptions from services and map them once at the HTTP boundary. Responses include a stable error code, message, request/trace ID, and field errors when relevant. Unexpected details stay in logs, not in the client response.",
        ),
        q(
          "Filters vs interceptors vs controller advice: where does each belong?",
          "Servlet filters wrap requests before Spring MVC and suit security, correlation IDs, and raw request concerns. HandlerInterceptors run around mapped controller handlers. Controller advice handles MVC exceptions, binding, and shared controller behavior.",
          "I choose the narrowest layer: filter for HTTP/container-wide concerns, interceptor for handler-aware cross-cutting logic, advice for controller exceptions and binding. Business logic stays in services.",
        ),
        q(
          "How do you handle multipart file uploads in Spring?",
          "Use `MultipartFile`, validate declared and detected type, size, and name, stream content rather than loading it all into memory, and store it outside the application process for production systems.",
          "I treat uploads as hostile input: enforce size limits, generate server-side object keys, scan when required, stream to object storage, and store metadata in the database. Large uploads usually use pre-signed URLs so application servers do not proxy every byte.",
        ),
      ],
    },
    {
      label: "🌐 REST & HTTP",
      questions: [
        q(
          "What are the main REST principles?",
          "REST models resources with representations and uniform HTTP semantics. Important constraints include client-server separation, stateless requests, cacheability, a uniform interface, and layered architecture.",
          "I design around resource nouns, standard methods and statuses, stateless authentication context, and cache semantics. REST is more than returning JSON—it uses HTTP consistently so clients and infrastructure can reason about the API.",
        ),
        q(
          "What does stateless mean in REST?",
          "Each request contains the information needed to understand and authorize it. The server does not rely on conversational state stored from the previous request, though it still stores durable resource data.",
          "Stateless does not mean ‘the server stores nothing.’ Orders and users are state. It means request two does not require hidden session context from request one. That makes horizontal scaling and retries easier.",
        ),
        q(
          "What is idempotency?",
          "An operation is idempotent when repeating the same request has the same intended effect as doing it once. GET, PUT, and DELETE are designed to be idempotent; POST is not automatically so.",
          "For payment creation I accept an idempotency key, atomically store it with the result, and return that result on retry. Idempotency protects against duplicate effects when networks time out and clients cannot tell whether the first attempt succeeded.",
        ),
        q(
          "PUT vs POST: what is the practical difference?",
          "POST usually creates a subordinate resource or triggers processing at a server-chosen URI and is not inherently idempotent. PUT replaces the state at a known URI and is idempotent.",
          "I use POST `/orders` when the server assigns an order ID. I use PUT `/users/42/preferences` when the client knows the resource and sends its complete replacement. The API contract matters more than memorizing verbs.",
        ),
        q(
          "What is PATCH, and how is it different from PUT?",
          "PATCH applies a partial modification; PUT conventionally sends a complete replacement. PATCH format must be defined, such as JSON Merge Patch or JSON Patch, and validation must apply to the final state.",
          "I use PATCH when clients update a subset and I define null-versus-absent semantics clearly. PATCH can be made idempotent, but it is not guaranteed by the method alone.",
        ),
        q(
          "How should DELETE behave if the resource is already gone?",
          "DELETE is idempotent in effect. An API may return 204 for an already-absent resource or 404 to report that it was not found, as long as the contract is consistent and no additional deletion effect occurs.",
          "I choose based on client needs. For a cleanup-style API, repeated 204 is convenient. If existence is important, 404 is informative. Either way, retries do not cause a second side effect.",
        ),
        q(
          "Explain 200, 201, and 204.",
          "200 OK means successful response with a representation. 201 Created means a new resource was created and should usually include its URI in Location. 204 No Content means success with no response body.",
          "I use 200 for reads or updates returning data, 201 for creation, and 204 for a successful action with nothing to return. A 204 response must not contain a body.",
        ),
        q(
          "Explain 400, 401, 403, 404, and 409.",
          "400 is a malformed or invalid request. 401 means valid authentication credentials are missing or unacceptable. 403 means identity is known but access is denied. 404 means resource not found; 409 means a conflict with current resource state.",
          "My quick rule is: 401 ‘who are you?’, 403 ‘I know you, but you cannot do this’, 404 ‘that resource is unavailable’, and 409 ‘your request conflicts with current state’, such as a duplicate unique value or version conflict.",
        ),
        q(
          "When should an API return 500?",
          "500 Internal Server Error means an unexpected server-side failure. Expected validation and domain outcomes should receive deliberate 4xx responses instead. The client receives a safe message while logs and traces hold diagnostic detail.",
          "A 500 is not a generic response for every failure. I map known business cases explicitly, attach a trace ID, avoid leaking stack traces, and monitor 5xx rate because it represents server reliability.",
        ),
        q(
          "How do you design clean REST endpoints?",
          "Use plural resource nouns, stable identifiers, relationships only where useful, query parameters for filtering, and standard methods. Avoid action-heavy URLs unless the action truly is not CRUD-like.",
          "I prefer `/orders/{id}/items` over `/getOrderItems`. For a real command, `/orders/{id}/cancellation` can be clearer than forcing it into a vague update. I design consistent pagination, errors, versioning, and authorization across all endpoints.",
        ),
        q(
          "How do you version a REST API?",
          "Common approaches include a path such as `/v1`, a media type or Accept header, and occasionally query parameters. Version only for breaking contract changes and keep old versions observable and intentionally retired.",
          "I usually choose path versioning because it is explicit and operationally simple. I prefer additive compatible changes first, publish deprecation timelines, and test both versions during migration.",
        ),
        q(
          "What is content negotiation?",
          "The client describes acceptable response formats with `Accept`, and the request body format with `Content-Type`. The server selects a supported representation or returns an appropriate error such as 406 or 415.",
          "JSON is the default in most APIs, but I still treat media types as part of the contract. Content-Type says what I sent; Accept says what I can receive.",
        ),
        q(
          "What are safe and idempotent HTTP methods?",
          "Safe methods are intended not to change server state—GET, HEAD, OPTIONS, and TRACE by specification. Idempotent methods may change state, but repeating them has the same intended effect: PUT and DELETE join the safe methods in that category.",
          "All safe methods are idempotent, but not all idempotent methods are safe. PUT changes state but repeated identical PUTs converge on the same state. Logging and metrics may still occur; ‘safe’ refers to requested resource semantics.",
        ),
        q(
          "How do authentication and authorization differ?",
          "Authentication proves who the caller is. Authorization decides what that identity may do to a particular resource. A valid token solves authentication but does not automatically grant resource access.",
          "I authenticate once at the security boundary, then authorize every sensitive operation using roles, permissions, ownership, tenant, and resource context. This distinction matters especially for multi-tenant and file APIs.",
        ),
        q(
          "How would you add pagination to an API?",
          "Offset pagination is simple and supports page numbers, but large offsets get expensive and concurrent inserts can shift results. Cursor pagination uses a stable ordered key and scales better for feeds, but random page jumps are harder.",
          "For admin tables I may use offset with a capped page size. For large or frequently changing datasets I use a signed cursor based on a deterministic order such as createdAt plus ID. The response includes next cursor and limit.",
        ),
      ],
    },
  ],
};
