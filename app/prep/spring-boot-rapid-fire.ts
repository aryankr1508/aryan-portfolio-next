import { PrepSection, q } from "./prep-types";

function rapid(
  question: string,
  quick: string,
  idea: string,
  interview: string,
  options: Parameters<typeof q>[3] = {},
) {
  return q(question, idea, interview, { quick, ...options });
}

export const springBootRapidFireSection: PrepSection = {
  label: "🎥 Spring Boot rapid-fire — 50 transcript questions",
  questions: [
    rapid(
      "What is an IoC container, and what are beans?",
      "The IoC container is the part of Spring that creates, configures, connects, and manages application objects. Those managed objects are called beans.",
      "Without Spring, a service might construct its own repository, HTTP client, and mapper with `new`. That makes the service responsible for both business work and assembling its dependencies. With Inversion of Control, the service only declares what it needs. Spring's `ApplicationContext` creates the object graph and manages each bean according to its configuration and scope.",
      "The IoC container manages the lifecycle and dependencies of Spring beans. A bean is simply an object registered with that container. I declare dependencies, usually through constructors, and the container supplies them instead of the class constructing concrete collaborators itself.",
      {
        example: "Think of a restaurant kitchen. A chef asks for ingredients and tools; the kitchen system prepares and supplies them. The chef does not manufacture every tool before cooking.",
        code: `@Service
class OrderService {
    private final OrderRepository orders;

    OrderService(OrderRepository orders) {
        this.orders = orders;
    }
}`,
      },
    ),
    rapid(
      "What is autowiring?",
      "Autowiring is Spring resolving a bean's dependency and injecting a matching bean from the container.",
      "Spring normally resolves constructor parameters by type. If exactly one `PaymentGateway` bean exists, it can inject it automatically. If several implementations exist, use `@Qualifier`, `@Primary`, or inject a collection of strategies. A single constructor does not need `@Autowired` in modern Spring.",
      "Autowiring connects beans in the application context. I prefer constructor injection because required dependencies are explicit, fields can be final, and the class can be tested without starting Spring.",
      {
        trap: "The transcript demonstrates field injection with `@Autowired`, but constructor injection is the production-friendly default. Field injection hides required dependencies and makes plain unit tests harder.",
      },
    ),
    rapid(
      "What is the difference between @Component and @Bean?",
      "`@Component` marks a class for component scanning. `@Bean` marks a factory method whose returned object should be managed by Spring.",
      "Use `@Component` or a specialized stereotype such as `@Service` when you own the class and component scanning is appropriate. Use `@Bean` when construction needs explicit logic, configuration values, or a third-party class you cannot annotate. `@Bean` methods are commonly placed in `@Configuration` classes.",
      "Both register beans, but at different locations: `@Component` is class-level discovery; `@Bean` is method-level explicit construction. I often use `@Bean` for SDK clients and ObjectMapper configuration.",
      {
        code: `@Configuration
class ClientConfiguration {
    @Bean
    PaymentClient paymentClient(PaymentProperties properties) {
        return new PaymentClient(properties.baseUrl(), properties.apiKey());
    }
}`,
        trap: "`@Bean` can technically appear in a non-`@Configuration` component, called lite mode. `@Configuration` is preferred when full configuration semantics and inter-bean method interception matter.",
      },
    ),
    rapid(
      "What are the important differences between Spring and Spring Boot?",
      "Spring is the broader application framework. Spring Boot adds opinionated auto-configuration, starter dependencies, embedded servers, externalized configuration, and production tooling.",
      "With plain Spring, developers traditionally wire more infrastructure themselves and deploy to an external server. Boot examines the classpath and configuration, supplies sensible defaults, and can package a standalone application with embedded Tomcat. It also makes H2 and other databases easy to configure, but plain Spring can use them too.",
      "Spring Boot sits on top of Spring and removes setup work. It gives auto-configuration, starters, embedded servers, and Actuator while still letting me override defaults. The business code still uses normal Spring concepts.",
      {
        trap: "Do not say plain Spring cannot use Tomcat or H2. It can; Boot simply configures and packages these integrations more conveniently.",
      },
    ),
    rapid(
      "Which annotations are combined by @SpringBootApplication?",
      "`@SpringBootApplication` combines Boot configuration, auto-configuration, and component scanning.",
      "More precisely, it is meta-annotated with `@SpringBootConfiguration`, `@EnableAutoConfiguration`, and `@ComponentScan`. `@SpringBootConfiguration` is itself a specialized `@Configuration`. It does not directly include `@Component`.",
      "`@SpringBootApplication` is the usual main-class annotation. It marks the primary configuration, turns on conditional auto-configuration, and scans the package tree for application components.",
      {
        code: `@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`,
      },
    ),
    rapid(
      "What is the purpose of @EnableAutoConfiguration?",
      "It tells Spring Boot to add configuration that matches the libraries, properties, and beans present in the application.",
      "Auto-configuration classes use conditions such as ‘this class is on the classpath’ and ‘the application has not supplied its own bean.’ With the web starter present, Boot configures the MVC infrastructure and embedded server. With JDBC and database properties present, it can configure a DataSource.",
      "Auto-configuration is conditional, not magic. Boot contributes sensible infrastructure based on the classpath and environment, and it backs off when I provide my own configuration.",
      {
        trap: "Adding a database dependency is not always enough. Boot also needs usable connection properties or an embedded database, and production credentials must come from secure external configuration.",
      },
    ),
    rapid(
      "What is the purpose of @ComponentScan?",
      "It searches configured packages for component classes and registers them as bean definitions.",
      "By default, `@SpringBootApplication` scans from the package containing the main class downward. That is why the main class is normally placed in a root package. The scan discovers `@Component`, `@Service`, `@Repository`, `@Controller`, `@Configuration`, and other component stereotypes.",
      "`@ComponentScan` finds application components and registers them with the container. If a bean is unexpectedly missing, I first check whether its package is under the scan root and whether its conditions or profile are active.",
      {
        trap: "`@Bean` methods are processed because their containing configuration class is registered; component scanning does not independently scan every arbitrary method in the project.",
      },
    ),
    rapid(
      "Why is the main class also a configuration class?",
      "Because `@SpringBootApplication` includes `@SpringBootConfiguration`, the main class can declare `@Bean` methods and import other configuration.",
      "The main class is the application's primary configuration source. Small applications may place a few bean definitions there, but larger projects usually keep it thin and move related beans into focused configuration classes such as SecurityConfiguration or ClientConfiguration.",
      "The main class is a valid configuration class because of the meta-annotations behind `@SpringBootApplication`. I keep it as the application entry point and organize substantial bean configuration by concern.",
    ),
    rapid(
      "How do @Entity, @Table, @Id, and @Column work?",
      "`@Entity` marks a persistent class, `@Table` customizes its table mapping, `@Id` marks its primary key, and `@Column` customizes a field or property mapping.",
      "`@Entity` and `@Table` are class-level annotations. `@Id` is applied to the identifier field or getter. `@Column` is optional when the default column name and behavior are acceptable. The entity also needs a no-argument constructor for provider use and should not be exposed directly as an API request model.",
      "An entity represents persistent identity. I use `@Table` and `@Column` only where I need to override conventions, and I keep DTOs separate so clients cannot control persistence-only fields.",
      {
        code: `@Entity
@Table(name = "orders")
class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;
}`,
      },
    ),
    rapid(
      "Why is DispatcherServlet called Spring MVC's front controller?",
      "Every Spring MVC request reaches DispatcherServlet, which coordinates routing to the correct controller and producing the response.",
      "DispatcherServlet consults HandlerMapping to find a controller method, uses a HandlerAdapter to invoke it, coordinates argument binding and validation, and then either resolves a view or writes the response through an HttpMessageConverter. Controller advice can translate failures on the way out.",
      "DispatcherServlet is the front controller: one central entry point coordinates the MVC request lifecycle before and after my controller method.",
      {
        example: "For `GET /orders/42`, DispatcherServlet finds the mapped controller method, resolves `42` into a method argument, invokes the method, and lets Jackson serialize the returned DTO.",
      },
    ),
    rapid(
      "Which important components work with DispatcherServlet?",
      "HandlerMapping, HandlerAdapter, MultipartResolver, LocaleResolver, ViewResolver, exception resolvers, and HttpMessageConverters all support different parts of the MVC flow.",
      "HandlerMapping finds the endpoint. HandlerAdapter knows how to invoke it. MultipartResolver parses multipart uploads. LocaleResolver determines locale. ViewResolver maps logical view names to templates. HttpMessageConverters handle bodies such as JSON. HandlerExceptionResolvers and controller advice translate errors.",
      "I would name HandlerMapping for routing, HandlerAdapter for invocation, MultipartResolver for uploads, LocaleResolver for localization, ViewResolver for rendered views, and message converters for JSON or XML bodies.",
      {
        trap: "A ViewResolver does not normally convert a REST object to JSON. Jackson JSON serialization is performed through an `HttpMessageConverter`.",
      },
    ),
    rapid(
      "Why is @RestController equivalent to @Controller plus @ResponseBody?",
      "`@RestController` marks a controller whose handler return values are written to the HTTP response body by default.",
      "A plain `@Controller` usually treats a returned String as a logical view name unless the method also has `@ResponseBody`. `@RestController` applies response-body semantics to every method. Jackson typically converts returned Java objects to JSON through a message converter.",
      "`@RestController` is `@Controller` plus class-level `@ResponseBody`. I use it for APIs; I use `@Controller` when returning server-rendered views.",
      {
        trap: "A REST controller can return JSON, XML, text, or another supported representation. JSON is common, not an absolute requirement.",
      },
    ),
    rapid(
      "What are Spring bean scopes?",
      "A bean scope defines how many instances Spring creates and how long each instance lives.",
      "The default singleton scope creates one instance per ApplicationContext. Prototype creates a new instance each time the container is asked for it. Request creates one per HTTP request; session creates one per HTTP session. Websocket and application scopes also exist in web applications.",
      "Most services are stateless singleton beans. I use request or session scope only for genuinely scoped state, and I remember that prototype destruction is not fully managed after Spring hands the instance to the caller.",
      {
        trap: "Prototype, request, and session do not simply mean ‘lazy singleton alternatives.’ Their creation and lifecycle follow their individual scope rules.",
      },
    ),
    rapid(
      "Where do you define environment-specific properties in Spring Boot?",
      "Common sources are `application.properties`, `application.yml`, profile-specific files, environment variables, command-line arguments, and external configuration systems.",
      "Boot combines these sources into its Environment with defined precedence. Shared defaults can live in `application.yml`; environment-specific values can use `application-dev.yml` or deployment environment variables. Secrets should come from a secret manager or protected environment configuration, not committed files.",
      "I keep safe defaults in application configuration and inject environment-specific values at deployment. I prefer typed `@ConfigurationProperties` and never commit production secrets.",
    ),
    rapid(
      "Which dependencies provide common Spring, JPA, and Lombok annotations?",
      "Spring stereotypes come from Spring Framework modules, persistence annotations come from Jakarta Persistence, and Lombok annotations come from Lombok. Starters bring compatible groups of those libraries transitively.",
      "`@Component`, `@Service`, and `@Autowired` come from Spring Framework modules commonly pulled in by Boot starters. `@SpringBootApplication` comes from Spring Boot auto-configuration. `@Entity` and `@Id` are Jakarta Persistence annotations typically brought by `spring-boot-starter-data-jpa`. `@Data` and `@Getter` come from Lombok.",
      "I map annotations to the library that owns them, not only to the starter that happened to pull them in. Starters are dependency bundles; the annotation classes still live in Spring, Jakarta Persistence, or Lombok packages.",
      {
        trap: "Saying every Spring annotation comes specifically from `spring-boot-starter-web` is imprecise. For example, a non-web Spring application can still use `@Component` and dependency injection.",
      },
    ),
    rapid(
      "What is Spring Boot Actuator?",
      "Actuator adds production-oriented health, metrics, information, and management capabilities to a Spring Boot application.",
      "After adding the Actuator starter, endpoints can expose health, metrics, mappings, loggers, and other operational data. Micrometer connects metrics to systems such as Prometheus. Exposure and security must be configured deliberately because some endpoints reveal sensitive application information.",
      "I use Actuator for readiness and liveness health, JVM and HTTP metrics, and operational diagnostics. I expose only the endpoints the platform needs and protect anything sensitive.",
      {
        trap: "The standard paths are such as `/actuator/health` and `/actuator/metrics`. Individual metrics are requested like `/actuator/metrics/system.cpu.usage`.",
      },
    ),
    rapid(
      "Which property changes the default application port?",
      "Set `server.port`, for example `server.port=8081`.",
      "The value can live in a properties/YAML file, an environment variable such as `SERVER_PORT`, or a command-line argument. External configuration can override a packaged default without rebuilding the application.",
      "I change the embedded HTTP port with `server.port`. In container platforms I usually keep the application port consistent and configure routing at the service or ingress layer.",
      {
        code: `server.port=8081`,
        language: "properties",
      },
    ),
    rapid(
      "What is the main purpose of Spring profiles?",
      "Profiles activate selected beans and configuration for a particular environment or operating mode.",
      "A development profile might use a local fake integration while production uses a real provider. Profile-specific files can override values, and `@Profile` can conditionally register beans. Too many profile branches make behavior difficult to test, so business logic should not split by environment unnecessarily.",
      "I use profiles for genuine infrastructure differences such as local, test, and production integrations. Secrets and ordinary environment values still come from external configuration.",
    ),
    rapid(
      "Which property activates a Spring profile?",
      "Use `spring.profiles.active`, such as `spring.profiles.active=dev`.",
      "The active profile can be supplied through a file, environment variable `SPRING_PROFILES_ACTIVE`, JVM/system configuration, or the command line. In production, deployment configuration normally selects it rather than hard-coding `prod` inside the artifact.",
      "The standard property is `spring.profiles.active`. I normally let the deployment environment set it so the same artifact moves across environments.",
      {
        code: `spring.profiles.active=dev`,
        language: "properties",
      },
    ),
    rapid(
      "Can a Spring Boot application connect to multiple databases?",
      "Yes. Configure a separate DataSource and persistence infrastructure for each database.",
      "Each relational database normally needs its own properties, DataSource, EntityManagerFactory, transaction manager, entity packages, and repository packages. One set may be marked `@Primary`. A transaction manager controls its own resource; a normal `@Transactional` annotation does not automatically make two databases commit atomically.",
      "Yes. I create qualified DataSources and separate JPA configuration for each repository group. I also make transaction ownership explicit because cross-database consistency is a separate design problem.",
      {
        trap: "Listing two connection URLs alone is not a complete multi-database setup. Boot's single-database auto-configuration needs to be supplemented or replaced with explicit configuration.",
      },
    ),
    rapid(
      "What is Spring Boot's default embedded server for the web starter?",
      "For the traditional servlet web starter, the default embedded server is Tomcat.",
      "`spring-boot-starter-web` includes Tomcat by default. It can be excluded and replaced with Jetty or Undertow where supported. Reactive `spring-boot-starter-webflux` uses Reactor Netty by default, so the answer depends on the web stack.",
      "Tomcat is the default for the Spring MVC web starter. I can replace it through dependency exclusions, and I would not give the same answer for a WebFlux application.",
    ),
    rapid(
      "What is a context path, and how do you configure it?",
      "The context path is a prefix applied to the application's servlet endpoints, configured with `server.servlet.context-path`.",
      "If the context path is `/inventory`, an endpoint mapped to `/products` is served under `/inventory/products`. It affects the servlet application as a whole. Many production systems instead keep the app at `/` and let an API gateway or ingress provide external path prefixes.",
      "For a servlet application I set `server.servlet.context-path=/inventory`. I use it only when the entire application genuinely belongs under one base path.",
      {
        code: `server.servlet.context-path=/inventory`,
        language: "properties",
      },
    ),
    rapid(
      "Can you exclude a particular auto-configuration class?",
      "Yes. Use the `exclude` attribute of `@SpringBootApplication` or `@EnableAutoConfiguration`, or the relevant exclusion property.",
      "Exclusion is useful when a classpath dependency triggers configuration the application does not want—for example a DataSource when the application is not using one. Before excluding, inspect the condition report and understand why the auto-configuration matched.",
      "I can exclude an auto-configuration class explicitly, but I first verify the condition report. Often defining the correct bean or removing an accidental dependency is cleaner.",
      {
        code: `@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
class Application {}`,
      },
    ),
    rapid(
      "What is Spring Boot's default REST serialization format?",
      "Spring Boot commonly returns JSON for REST objects using Jackson when the web starter and Jackson are present.",
      "The real mechanism is content negotiation plus HttpMessageConverters. Jackson's converter usually handles JSON, but the final representation also depends on the request's `Accept` header and the converters on the classpath. Other formats can be configured.",
      "JSON through Jackson is the conventional default for Spring Boot REST APIs. More precisely, Spring MVC selects an appropriate message converter through content negotiation.",
    ),
    rapid(
      "What is the default JPA provider used by Spring Boot's Data JPA starter?",
      "Hibernate is the default JPA implementation included by `spring-boot-starter-data-jpa`.",
      "JPA/Jakarta Persistence is the specification; Hibernate ORM is the implementation that performs mapping, dirty checking, SQL generation, and persistence-context behavior. Another provider can be configured, but Hibernate is Boot's normal default.",
      "Spring Data JPA provides repository abstractions, JPA defines the persistence contract, and Hibernate is the default provider executing that contract.",
    ),
    rapid(
      "What does @GeneratedValue do?",
      "It tells the persistence provider how an entity's primary-key value should be generated.",
      "Strategies include IDENTITY, SEQUENCE, TABLE, and AUTO. The best choice depends on the database and batching needs. IDENTITY often relies on an insert to obtain the ID; SEQUENCE can allocate identifiers before insert and can batch more effectively.",
      "`@GeneratedValue` defines identifier generation, not a generic column default. I choose the strategy based on the database and workload rather than using one blindly.",
      {
        code: `@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
@SequenceGenerator(name = "order_seq", sequenceName = "order_seq", allocationSize = 50)
private Long id;`,
      },
    ),
    rapid(
      "What is the relationship between JPA and Spring Data JPA?",
      "Spring Data JPA builds repository and query abstractions on top of JPA; it does not replace the JPA specification.",
      "JPA provides concepts such as EntityManager, persistence context, entities, and JPQL. Spring Data JPA generates repository implementations, derived queries, paging, specifications, and other conveniences while still using JPA underneath.",
      "JPA is the persistence API and contract. Spring Data JPA reduces repository boilerplate on top of it. Hibernate is commonly the provider underneath both.",
    ),
    rapid(
      "What is the difference between JpaRepository and EntityManager?",
      "`JpaRepository` is a Spring Data repository abstraction; `EntityManager` is the core JPA interface for persistence-context operations.",
      "JpaRepository offers generated CRUD, paging, sorting, and declared queries with little code. EntityManager gives lower-level control over persist, merge, remove, flush, locking, and custom JPQL. A repository implementation ultimately uses JPA infrastructure such as EntityManager.",
      "I use repositories for ordinary aggregate queries and persistence. I use EntityManager directly when a use case needs lower-level JPA control that a focused repository method cannot express cleanly.",
    ),
    rapid(
      "What is the main purpose of Lombok in a Spring Boot project?",
      "Lombok generates repetitive Java code such as getters, constructors, builders, equals, hashCode, and logging fields at compile time.",
      "It can make DTOs and configuration classes shorter, but generated behavior is still part of the class's design. On JPA entities, broad annotations can create unsafe equality, recursive toString output, or setters for fields that should be protected.",
      "Lombok reduces boilerplate; it is not a Spring feature or dependency-injection tool. I use narrow annotations deliberately and avoid hiding important domain behavior.",
      {
        trap: "Java records are often a clearer alternative for immutable DTOs. Lombok should not automatically be added to every class.",
      },
    ),
    rapid(
      "Which Lombok annotation generates getters and setters for all fields?",
      "`@Data` includes getters for all fields, setters for non-final fields, and also generates equals, hashCode, toString, and a required-arguments constructor.",
      "`@Data` is more than `@Getter` plus `@Setter`. That extra behavior can be convenient for a simple mutable DTO but risky for entities and domain objects. Use individual annotations when you do not want the full bundle.",
      "`@Data` generates getters and setters, but I mention its other generated methods too. For JPA entities I usually prefer explicit or narrow Lombok annotations.",
    ),
    rapid(
      "What is the correct syntax for injecting a property with @Value?",
      "Use a placeholder such as `@Value(\"${app.timeout}\")`.",
      "`${...}` resolves a property from the Spring Environment. A default can be supplied after a colon, such as `${app.timeout:5s}`. `#{...}` is Spring Expression Language, which is related but serves a different purpose.",
      "For one small value I can use `@Value(\"${property.name}\")`. For a related configuration group I prefer validated `@ConfigurationProperties`.",
      {
        code: `@Value("\${app.timeout:5s}")
private Duration timeout;`,
        trap: "`${...}` is a property placeholder; `#{...}` is a Spring Expression Language expression. Do not confuse them.",
      },
    ),
    rapid(
      "How do @Value and @ConfigurationProperties differ?",
      "`@Value` injects individual expressions or properties. `@ConfigurationProperties` binds a related property group into a typed object.",
      "Configuration properties scale better for several related values, support metadata, relaxed binding, constructor/record binding, and Bean Validation. `@Value` is convenient for one-off values and SpEL but becomes scattered and stringly typed when overused.",
      "I use `@Value` for an isolated property and `@ConfigurationProperties` for a cohesive configuration model such as payment URL, timeout, retry count, and credentials reference.",
      {
        code: `@ConfigurationProperties("payment")
@Validated
record PaymentProperties(
    @NotBlank String baseUrl,
    @NotNull Duration timeout
) {}`,
      },
    ),
    rapid(
      "What is the purpose of pagination in Spring Data JPA?",
      "Pagination retrieves a bounded slice of a large result set instead of loading every matching row.",
      "A repository can accept `Pageable` and return `Page<T>` with content plus total-count metadata, or `Slice<T>` when only next-page information is needed. Always use a stable order. For very large or changing datasets, keyset/cursor pagination may outperform deep offsets.",
      "Pagination protects memory, response size, and database work. I cap page size, define deterministic sorting, and choose Page, Slice, or cursor pagination based on whether total count and random page access are required.",
    ),
    rapid(
      "Which interface represents pagination requests in Spring Data?",
      "`Pageable` represents page number, page size, and sort information.",
      "`PageRequest` is a common implementation created with `PageRequest.of(page, size, sort)`. Repositories can accept Pageable and return Page or Slice results. Controller parameters must be bounded so a caller cannot request millions of records.",
      "The interface is `Pageable`; `PageRequest` is the usual concrete implementation.",
      {
        code: `Pageable pageable = PageRequest.of(
    0,
    25,
    Sort.by(Sort.Direction.DESC, "createdAt")
);`,
      },
    ),
    rapid(
      "Which Spring Data type is used for sorting?",
      "`Sort` describes one or more ordered properties and their directions.",
      "Sort can stand alone in repository methods or be included in Pageable. Multiple fields create deterministic ordering—for example createdAt descending and ID descending so rows with the same timestamp remain stable.",
      "I use `Sort`, often through `Sort.by(...)`, and I validate client-provided sort fields against an allowlist rather than passing arbitrary property names through.",
    ),
    rapid(
      "What is the difference between servlet filters and Spring MVC interceptors?",
      "Filters belong to the Servlet API and run around requests before they reach DispatcherServlet. Interceptors belong to Spring MVC and run around a selected controller handler.",
      "Filters can wrap raw request/response objects and apply to non-MVC traffic, making them suitable for security chains, correlation IDs, and low-level HTTP concerns. Interceptors know the chosen HandlerMethod and are useful for handler-aware timing or contextual checks.",
      "A filter is container-level and sits outside DispatcherServlet. An interceptor is MVC-level and sits between DispatcherServlet and the controller. I choose the narrowest layer that has the context I need.",
    ),
    rapid(
      "Which interceptor method runs before the controller?",
      "`preHandle` runs after a handler is selected but before the controller method is invoked.",
      "It receives the request, response, and selected handler. Returning `true` continues the chain; returning `false` stops it because the interceptor has handled the response or rejected the request. Security is usually better handled by Spring Security filters.",
      "`preHandle` executes before the controller and can short-circuit by returning false. I use it sparingly for MVC-specific cross-cutting behavior.",
    ),
    rapid(
      "Which interceptor method runs after request completion?",
      "`afterCompletion` runs after the request has completed, including view rendering, and receives any exception that escaped handling.",
      "`postHandle` runs after the controller but before view rendering and may not run when the controller throws. `afterCompletion` is the cleanup callback once processing is complete. In asynchronous MVC flows, lifecycle behavior also involves `afterConcurrentHandlingStarted`.",
      "`afterCompletion` is the final interceptor callback for cleanup. `postHandle` is earlier—after controller execution but before the response lifecycle is fully complete.",
    ),
    rapid(
      "What is the main purpose of a Spring MVC interceptor?",
      "It applies handler-aware logic before and after mapped controller methods.",
      "Because an interceptor can inspect HandlerMethod metadata, it suits concerns such as request timing, locale changes, audit context, or custom annotations. It should not contain domain business logic, and it is not the usual place for authentication when Spring Security already provides a mature filter chain.",
      "An interceptor surrounds MVC handler execution. I use it when the concern needs to know which controller method was selected; otherwise a filter or controller advice may be the better boundary.",
    ),
    rapid(
      "What is the request order among filters, DispatcherServlet, interceptors, and controllers?",
      "The incoming order is filter → DispatcherServlet → interceptor `preHandle` → controller.",
      "On the way out, the controller returns, interceptor callbacks run in reverse order, DispatcherServlet completes response handling, and the filter chain unwinds. Exception handling and asynchronous requests can add lifecycle detail, but the main ordering remains the same.",
      "A filter wraps the entire servlet request. Inside it, DispatcherServlet selects the handler, interceptors wrap that handler, and then the controller runs.",
      {
        code: `Client
  -> Filter
    -> DispatcherServlet
      -> Interceptor.preHandle
        -> Controller
      <- Interceptor.postHandle / afterCompletion
  <- Filter`,
        language: "text",
      },
    ),
    rapid(
      "What does @EnableWebSecurity do?",
      "It enables Spring Security's web-security configuration infrastructure, especially when defining explicit security configuration.",
      "In Spring Boot, adding the security starter already triggers security auto-configuration, so a basic secured application does not always need to add `@EnableWebSecurity` manually. Modern applications normally define a `SecurityFilterChain` bean to customize authorization and authentication.",
      "`@EnableWebSecurity` imports web-security configuration. With Boot, security auto-configuration already activates sensible defaults; I define a SecurityFilterChain when customizing the application.",
      {
        code: `@Bean
SecurityFilterChain security(HttpSecurity http) throws Exception {
    return http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/actuator/health").permitAll()
            .anyRequest().authenticated())
        .build();
}`,
        trap: "Older answers often extend `WebSecurityConfigurerAdapter`; it has been deprecated and removed from the recommended modern style.",
      },
    ),
    rapid(
      "What authentication mechanism does Spring Security configure by default?",
      "With Spring Boot's default security auto-configuration, a generated user is protected through form login or HTTP Basic depending on the request and content negotiation.",
      "A browser requesting HTML is typically shown a login form, while a non-browser client can receive an HTTP Basic challenge. This development default is not a production identity design. Real applications configure users, password encoding, sessions, OAuth2, or token validation deliberately.",
      "The nuanced answer is form login and HTTP Basic are auto-configured. Content negotiation determines the entry point. I would not describe the default generated user as a production authentication solution.",
      {
        trap: "Answering only ‘Basic authentication’ is a common rapid-fire simplification. Modern Boot security can choose form login for browser traffic.",
      },
    ),
    rapid(
      "What is the difference between authentication and authorization?",
      "Authentication proves who the caller is; authorization decides what that caller may do.",
      "A valid password, session, client certificate, or token establishes identity. The application must still check roles, scopes, ownership, tenant membership, and resource-level permissions. A valid JWT does not mean the user may read every file.",
      "Authentication answers ‘who are you?’ Authorization answers ‘are you allowed to perform this action on this resource?’ I enforce both on the server.",
    ),
    rapid(
      "Which stateless authentication approach is commonly used with Spring Security APIs?",
      "Bearer tokens—often JWT access tokens—are commonly used for stateless API authentication.",
      "The client sends the token with each request. A resource server validates signature, issuer, audience, and expiry, then converts claims or scopes into authorities. JWT is a token format, not the same thing as OAuth, and revocation or stale permissions still need a design.",
      "For a stateless API I commonly configure Spring Security as an OAuth2 resource server that validates bearer JWTs. I keep tokens short-lived, validate their intended audience, and perform fresh resource authorization.",
      {
        trap: "HTTP Basic can also be stateless because credentials accompany every request. JWT is common, but it is not the only stateless mechanism.",
      },
    ),
    rapid(
      "Which annotation enables Spring's caching abstraction?",
      "Use `@EnableCaching` on a configuration class.",
      "It registers infrastructure that detects cache annotations such as `@Cacheable`, `@CachePut`, and `@CacheEvict`. A CacheManager still determines the underlying provider and cache behavior. Proxy-based interception means self-invocation can bypass caching just as it can bypass transactions.",
      "`@EnableCaching` turns on annotation-driven caching. I then configure an appropriate CacheManager and make key, TTL, size, and invalidation decisions explicitly.",
    ),
    rapid(
      "Which annotation caches a method's result?",
      "`@Cacheable` returns a cached value when the key exists and stores the method result on a miss.",
      "`@CachePut` always runs the method and updates the cache. `@CacheEvict` removes entries. Cache keys should include every input that changes the result, including tenant or permission context where relevant. Do not cache errors or sensitive cross-user data accidentally.",
      "`@Cacheable` implements cache-aside around a method. I define a stable key and pair reads with explicit eviction or update when the source of truth changes.",
      {
        code: `@Cacheable(cacheNames = "products", key = "#tenantId + ':' + #productId")
public ProductDto findProduct(String tenantId, long productId) {
    return repository.findDto(tenantId, productId)
        .orElseThrow(ProductNotFoundException::new);
}`,
      },
    ),
    rapid(
      "What cache does Spring Boot use when no provider is configured?",
      "If caching is enabled and no supported cache library or explicit CacheManager is present, Boot can fall back to a simple in-memory concurrent-map cache.",
      "The simple provider stores data inside one application instance. It has limited production features, does not share entries across replicas, and is lost on restart. Caffeine is a stronger local cache; Redis or another distributed provider can share data across instances.",
      "The fallback is a simple in-memory `ConcurrentMap`-based cache. It is fine for development or small local use, but production needs explicit size, expiry, observability, and consistency choices.",
    ),
    rapid(
      "How do @EnableScheduling and the @Scheduled options work?",
      "`@EnableScheduling` activates scheduled-method processing. `@Scheduled` can use fixed rate, fixed delay, an initial delay, or a cron expression.",
      "Fixed rate measures between planned start times and can attempt the next run based on that cadence. Fixed delay waits the configured time after the previous execution completes. Cron runs at matching calendar times and should declare the intended time zone. Scheduled methods need idempotency and overlap control in multi-instance deployments.",
      "`fixedRate` is start-to-start cadence; `fixedDelay` waits after completion; `cron` follows a calendar expression. In a cluster, every instance may run the same job unless I add leader election, a distributed lock, or use an external scheduler.",
      {
        code: `@EnableScheduling
@Configuration
class SchedulingConfiguration {}

@Scheduled(fixedDelayString = "\${cleanup.delay:PT5M}")
void removeExpiredUploads() { ... }

@Scheduled(cron = "0 0 2 * * *", zone = "UTC")
void nightlyReconciliation() { ... }`,
      },
    ),
    rapid(
      "What thread pool runs @Scheduled tasks by default?",
      "Spring Boot's auto-configured task scheduler uses one scheduling thread by default unless you configure a larger pool.",
      "With one thread, a long-running scheduled method delays other scheduled work. Configure `spring.task.scheduling.pool.size` or provide a TaskScheduler when tasks need safe parallelism. Increasing the pool also introduces overlap and thread-safety concerns.",
      "The default scheduler is effectively single-threaded. I size it only after understanding task duration and overlap, and I keep scheduled jobs idempotent because deployments and retries can cause repeated execution.",
      {
        code: `spring.task.scheduling.pool.size=4`,
        language: "properties",
      },
    ),
    rapid(
      "How would you define Spring Boot in three lines?",
      "Spring Boot is an opinionated layer on Spring that makes standalone, production-ready Java applications faster to build.",
      "It reduces manual setup through conditional auto-configuration and curated starters, runs with embedded servers, externalizes configuration, and adds operational tooling such as Actuator. It keeps the underlying Spring container, dependency injection, MVC, data, and security models available for customization.",
      "Spring Boot simplifies Spring application development with auto-configuration, starters, and sensible defaults. It can package an application with an embedded server and provides production capabilities such as health and metrics. I get a fast starting point without losing the ability to override Spring configuration.",
      {
        trap: "Do not define Boot as a code generator or as a replacement for Spring. It configures and packages Spring applications.",
      },
    ),
  ],
};
