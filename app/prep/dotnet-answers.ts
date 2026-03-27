export const dotnetAnswers: string[] = [
// 0: What is Dependency Injection (DI)?
`### One-Line Answer

DI means a class receives its dependencies from outside instead of creating them itself.

### The Problem — Without DI (Tight Coupling)

\`\`\`csharp
public class OrderController
{
    private WhatsAppService _service;

    public OrderController()
    {
        _service = new WhatsAppService();   // YOU create the dependency
    }
}
\`\`\`

If your boss says "switch to Email," you must change EVERY file that has \`new WhatsAppService()\`. That's tight coupling.

### The Solution — With DI (Loose Coupling)

**Step 1 — Create an Interface (the contract):**

\`\`\`csharp
public interface INotificationService
{
    void Send(string message);
}
\`\`\`

**Step 2 — Classes implement the Interface:**

\`\`\`csharp
public class WhatsAppService : INotificationService
{
    public void Send(string message) => Console.WriteLine($"WhatsApp: {message}");
}

public class EmailService : INotificationService
{
    public void Send(string message) => Console.WriteLine($"Email: {message}");
}
\`\`\`

**Step 3 — Controller depends on Interface, NOT the class:**

\`\`\`csharp
public class OrderController
{
    private readonly INotificationService _service;

    public OrderController(INotificationService service)
    {
        _service = service;
    }
}
\`\`\`

**Step 4 — Register in Program.cs (ONE place of control):**

\`\`\`csharp
builder.Services.AddScoped<INotificationService, WhatsAppService>();
\`\`\`

Now to switch to Email, change ONE line in ONE file. That's loose coupling.

### Interview Summary

- **WHAT:** Class receives dependencies from outside, doesn't create them itself.
- **WHY:** Solves tight coupling, makes testing easy, makes dependencies visible.
- **HOW:** Interface + Registration in Program.cs + Constructor Injection.`,

// 1: DI Lifetimes
`### One-Line Answer

Transient = new every time, Scoped = one per request, Singleton = one for entire app.

### The Analogy

- **Transient** = Disposable cup — a fresh new one every time someone asks.
- **Scoped** = A tray — one per customer visit, cleaned after they leave.
- **Singleton** = The restaurant building — only one exists, shared by everyone.

### Transient — \`AddTransient<T>()\`

\`\`\`csharp
builder.Services.AddTransient<INotificationService, EmailService>();
\`\`\`

A NEW object is created EVERY time it's requested. Even within the same HTTP request, if two classes ask for it, each gets a different instance.

**Use for:** Lightweight, stateless services (e.g., a formatter, a validator).

### Scoped — \`AddScoped<T>()\`

\`\`\`csharp
builder.Services.AddScoped<INotificationService, EmailService>();
\`\`\`

ONE object is created per HTTP request. All classes within the SAME request share the same instance.

**Use for:** Most services, especially DbContext (database connections).

### Singleton — \`AddSingleton<T>()\`

\`\`\`csharp
builder.Services.AddSingleton<INotificationService, EmailService>();
\`\`\`

ONE object is created for the ENTIRE application lifetime. Every request, every user gets the same instance.

**Use for:** Caching, configuration, logging — things that should exist once.

### Warning

Never inject a Scoped service into a Singleton — the Scoped service never gets disposed, causing memory leaks. ASP.NET Core throws an error in Development mode.

### Summary

| Lifetime | Created | Destroyed | Use For |
|----------|---------|-----------|---------|
| Transient | Every time requested | Immediately | Lightweight, stateless helpers |
| Scoped | Once per HTTP request | End of request | DbContext, most services |
| Singleton | Once for entire app | App shutdown | Cache, config, logging |`,

// 2: Constructor vs Property vs Method Injection
`### One-Line Answer

Constructor = at birth (95% use), Property = optional door, Method = only when needed.

### Constructor Injection — "Give it when I'm born"

\`\`\`csharp
public class OrderController
{
    private readonly INotificationService _service;

    public OrderController(INotificationService service)  // AT BIRTH
    {
        _service = service;
    }
}
\`\`\`

- Dependency is GUARANTEED — can never be null.
- ASP.NET Core supports this NATIVELY.
- Use this 95% of the time.

### Property Injection — "Give it after I'm born, through a door"

\`\`\`csharp
public class OrderController
{
    public INotificationService? NotificationService { get; set; }  // OPTIONAL

    public void PlaceOrder()
    {
        NotificationService?.Send("Order placed!");  // might be null!
    }
}
\`\`\`

- Dependency is OPTIONAL — class works without it.
- ASP.NET Core does NOT support this natively.
- Rarely used.

### Method Injection — "Give it only when I need it"

\`\`\`csharp
[HttpPost]
public IActionResult PlaceOrder([FromServices] INotificationService service)
{
    service.Send("Order placed!");
    return Ok();
}
\`\`\`

- Only methods that need it receive it.
- Use when only 1-2 methods out of many need the dependency.

### Decision Rule

- Class needs it for MOST work → Constructor Injection
- Dependency is completely optional → Property Injection
- Only ONE method needs it → Method Injection`,

// 3: Design Patterns
`### One-Line Answer

Proven, reusable solutions to common programming problems — like recipes.

### 1. Repository Pattern — "Middleman between code and database"

\`\`\`csharp
public interface IProductRepository
{
    List<Product> GetAll();
    Product GetById(int id);
    void Add(Product product);
}

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;
    public ProductRepository(AppDbContext context) => _context = context;
    public List<Product> GetAll() => _context.Products.ToList();
    public Product GetById(int id) => _context.Products.Find(id);
    public void Add(Product product) => _context.Products.Add(product);
}
\`\`\`

**Why?** Switch from SQL Server to MongoDB — only change the Repository, not the Controller.

### 2. Factory Pattern — "A class that creates objects for you"

\`\`\`csharp
public class NotificationFactory
{
    public INotificationService Create(string type) => type switch
    {
        "email" => new EmailService(),
        "sms"   => new SmsService(),
        _       => throw new ArgumentException("Unknown type")
    };
}
\`\`\`

**Why?** When object creation logic is complex or depends on conditions.

### 3. Singleton Pattern — "Only ONE instance can ever exist"

\`\`\`csharp
public class AppLogger
{
    private static AppLogger? _instance;
    private static readonly object _lock = new object();
    private AppLogger() { }

    public static AppLogger Instance
    {
        get { lock (_lock) { _instance ??= new AppLogger(); } return _instance; }
    }
    public void Log(string message) => Console.WriteLine($"[LOG] {message}");
}
\`\`\`

In ASP.NET Core, just use \`AddSingleton<T>()\` in DI instead.

### 4. Strategy Pattern — "Swap algorithms at runtime"

\`\`\`csharp
public interface IDiscountStrategy { decimal Calculate(decimal price); }
public class NoDiscount : IDiscountStrategy { public decimal Calculate(decimal price) => price; }
public class FestiveDiscount : IDiscountStrategy { public decimal Calculate(decimal price) => price * 0.8m; }
public class VIPDiscount : IDiscountStrategy { public decimal Calculate(decimal price) => price * 0.7m; }

public class ShoppingCart
{
    private readonly IDiscountStrategy _strategy;
    public ShoppingCart(IDiscountStrategy strategy) => _strategy = strategy;
    public decimal GetFinalPrice(decimal price) => _strategy.Calculate(price);
}
\`\`\`

**Why?** Multiple ways to do something — swap without modifying the core class.`,

// 4: Builder Pattern
`### One-Line Answer

Build a complex object step-by-step. Each method returns \`this\` so you can chain calls.

### The Pattern in Code

\`\`\`csharp
public class PizzaBuilder
{
    private Pizza _pizza = new();
    public PizzaBuilder SetBase(string b) { _pizza.Base = b; return this; }
    public PizzaBuilder SetSauce(string s) { _pizza.Sauce = s; return this; }
    public PizzaBuilder AddTopping(string t) { _pizza.Toppings.Add(t); return this; }
    public Pizza Build() => _pizza;
}

var pizza = new PizzaBuilder()
    .SetBase("Thin Crust")
    .SetSauce("Tomato")
    .AddTopping("Mushrooms")
    .Build();
\`\`\`

### How ASP.NET Core Uses It — Program.cs

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);  // Create the Builder

builder.Services.AddControllers();                  // Configure step by step
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();                          // BUILD the final app

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
\`\`\`

\`WebApplication.CreateBuilder(args)\` returns a \`WebApplicationBuilder\` which lets you configure services, logging, configuration step by step. Then \`.Build()\` creates the final \`WebApplication\`.`,

// 5: Abstract Class vs Interface
`### One-Line Answer

Interface = job contract (WHAT to do), Abstract class = partially-built template (some work done).

### Interface

\`\`\`csharp
public interface IAnimal
{
    void Speak();       // no body — just the rule
    void Eat();
}

public class Dog : IAnimal
{
    public void Speak() => Console.WriteLine("Woof!");
    public void Eat() => Console.WriteLine("Eats bones");
}
\`\`\`

- A class can implement MULTIPLE interfaces.
- No fields, no constructors.

### Abstract Class

\`\`\`csharp
public abstract class Animal
{
    public string Name { get; set; }
    public void Breathe() => Console.WriteLine($"{Name} is breathing");  // complete method
    public abstract void Speak();  // must be completed by child
}

public class Dog : Animal
{
    public override void Speak() => Console.WriteLine("Woof!");
}
\`\`\`

- A class can inherit ONLY ONE abstract class.
- Can have constructors, fields, access modifiers.

### Key Differences

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| Multiple inheritance | Yes (many interfaces) | No (only one class) |
| Methods with body | Only default (C# 8+) | Yes |
| Fields/Properties | No fields | Yes |
| Constructors | No | Yes |
| Use when | Defining a contract/capability | Sharing common base logic |

### When to Use

- **Interface:** Unrelated classes need the same capability. Example: \`IDisposable\`.
- **Abstract class:** Related classes share common logic. Example: \`Animal\` base for Dog, Cat, Bird.`,

// 6: SOLID Principles
`### One-Line Answer

5 principles that make code clean, maintainable, and flexible.

### S — Single Responsibility Principle

"A class should have only ONE reason to change."

\`\`\`csharp
// BAD — one class doing everything
public class Employee { void CalculateSalary(); void GenerateReport(); void SaveToDatabase(); }

// GOOD — each class does one thing
public class SalaryCalculator { public void Calculate() { } }
public class ReportGenerator { public void Generate() { } }
public class EmployeeRepository { public void Save() { } }
\`\`\`

### O — Open/Closed Principle

"Open for extension, closed for modification."

\`\`\`csharp
public interface IShape { double Area(); }
public class Circle : IShape { public double Radius; public double Area() => 3.14 * Radius * Radius; }
public class Square : IShape { public double Side; public double Area() => Side * Side; }
// Adding Rectangle = new class, no existing code changes
\`\`\`

### L — Liskov Substitution Principle

"A child class should be usable wherever its parent is expected."

\`\`\`csharp
// GOOD — separate the abilities
public interface IBird { void Eat(); }
public interface IFlyable { void Fly(); }
public class Sparrow : IBird, IFlyable { public void Eat() { } public void Fly() { } }
public class Penguin : IBird { public void Eat() { } }  // no Fly — no problem
\`\`\`

### I — Interface Segregation Principle

"Don't force a class to implement methods it doesn't use."

\`\`\`csharp
// GOOD — split into focused interfaces
public interface IWorkable { void Work(); }
public interface IEatable { void Eat(); }
public class Human : IWorkable, IEatable { /* both */ }
public class Robot : IWorkable { /* only Work */ }
\`\`\`

### D — Dependency Inversion Principle

"Depend on abstractions (interfaces), not concrete classes."

\`\`\`csharp
// GOOD
public class OrderController
{
    private readonly INotificationService _service;
    public OrderController(INotificationService service) => _service = service;
}
\`\`\``,

// 7: Program.cs in .NET 6+
`### One-Line Answer

Program.cs is the single entry point in .NET 6+ — replaces both old Program.cs and Startup.cs.

### .NET 6+ (New Way) — Minimal Hosting

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);

// SERVICES CONFIGURATION (was ConfigureServices)
builder.Services.AddControllers();
builder.Services.AddScoped<IProductService, ProductService>();

var app = builder.Build();

// MIDDLEWARE PIPELINE (was Configure)
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
\`\`\`

### What is WebApplication.CreateBuilder?

It creates a \`WebApplicationBuilder\` that pre-configures:

- **Configuration:** Reads appsettings.json, environment variables, command-line args
- **Logging:** Console, Debug, EventSource loggers
- **DI Container:** Ready to register services with \`builder.Services\`
- **Kestrel Web Server:** The default web server

Think of it as: "Set up everything a web app needs with sensible defaults, then let me customize."`,

// 8: Middleware Pipeline
`### One-Line Answer

A chain of checkpoints that every HTTP request passes through in ORDER.

### The Analogy

Imagine airport security — your request goes through multiple checkpoints:

Request → Logging → Authentication → Authorization → Routing → Controller → Response (back UP in reverse)

### In Code

\`\`\`csharp
var app = builder.Build();

// ORDER MATTERS
app.UseExceptionHandler("/error");  // 1st: catch any errors
app.UseHttpsRedirection();          // 2nd: redirect HTTP to HTTPS
app.UseStaticFiles();               // 3rd: serve CSS, JS, images
app.UseRouting();                   // 4th: figure out which endpoint
app.UseAuthentication();            // 5th: who are you?
app.UseAuthorization();             // 6th: are you allowed?
app.MapControllers();               // 7th: run the controller

app.Run();
\`\`\`

### Why Order Matters

\`\`\`csharp
// WRONG ORDER:
app.UseAuthorization();    // "Are they allowed?" — but we don't know WHO yet!
app.UseAuthentication();   // "Who are they?" — too late!

// CORRECT ORDER:
app.UseAuthentication();   // First: identify the user
app.UseAuthorization();    // Then: check permissions
\`\`\`

Each middleware can: process the request, pass it to next via \`next()\`, or SHORT-CIRCUIT (stop and respond immediately).`,

// 9: Short-circuiting in Middleware
`### One-Line Answer

Short-circuiting means a middleware STOPS the pipeline — it doesn't call \`next()\`.

### Example: Authentication Middleware

\`\`\`csharp
app.Use(async (context, next) =>
{
    var token = context.Request.Headers["Authorization"].ToString();

    if (string.IsNullOrEmpty(token))
    {
        // SHORT-CIRCUIT — stop here, don't call next()
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Unauthorized: No token provided");
        return;  // pipeline stops here
    }

    await next();  // token exists, let the request continue
});
\`\`\`

### What Happens

- **WITH valid token:** Request → Auth Middleware → (calls next()) → Controller → Response
- **WITHOUT token:** Request → Auth Middleware → STOPS HERE (401). Controller NEVER runs.

### Real-World Examples

- **Authentication:** No token → 401, stop.
- **Rate Limiting:** Too many requests → 429, stop.
- **Caching:** Response cached → return cached response, stop.
- **Static Files:** Request for style.css → return file, stop.`,

// 10: app.Use, app.Run, app.Map
`### One-Line Answer

Use = pass-through middleware, Run = terminal (ends pipeline), Map = branch by URL.

### app.Use — "Do something, then pass it along (or don't)"

\`\`\`csharp
app.Use(async (context, next) =>
{
    Console.WriteLine("Before next middleware");
    await next();  // calls the next middleware
    Console.WriteLine("After next middleware");
});
\`\`\`

Has access to \`next()\` — can choose to call it or not.

### app.Run — "Terminal. Pipeline ENDS here."

\`\`\`csharp
app.Run(async context =>
{
    await context.Response.WriteAsync("Pipeline ends here!");
    // NO next() — this is the last stop
});
\`\`\`

Does NOT have \`next()\` — always short-circuits.

### app.Map — "Branch the pipeline based on URL path"

\`\`\`csharp
app.Map("/api", apiApp =>
{
    apiApp.Run(async context =>
        await context.Response.WriteAsync("You hit the API branch"));
});

app.Map("/health", healthApp =>
{
    healthApp.Run(async context =>
        await context.Response.WriteAsync("Healthy!"));
});
\`\`\`

### Visual Summary

- **app.Use:** Request → [Do something] → next() → [Do more] → Response
- **app.Run:** Request → [Do something] → STOP (no next)
- **app.Map:** Request → /api? → YES → [API pipeline] / NO → [Normal pipeline]`,

// 11: Custom Middleware
`### One-Line Answer

Create a class with \`InvokeAsync(HttpContext)\` that calls \`_next(context)\`.

### Method 1 — Inline (Quick)

\`\`\`csharp
app.Use(async (context, next) =>
{
    var start = DateTime.Now;
    await next();
    var duration = DateTime.Now - start;
    Console.WriteLine($"Request took {duration.TotalMilliseconds}ms");
});
\`\`\`

### Method 2 — Separate Class (Production-Ready)

\`\`\`csharp
public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestTimingMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        await _next(context);
        stopwatch.Stop();
        Console.WriteLine($"{context.Request.Path} took {stopwatch.ElapsedMilliseconds}ms");
    }
}

// Extension method for clean registration
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseRequestTiming(this IApplicationBuilder builder)
        => builder.UseMiddleware<RequestTimingMiddleware>();
}

// Program.cs
app.UseRequestTiming();
\`\`\`

The class-based approach is preferred — reusable, testable, follows SRP.`,

// 12: ref vs out
`### One-Line Answer

ref = two-way (must initialize before), out = one-way out (method must assign).

### ref — "I'll give you a value. You can change it."

\`\`\`csharp
void Double(ref int number)
{
    number = number * 2;
}

int x = 5;       // MUST be initialized before passing
Double(ref x);
Console.WriteLine(x);  // 10
\`\`\`

### out — "I don't have a value. You MUST give me one."

\`\`\`csharp
void GetFullName(string first, string last, out string fullName)
{
    fullName = $"{first} {last}";  // MUST assign before method ends
}

string result;  // does NOT need to be initialized
GetFullName("John", "Doe", out result);
Console.WriteLine(result);  // "John Doe"
\`\`\`

### Real-World Example: TryParse

\`\`\`csharp
if (int.TryParse("123", out int number))
    Console.WriteLine($"Parsed: {number}");  // 123
\`\`\`

### Summary

| Feature | ref | out |
|---------|-----|-----|
| Must initialize before? | YES | NO |
| Method must assign? | NO | YES |
| Direction | Two-way (in and out) | One-way (out only) |
| Use case | Modify existing value | Return extra results |`,

// 13: const vs readonly
`### One-Line Answer

const = compile-time, baked into code forever. readonly = runtime, set once in constructor.

### const

\`\`\`csharp
public class MathHelper
{
    public const double Pi = 3.14159;   // set HERE, forever
    public const int MaxRetries = 3;
}
Console.WriteLine(MathHelper.Pi);  // compiler replaces with 3.14159
\`\`\`

Rules: Must assign at declaration. Only primitives. Always static.

### readonly

\`\`\`csharp
public class DatabaseConfig
{
    public readonly string ConnectionString;
    public DatabaseConfig(string connStr) => ConnectionString = connStr;
    // Cannot change after constructor
}
\`\`\`

Rules: Can assign at declaration OR in constructor. Any type. Can vary per instance.

### Key Differences

| Feature | const | readonly |
|---------|-------|----------|
| When set? | Compile time | Runtime (constructor) |
| Types allowed | Primitives only | Any type |
| Static? | Always static | Instance or static |
| Can vary per instance? | No | Yes |

### When to Use

- **const:** Mathematical constants (Pi), magic numbers, values that NEVER change.
- **readonly:** Configuration values, connection strings, values from config/DI.`,

// 14: static, sealed, abstract classes
`### One-Line Answer

static = no objects (utility), sealed = no inheritance, abstract = must be inherited.

### Static Class

\`\`\`csharp
public static class MathHelper
{
    public static double Square(double x) => x * x;
}
double result = MathHelper.Square(5);  // 25
// MathHelper obj = new MathHelper();  // ERROR
\`\`\`

**Use for:** Utility/helper classes like \`Math\`, \`Console\`, \`File\`.

### Sealed Class

\`\`\`csharp
public sealed class PaymentProcessor
{
    public void ProcessPayment() => Console.WriteLine("Processing...");
}
var processor = new PaymentProcessor();  // OK
// public class Special : PaymentProcessor { }  // ERROR — can't inherit
\`\`\`

**Use for:** Security-critical classes. \`string\` in C# is sealed.

### Abstract Class

\`\`\`csharp
public abstract class Shape
{
    public abstract double Area();  // child MUST implement
    public void Display() => Console.WriteLine($"Area is: {Area()}");
}
public class Circle : Shape
{
    public double Radius { get; set; }
    public override double Area() => 3.14 * Radius * Radius;
}
// Shape s = new Shape();  // ERROR — can't create abstract objects
\`\`\`

### Summary

| Feature | static | sealed | abstract |
|---------|--------|--------|----------|
| Create objects? | No | Yes | No |
| Inherit from it? | No | No | Yes (must) |
| Purpose | Utility methods | Prevent inheritance | Define templates |`,

// 15: Value types vs Reference types
`### One-Line Answer

Value types hold the actual data (stack). Reference types hold an address/pointer (heap).

### Value Types

\`\`\`csharp
int a = 10;
int b = a;    // b gets a COPY
b = 20;
Console.WriteLine(a);  // 10 — unchanged!
\`\`\`

Examples: int, double, bool, char, struct, enum. Stored on the **stack**.

### Reference Types

\`\`\`csharp
int[] a = { 1, 2, 3 };
int[] b = a;    // b gets the SAME address
b[0] = 99;
Console.WriteLine(a[0]);  // 99 — CHANGED! Both point to same array.
\`\`\`

Examples: string, arrays, classes, List. Stored on the **heap**.

### Boxing — "Putting a value type into a reference type box"

\`\`\`csharp
int number = 42;         // value type (on stack)
object boxed = number;   // BOXING: wrapped in object (moved to heap)
\`\`\`

### Unboxing — "Taking the value type OUT of the box"

\`\`\`csharp
object boxed = 42;
int number = (int)boxed;    // UNBOXING: extract back to stack
\`\`\`

### Why Does This Matter?

\`\`\`csharp
// BAD — boxing happens (int → object)
ArrayList list = new ArrayList();
list.Add(1);    // 1 is boxed

// GOOD — no boxing (generic list)
List<int> list = new List<int>();
list.Add(1);    // no boxing
\`\`\`

Boxing/unboxing is SLOW — avoid in performance-critical code.`,

// 16: IEnumerable, ICollection, IList, IQueryable
`### One-Line Answer

Each interface adds more capability: loop → count/add → index access. IQueryable builds DB queries.

### The Power Ladder

- **IEnumerable** — can ONLY loop.
- **ICollection** — loop + count + add + remove.
- **IList** — loop + count + add + remove + access by index \`[i]\`.
- **IQueryable** — builds database queries (separate branch).

### IQueryable vs IEnumerable — The Key Difference

\`\`\`csharp
// IEnumerable: fetches ALL rows, THEN filters in C# memory
IEnumerable<Student> students = _context.Students;
var toppers = students.Where(s => s.Marks > 90).ToList();
// SQL: SELECT * FROM Students (ALL 1 million rows come to app)

// IQueryable: filters AT the database
IQueryable<Student> students = _context.Students;
var toppers = students.Where(s => s.Marks > 90).ToList();
// SQL: SELECT * FROM Students WHERE Marks > 90 (only 500 rows)
\`\`\`

### Decision Rule

- Database (EF)? → **IQueryable**
- Need index access [0], [3]? → **IList**
- Need Add/Remove/Count? → **ICollection**
- Just need to loop? → **IEnumerable** (safest default)`,

// 17: Nullable reference types
`### One-Line Answer

C# 8+ lets you mark what CAN (\`?\`) and CAN'T be null, catching errors at compile time.

### The Problem

\`\`\`csharp
string name = null;    // perfectly legal before C# 8
Console.WriteLine(name.Length);  // CRASH — NullReferenceException
\`\`\`

### The Solution

\`\`\`csharp
string name = "John";    // NON-nullable — warns if you assign null
string? nickname = null;  // NULLABLE — the ? says "null is OK"
\`\`\`

### Operators Summary

| Operator | Meaning | Example |
|----------|---------|---------|
| ? on type | "Can be null" | \`string? name = null;\` |
| ?. | "Access only if not null" | \`name?.Length\` |
| ! | "Trust me, not null" | \`name!.Length\` |
| ?? | "If null, use this" | \`name ?? "default"\` |
| ??= | "If null, assign this" | \`name ??= "default"\` |

### Examples

\`\`\`csharp
string? name = null;
Console.WriteLine(name?.Length);       // null (no crash)
Console.WriteLine(name ?? "Guest");    // "Guest"
name ??= "Guest";                      // assigns "Guest"
Console.WriteLine(name!.Length);       // 5 (trust me, not null)
\`\`\``,

// 18: async/await, Task, Task<T>, ValueTask
`### One-Line Answer

async/await frees the thread while waiting. Task = no return, Task<T> = returns value, ValueTask = lightweight cached.

### The Problem: Blocking

\`\`\`csharp
// WITHOUT async — thread sits and WAITS
public string GetData()
{
    var data = database.FetchData();  // thread BLOCKED for 3 seconds
    return data;
}
\`\`\`

### The Solution: async/await

\`\`\`csharp
// WITH async — thread is FREE while waiting
public async Task<string> GetDataAsync()
{
    var data = await database.FetchDataAsync();  // thread freed
    return data;
}
\`\`\`

### Task vs Task<T> vs ValueTask

\`\`\`csharp
// Task — no return value
public async Task SendEmailAsync(string to)
{
    await emailService.SendAsync(to, "Hello!");
}

// Task<T> — returns a value
public async Task<User> GetUserAsync(int id)
{
    return await _context.Users.FindAsync(id);
}

// ValueTask<T> — lighter when result is often cached
public ValueTask<int> GetCountAsync()
{
    if (_cache.HasValue) return new ValueTask<int>(_cache.Value);
    return new ValueTask<int>(FetchFromDatabaseAsync());
}
\`\`\`

| Type | Returns | Use When |
|------|---------|----------|
| Task | Nothing | Fire-and-forget (send email, log) |
| Task<T> | A value | Need to return data |
| ValueTask<T> | A value | Performance-critical, result often cached |

### Golden Rules

- async methods should return Task or Task<T> (not void)
- ALWAYS await async methods
- Name with "Async" suffix
- Don't use \`.Result\` or \`.Wait()\` — they block the thread`,

// 19: Records in C# 9+
`### One-Line Answer

Records are classes designed for data — value-based equality, immutable by default, built-in ToString.

### The Problem with Classes

\`\`\`csharp
var p1 = new Person { Name = "John", Age = 30 };
var p2 = new Person { Name = "John", Age = 30 };
Console.WriteLine(p1 == p2);  // FALSE — compares REFERENCES
\`\`\`

### Records Fix This

\`\`\`csharp
public record Person(string Name, int Age);

var p1 = new Person("John", 30);
var p2 = new Person("John", 30);
Console.WriteLine(p1 == p2);  // TRUE — compares VALUES
\`\`\`

### Key Features

\`\`\`csharp
// Immutable by default
var person = new Person("Amit", 25);
// person.Name = "Priya";  // ERROR

// 'with' expression — copy with changes
var updated = person with { Age = 26 };

// Built-in ToString
Console.WriteLine(person);  // "Person { Name = Amit, Age = 25 }"
\`\`\`

### Class vs Record

| Feature | Class | Record |
|---------|-------|--------|
| Equality | Reference | Value (same data = equal) |
| Mutability | Mutable | Immutable by default |
| with expression | No | Yes |
| ToString | Class name only | All properties printed |
| Use for | Services, controllers | DTOs, events, responses |`,

// 20: Extension Methods
`### One-Line Answer

Add methods to existing classes without modifying them — using \`this\` keyword on first parameter.

### The Problem

You want to add a method to \`string\`, but you can't modify it — it's sealed.

### Extension Methods — The Solution

\`\`\`csharp
public static class StringExtensions
{
    public static string Capitalize(this string input)
    {
        if (string.IsNullOrEmpty(input)) return input;
        return char.ToUpper(input[0]) + input.Substring(1).ToLower();
    }
}

// Usage — looks like a built-in method!
string name = "john DOE";
string result = name.Capitalize();  // "John doe"
\`\`\`

### Practical Use Cases

\`\`\`csharp
// Check valid email
public static bool IsValidEmail(this string input)
    => input.Contains("@") && input.Contains(".");
"user@email.com".IsValidEmail();  // true

// List to comma-separated string
public static string ToCommaSeparated<T>(this IEnumerable<T> list)
    => string.Join(", ", list);
new[] { "Amit", "Priya" }.ToCommaSeparated();  // "Amit, Priya"

// All of LINQ is extension methods!
// .Where(), .Select(), .OrderBy() — all extensions on IEnumerable
\`\`\`

### Rules

- Must be in a **static class** with **static methods**.
- First parameter must have **\`this\`** keyword.
- Cannot override existing methods.`,

// 21: Pattern Matching
`### One-Line Answer

Check the SHAPE and TYPE of data, not just its value — replaces long if-else chains.

### C# 7 — Type Pattern

\`\`\`csharp
if (animal is Dog dog)
{
    dog.Bark();  // check type AND cast in one step
}
\`\`\`

### C# 7 — Switch with Patterns

\`\`\`csharp
public string Describe(object obj) => obj switch
{
    int i when i > 0 => "Positive number",
    int i when i < 0 => "Negative number",
    string s         => $"A string: {s}",
    null             => "Nothing",
    _                => "Something else"
};
\`\`\`

### C# 8 — Property Pattern

\`\`\`csharp
public decimal GetDiscount(Customer c) => c switch
{
    { IsVIP: true, YearsActive: > 5 } => 0.3m,
    { IsVIP: true }                    => 0.2m,
    { YearsActive: > 3 }              => 0.1m,
    _                                  => 0m
};
\`\`\`

### C# 9 — Relational and Logical Patterns

\`\`\`csharp
public string GetGrade(int marks) => marks switch
{
    >= 90 and <= 100 => "A",
    >= 80 and < 90   => "B",
    >= 70 and < 80   => "C",
    < 60             => "Fail",
    _                => "Invalid"
};
\`\`\`

### C# 11 — List Pattern

\`\`\`csharp
int[] numbers = { 1, 2, 3 };
var result = numbers switch
{
    [1, 2, 3] => "Exact match",
    [1, ..]   => "Starts with 1",
    [.., 3]   => "Ends with 3",
    []        => "Empty",
    _         => "Something else"
};
\`\`\``,

// 22: LINQ
`### One-Line Answer

Query collections using C# syntax. Two styles: query syntax (SQL-like) and method syntax (lambdas).

### Two Syntax Styles

\`\`\`csharp
// QUERY SYNTAX — looks like SQL
var result1 = from e in employees
              where e.Department == "IT"
              orderby e.Salary descending
              select e;

// METHOD SYNTAX — extension methods with lambdas (more common)
var result2 = employees
    .Where(e => e.Department == "IT")
    .OrderByDescending(e => e.Salary);
\`\`\`

### Common LINQ Methods

\`\`\`csharp
var numbers = new List<int> { 5, 3, 8, 1, 9, 2 };

numbers.Where(n => n > 3);           // filter: 5, 8, 9
numbers.Select(n => n * 2);          // transform: 10, 6, 16, 2, 18, 4
numbers.OrderBy(n => n);             // sort: 1, 2, 3, 5, 8, 9
numbers.First();                     // 5
numbers.Count();                     // 6
numbers.Sum();                       // 28
numbers.Average();                   // 4.67
numbers.Any(n => n > 5);             // true
numbers.All(n => n > 0);             // true
numbers.Distinct();                  // remove duplicates
numbers.Take(3);                     // first 3: 5, 3, 8
numbers.Skip(2);                     // skip first 2: 8, 1, 9, 2
\`\`\``,

// 23: LINQ GroupBy
`### Answer

\`\`\`csharp
var employees = new List<Employee>
{
    new("Amit", "IT", 50000),
    new("Priya", "HR", 60000),
    new("Rahul", "IT", 70000),
    new("Sara", "HR", 55000),
    new("Karan", "IT", 65000),
};

// Method syntax
var grouped = employees
    .GroupBy(e => e.Department)
    .Select(g => new
    {
        Department = g.Key,
        Count = g.Count(),
        AverageSalary = g.Average(e => e.Salary)
    });

foreach (var dept in grouped)
    Console.WriteLine($"{dept.Department}: {dept.Count} employees, Avg: {dept.AverageSalary}");

// Output:
// IT: 3 employees, Avg: 61666.67
// HR: 2 employees, Avg: 57500
\`\`\`

### Query Syntax Equivalent

\`\`\`csharp
var grouped2 = from e in employees
               group e by e.Department into g
               select new { Department = g.Key, Count = g.Count() };
\`\`\``,

// 24: LINQ Top 3
`### Answer

\`\`\`csharp
var top3 = employees
    .OrderByDescending(e => e.Salary)
    .Take(3)
    .ToList();

// Result:
// Sara     — 80000
// Rahul    — 70000
// Karan    — 65000
\`\`\`

\`OrderByDescending\` sorts highest first, \`Take(3)\` grabs the first 3.`,

// 25: LINQ Join
`### Answer

\`\`\`csharp
var customers = new List<Customer>
{
    new(1, "Amit"), new(2, "Priya"), new(3, "Rahul"),
};
var orders = new List<Order>
{
    new(101, 1, "Laptop"), new(102, 1, "Mouse"), new(103, 2, "Keyboard"),
};

// Method syntax
var result = customers.Join(
    orders,
    customer => customer.Id,
    order => order.CustomerId,
    (customer, order) => new
    {
        CustomerName = customer.Name,
        Product = order.Product
    });

// Query syntax (looks more like SQL)
var result2 = from c in customers
              join o in orders on c.Id equals o.CustomerId
              select new { CustomerName = c.Name, Product = o.Product };

// Output:
// Amit — Laptop, Amit — Mouse, Priya — Keyboard
// Rahul — not in results (no matching orders)
\`\`\``,

// 26: IEnumerable vs IQueryable
`### One-Line Answer

IEnumerable filters in C# memory (slow). IQueryable filters at the database (fast).

### IEnumerable — Filtering in MEMORY

\`\`\`csharp
IEnumerable<Student> students = _context.Students;
var toppers = students.Where(s => s.Marks > 90).ToList();
// SQL: SELECT * FROM Students (ALL 1,000,000 rows loaded into RAM)
// Then C# filters — slow, wastes memory
\`\`\`

### IQueryable — Filtering at DATABASE

\`\`\`csharp
IQueryable<Student> students = _context.Students;
var toppers = students.Where(s => s.Marks > 90).ToList();
// SQL: SELECT * FROM Students WHERE Marks > 90 (only 500 rows sent)
\`\`\`

### How IQueryable Builds Queries

\`\`\`csharp
IQueryable<Student> query = _context.Students;   // no DB call
query = query.Where(s => s.Marks > 90);           // still no DB call
query = query.Where(s => s.City == "Delhi");       // still no DB call
query = query.OrderBy(s => s.Name);                // still no DB call

List<Student> results = query.ToList();
// NOW one optimized query:
// SELECT * FROM Students WHERE Marks > 90 AND City = 'Delhi' ORDER BY Name
\`\`\`

### When to Use

- **IQueryable:** Querying a database — let the DB do the work.
- **IEnumerable:** Data already in memory (a List, an Array).`,

// 27: Deferred Execution
`### One-Line Answer

Query is NOT executed until you actually USE the results (iterate or call ToList).

### Deferred Execution

\`\`\`csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };
var query = numbers.Where(n => n > 3);  // NOT executed — just a plan

numbers.Add(6);  // add data BEFORE executing
numbers.Add(7);

foreach (var n in query)
    Console.WriteLine(n);  // 4, 5, 6, 7 — includes newly added!
\`\`\`

### Deferred (Lazy) Operators

Where, Select, OrderBy, GroupBy, Join, Take, Skip, Distinct, SelectMany

### Immediate Operators — Execute RIGHT NOW

\`\`\`csharp
.ToList()    .ToArray()    .Count()
.Sum()       .First()      .Last()
.Any()       .All()        .Min()
.Max()       .Average()
\`\`\`

### Why It Matters

\`\`\`csharp
// DANGER: if you return a query and iterate LATER,
// the database might be disposed — you get an error
IQueryable<Student> query = _context.Students.Where(s => s.Marks > 90);

// SOLUTION: materialize immediately
List<Student> results = query.ToList();  // safe to return
\`\`\``,

// 28: Select vs SelectMany
`### One-Line Answer

Select = one-to-one transform (keeps nesting). SelectMany = one-to-many + flatten.

### Select

\`\`\`csharp
var people = new List<Person>
{
    new("Amit", new[] { "C#", "SQL" }),
    new("Priya", new[] { "Java", "Python", "C#" }),
};

var skills = people.Select(p => p.Skills);
// Result: [ ["C#", "SQL"], ["Java", "Python", "C#"] ]
// A list OF lists — nested!
\`\`\`

### SelectMany

\`\`\`csharp
var allSkills = people.SelectMany(p => p.Skills);
// Result: [ "C#", "SQL", "Java", "Python", "C#" ]
// A flat list — no nesting!
\`\`\`

### Visual

- **Select:** \`[ [A, B], [C, D, E] ]\` → list of lists
- **SelectMany:** \`[ A, B, C, D, E ]\` → flat list

### When to Use

- **Select:** Transform each item (change shape, pick a property).
- **SelectMany:** Each item contains a COLLECTION and you want one flat list.`,

// 29: First, FirstOrDefault, Single, SingleOrDefault
`### One-Line Answer

First = first match or crash. Single = exactly one or crash. Default variants return default instead of crashing.

### Summary Table

| Method | No match | One match | Multiple matches |
|--------|----------|-----------|-----------------|
| First() | Exception | Returns it | Returns first |
| FirstOrDefault() | Default value | Returns it | Returns first |
| Single() | Exception | Returns it | Exception |
| SingleOrDefault() | Default value | Returns it | Exception |

### Examples

\`\`\`csharp
var numbers = new List<int> { 10, 20, 30, 40, 50 };

numbers.First(n => n > 15);              // 20
numbers.FirstOrDefault(n => n > 100);    // 0 (default for int)

numbers.Single(n => n == 30);            // 30 (exactly one match)
numbers.Single(n => n > 15);             // EXCEPTION (multiple matches!)

numbers.SingleOrDefault(n => n > 100);   // 0 (no matches — returns default)
numbers.SingleOrDefault(n => n > 15);    // EXCEPTION (multiple matches!)
\`\`\`

### When to Use

- **First/FirstOrDefault:** Expect one or more, want the first. "Get the latest order."
- **Single/SingleOrDefault:** MUST be exactly one. "Get user by unique email." If two exist, something is wrong.`,

// 30: Entity Framework Core
`### One-Line Answer

EF Core is an ORM — work with databases using C# objects instead of raw SQL.

### Comparison

\`\`\`csharp
// WITHOUT EF Core (ADO.NET):
var cmd = new SqlCommand("SELECT * FROM Products WHERE Price > 100", connection);
var reader = cmd.ExecuteReader();
while (reader.Read()) { string name = reader["Name"].ToString(); }

// WITH EF Core:
var products = _context.Products.Where(p => p.Price > 100).ToList();
\`\`\`

### Key Differences

| Feature | ADO.NET | EF Core |
|---------|---------|---------|
| How you query | Raw SQL strings | C# LINQ |
| Mapping | Manual | Automatic |
| Migrations | Manual SQL scripts | Auto-generated |
| Change tracking | Manual | Automatic |
| Performance | Faster (raw SQL) | Slightly slower |
| Control | Full control | Less control |

- **EF Core:** Most projects, CRUD, business apps, rapid development.
- **ADO.NET:** Performance-critical operations, complex SQL, stored procedures.`,

// 31: Code First vs Database First
`### One-Line Answer

Code First = write C# classes, EF creates DB. Database First = DB exists, EF generates C# classes.

### Code First

\`\`\`csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}
// EF Core creates: CREATE TABLE Products (Id INT PRIMARY KEY IDENTITY, ...)
\`\`\`

Use when: Starting a new project from scratch. **Most common approach.**

### Database First

\`\`\`bash
dotnet ef dbcontext scaffold "ConnectionString" Microsoft.EntityFrameworkCore.SqlServer
\`\`\`

EF reads the existing schema and generates matching C# classes.

Use when: Working with a legacy database.

### Summary

| Approach | Start With | Generates | Use When |
|----------|-----------|-----------|----------|
| Code First | C# classes | Database tables | New projects |
| Database First | Existing database | C# classes | Legacy databases |
| Model First | Visual designer | Both (EF6 only) | Not in EF Core |`,

// 32: Migrations
`### One-Line Answer

Migrations = version control for your database. Track C# model changes and generate SQL scripts.

### Step-by-Step

\`\`\`csharp
// 1. Create your model
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

// 2. Create DbContext
public class AppDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}
\`\`\`

\`\`\`bash
# 3. Create a migration
dotnet ef migrations add InitialCreate

# 4. Apply to database
dotnet ef database update

# 5. After adding a new column to model:
dotnet ef migrations add AddCategoryColumn
dotnet ef database update
\`\`\`

### Useful Commands

\`\`\`bash
dotnet ef migrations add <Name>      # create migration
dotnet ef database update            # apply pending migrations
dotnet ef migrations remove          # remove last (if not applied)
dotnet ef database update <Name>     # rollback to specific migration
dotnet ef migrations list            # show all migrations
\`\`\``,

// 33: Eager, Lazy, Explicit Loading
`### One-Line Answer

Eager = load NOW with Include. Lazy = load when accessed. Explicit = load when you call .Load().

### Eager Loading

\`\`\`csharp
var order = _context.Orders
    .Include(o => o.Items)    // JOIN and load Items immediately
    .FirstOrDefault(o => o.Id == 1);
// One query, all data loaded
\`\`\`

Use when: You KNOW you'll need the related data.

### Lazy Loading

\`\`\`csharp
var order = _context.Orders.FirstOrDefault(o => o.Id == 1);
// Items NOT loaded yet
var items = order.Items;  // NOW queries database
\`\`\`

Requires \`Microsoft.EntityFrameworkCore.Proxies\` and \`virtual\` navigation properties.
**Danger:** Can cause N+1 problem.

### Explicit Loading

\`\`\`csharp
var order = _context.Orders.FirstOrDefault(o => o.Id == 1);
_context.Entry(order).Collection(o => o.Items).Load();
// Manually load when you decide
\`\`\`

### Summary

| Type | When Loads | SQL Queries | Use When |
|------|-----------|-------------|----------|
| Eager | Immediately (Include) | 1 (with JOIN) | Always need related data |
| Lazy | When accessed | Multiple (on demand) | Might not need related data |
| Explicit | When you call .Load() | You decide | Want full control |`,

// 34: DbContext
`### One-Line Answer

DbContext is the bridge between C# and the database. Scoped lifetime is correct — one per request.

### Why Scoped is Correct

**Transient (BAD):** Two services in the same request get DIFFERENT DbContexts. Change tracking breaks.

**Singleton (VERY BAD):** DbContext is NOT thread-safe. Multiple users sharing = data corruption. Memory grows forever.

**Scoped (CORRECT):**

\`\`\`csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));
// AddDbContext registers as Scoped by default
\`\`\`

- All services in the SAME request share the SAME DbContext
- Change tracking works correctly across services
- DbContext is disposed at end of request — clean memory`,

// 35: EF Core LINQ to SQL
`### One-Line Answer

EF Core builds an Expression Tree from LINQ and translates it to SQL. Inefficient when using client-side evaluation.

### How Translation Works

\`\`\`csharp
var products = _context.Products
    .Where(p => p.Price > 100)
    .OrderBy(p => p.Name)
    .Take(10)
    .ToList();
// EF generates: SELECT TOP(10) * FROM Products WHERE Price > 100 ORDER BY Name
\`\`\`

### When SQL Becomes Inefficient

**1. Client-side evaluation:**

\`\`\`csharp
// BAD — custom C# method can't become SQL
var products = _context.Products
    .Where(p => MyCustomMethod(p.Name)).ToList();  // pulls ALL rows

// GOOD
var products = _context.Products
    .Where(p => p.Name.Contains("Phone")).ToList();
\`\`\`

**2. Loading too many columns:**

\`\`\`csharp
// BAD — loads ALL columns
var names = _context.Products.ToList();

// GOOD — select only what you need
var names = _context.Products.Select(p => p.Name).ToList();
\`\`\`

**3. Missing Include causes N+1:**

\`\`\`csharp
// BAD — one query per order (N+1)
var orders = _context.Orders.ToList();
foreach (var o in orders) { var items = o.Items; }

// GOOD — eager load
var orders = _context.Orders.Include(o => o.Items).ToList();
\`\`\``,

// 36: N+1 Query Problem
`### One-Line Answer

N+1 = 1 query for parent + N queries for each child. Fix with \`.Include()\` (eager loading).

### The Problem

\`\`\`csharp
var orders = _context.Orders.ToList();
// Query 1: SELECT * FROM Orders (100 orders)

foreach (var order in orders)
{
    Console.WriteLine(order.Items.Count);
    // Query 2-101: SELECT * FROM OrderItems WHERE OrderId = 1, 2, ... 100
}
// TOTAL: 1 + 100 = 101 queries!
\`\`\`

### The Fix: Eager Loading

\`\`\`csharp
var orders = _context.Orders
    .Include(o => o.Items)    // JOIN in ONE query
    .ToList();
// TOTAL: 1 query!
\`\`\`

### Other Fixes

\`\`\`csharp
// Split query (if JOIN creates too much duplicate data)
var orders = _context.Orders
    .Include(o => o.Items)
    .AsSplitQuery()
    .ToList();

// Projection (select only what you need)
var summaries = _context.Orders
    .Select(o => new { o.Id, ItemCount = o.Items.Count })
    .ToList();
\`\`\``,

// 37: Database Transactions
`### One-Line Answer

SaveChanges() is already atomic. Use manual transactions when multiple SaveChanges calls must succeed together.

### Default Behavior

\`\`\`csharp
_context.Products.Add(product1);
_context.Products.Add(product2);
_context.SaveChanges();
// If product2 fails, product1 is also rolled back. Atomic.
\`\`\`

### Manual Transaction

\`\`\`csharp
using var transaction = await _context.Database.BeginTransactionAsync();

try
{
    var sender = await _context.Accounts.FindAsync(senderId);
    sender.Balance -= amount;

    var receiver = await _context.Accounts.FindAsync(receiverId);
    receiver.Balance += amount;

    await _context.SaveChangesAsync();

    _context.TransferLogs.Add(new TransferLog { /* ... */ });
    await _context.SaveChangesAsync();

    await transaction.CommitAsync();    // ALL succeed
}
catch
{
    await transaction.RollbackAsync();  // ANY failure = undo everything
    throw;
}
\`\`\`

Use manual transactions when: Multiple SaveChanges calls must succeed or fail TOGETHER.`,

// 38: AsNoTracking
`### One-Line Answer

Skip change tracking for read-only queries — 30-50% faster, uses less memory.

### With Tracking (Default)

\`\`\`csharp
var product = _context.Products.Find(1);  // EF tracks this
product.Price = 999;
_context.SaveChanges();  // EF knows Price changed — generates UPDATE
\`\`\`

### AsNoTracking — Read-Only

\`\`\`csharp
var products = _context.Products
    .AsNoTracking()
    .Where(p => p.Price > 100)
    .ToList();
// Faster, less memory — but can't modify and save
\`\`\`

### When to Use

- **READ-ONLY** (reports, dashboards, lists) → use AsNoTracking
- **MODIFY** (edit, update, delete) → DON'T use AsNoTracking

With 10,000 rows, AsNoTracking can be **30-50% faster**.`,

// 39: Raw SQL in EF Core
`### One-Line Answer

Use \`FromSqlRaw\`/\`FromSqlInterpolated\` for queries, \`ExecuteSqlRaw\` for non-query commands.

### Returning Entities

\`\`\`csharp
var products = _context.Products
    .FromSqlRaw("SELECT * FROM Products WHERE Price > {0}", 100)
    .ToList();

// With interpolation (auto-parameterized — safe from SQL injection)
decimal minPrice = 100;
var products = _context.Products
    .FromSqlInterpolated($"SELECT * FROM Products WHERE Price > {minPrice}")
    .ToList();
\`\`\`

### Non-Query Commands

\`\`\`csharp
_context.Database.ExecuteSqlRaw(
    "UPDATE Products SET Price = Price * 1.1 WHERE Category = {0}", "Electronics");
\`\`\`

### Stored Procedures

\`\`\`csharp
var products = _context.Products
    .FromSqlRaw("EXEC GetProductsByCategory @Category = {0}", "Electronics")
    .ToList();
\`\`\`

### Important Rules

- \`FromSqlRaw\` must return ALL columns of the entity.
- You can chain LINQ after it: \`.FromSqlRaw(...).Where(...).OrderBy(...)\`.
- Always use parameterized queries to prevent SQL injection.`,

// 40: ADO.NET
`### One-Line Answer

Low-level data access in .NET — write SQL manually, handle connections yourself.

### Step-by-Step

\`\`\`csharp
string connStr = "Server=localhost;Database=MyDb;Trusted_Connection=true;";

using SqlConnection connection = new SqlConnection(connStr);
connection.Open();

using SqlCommand cmd = new SqlCommand(
    "SELECT Id, Name, Price FROM Products WHERE Price > @Price", connection);
cmd.Parameters.AddWithValue("@Price", 100);

using SqlDataReader reader = cmd.ExecuteReader();
while (reader.Read())
{
    int id = reader.GetInt32(0);
    string name = reader.GetString(1);
    decimal price = reader.GetDecimal(2);
}
\`\`\`

### Three Ways to Execute

\`\`\`csharp
cmd.ExecuteReader();     // returns rows (SELECT)
cmd.ExecuteNonQuery();   // returns affected row count (INSERT, UPDATE, DELETE)
cmd.ExecuteScalar();     // returns single value (COUNT, SUM, MAX)
\`\`\``,

// 41: SqlDataReader vs SqlDataAdapter
`### One-Line Answer

Reader = connected, forward-only, fast. Adapter = disconnected, loads all into memory.

### SqlDataReader

\`\`\`csharp
using SqlDataReader reader = cmd.ExecuteReader();
while (reader.Read())
    Console.WriteLine(reader["Name"]);
// Connection must stay OPEN. Forward only. One row at a time.
\`\`\`

### SqlDataAdapter

\`\`\`csharp
SqlDataAdapter adapter = new SqlDataAdapter("SELECT * FROM Products", connection);
DataTable table = new DataTable();
adapter.Fill(table);  // loads ALL rows into memory
// Connection CLOSED after Fill(). Can go back and forth.
\`\`\`

### Summary

| Feature | SqlDataReader | SqlDataAdapter |
|---------|---------------|----------------|
| Connection | Must stay open | Opens/closes automatically |
| Direction | Forward-only | Any direction |
| Memory | Low (one row at a time) | High (all rows in memory) |
| Speed | Faster | Slower |
| Use for | Large datasets, streaming | Small datasets, offline access |`,

// 42: ADO.NET over EF Core
`### One-Line Answer

Use ADO.NET when performance is critical, SQL is complex, or you need full control.

### Use ADO.NET When

- **Performance critical:** Raw SQL is faster. Bulk operations, reporting, high-throughput APIs.
- **Complex SQL:** Stored procedures with multiple result sets, CTEs, window functions.
- **Full control needed:** Connection pooling, command timeouts, transaction isolation levels.
- **Bulk operations:** Inserting/updating millions of rows — EF tracks each entity (slow for bulk).

### Use EF Core When

- Rapid development, CRUD apps, business applications.
- Simple to moderate queries.
- You want automatic migrations and change tracking.

### Hybrid Approach (Common in Real Projects)

\`\`\`csharp
// EF Core for standard CRUD
var product = await _context.Products.FindAsync(id);

// Raw SQL via EF Core for complex queries
var report = await _context.Database
    .SqlQueryRaw<ReportDto>("EXEC GenerateMonthlyReport @Month = {0}", month)
    .ToListAsync();
\`\`\``,

// 43: Dapper
`### One-Line Answer

Micro-ORM: you write SQL, Dapper maps results to objects. Between ADO.NET and EF Core.

### Dapper Example

\`\`\`csharp
using var connection = new SqlConnection(connStr);

var products = connection.Query<Product>(
    "SELECT * FROM Products WHERE Price > @Price",
    new { Price = 100 }
).ToList();
\`\`\`

### Comparison

| Feature | ADO.NET | Dapper | EF Core |
|---------|---------|--------|---------|
| SQL writing | Manual | Manual | Auto-generated |
| Object mapping | Manual | Automatic | Automatic |
| Performance | Fastest | Very fast | Slowest |
| Change tracking | No | No | Yes |
| Migrations | No | No | Yes |
| Best for | Full control | Performance + simplicity | Rapid development |

### When to Use Dapper

- Read-heavy APIs where performance matters.
- You're comfortable writing SQL.
- Microservices with simple data access.`,

// 44: SqlParameters
`### One-Line Answer

Parameters treat user input as DATA, never as SQL code — preventing SQL injection.

### The Problem: SQL Injection

\`\`\`csharp
// DANGEROUS — user input directly in SQL
string userInput = "'; DROP TABLE Products; --";
string sql = $"SELECT * FROM Products WHERE Name = '{userInput}'";
// YOUR TABLE IS DELETED!
\`\`\`

### The Solution: SqlParameters

\`\`\`csharp
// SAFE — parameters treated as DATA
using var cmd = new SqlCommand(
    "SELECT * FROM Products WHERE Name = @Name", connection);
cmd.Parameters.AddWithValue("@Name", userInput);
// @Name = "'; DROP TABLE Products; --" (just a string value, not code)
\`\`\`

### In EF Core and Dapper (Automatic)

\`\`\`csharp
// EF Core — always parameterized
var products = _context.Products.Where(p => p.Name == userInput).ToList();

// Dapper — also parameterized
var products = connection.Query<Product>(
    "SELECT * FROM Products WHERE Name = @Name",
    new { Name = userInput });
\`\`\`

### Golden Rule

NEVER concatenate user input into SQL strings. ALWAYS use parameters.`,

// 45: ActionFilters
`### One-Line Answer

Code that runs BEFORE/AFTER controller actions — more specific than middleware, knows about MVC context.

### Example

\`\`\`csharp
public class LogActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
        => Console.WriteLine($"BEFORE: {context.ActionDescriptor.DisplayName}");

    public void OnActionExecuted(ActionExecutedContext context)
        => Console.WriteLine($"AFTER: {context.ActionDescriptor.DisplayName}");
}

// Register globally:
builder.Services.AddControllers(options => options.Filters.Add<LogActionFilter>());

// Or on specific controller:
[ServiceFilter(typeof(LogActionFilter))]
public class ProductController : ControllerBase { }
\`\`\`

### Middleware vs ActionFilter

| Feature | Middleware | ActionFilter |
|---------|-----------|--------------|
| Scope | ALL HTTP requests | Only MVC controller actions |
| Access to MVC context | No | Yes (controller, model, action) |
| Use for | Logging, auth, CORS | Validation, auditing, caching per action |`,

// 46: Model Validation
`### One-Line Answer

DataAnnotations for simple rules (built-in), FluentValidation for complex rules (library).

### DataAnnotations (Built-in)

\`\`\`csharp
public class CreateProductDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; set; }

    [Range(1, 100000)]
    public decimal Price { get; set; }

    [EmailAddress(ErrorMessage = "Invalid email")]
    public string ContactEmail { get; set; }
}

[HttpPost]
public IActionResult Create([FromBody] CreateProductDto dto)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);
    return Ok();
}
\`\`\`

### FluentValidation (More Powerful)

\`\`\`csharp
public class CreateProductValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().Length(3, 100);
        RuleFor(x => x.Price).GreaterThan(0).LessThan(100000);
        RuleFor(x => x.ContactEmail)
            .EmailAddress()
            .When(x => !string.IsNullOrEmpty(x.ContactEmail));
    }
}
\`\`\`

- **DataAnnotations:** Simple validation, quick projects.
- **FluentValidation:** Complex rules, conditional validation, testable.`,

// 47: Global Exception Handling
`### One-Line Answer

Use exception middleware to catch ALL unhandled exceptions in ONE place.

### Exception Handling Middleware

\`\`\`csharp
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    { _next = next; _logger = logger; }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = ex switch
            {
                KeyNotFoundException => 404,
                UnauthorizedAccessException => 401,
                ArgumentException => 400,
                _ => 500
            };
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new
            {
                StatusCode = context.Response.StatusCode,
                Message = "An error occurred",
                Detail = ex.Message
            });
        }
    }
}

// Program.cs — register FIRST
app.UseMiddleware<ExceptionMiddleware>();
\`\`\`

Without global handling, you'd need try-catch in EVERY controller action.`,

// 48: AutoMapper
`### One-Line Answer

Maps objects automatically by matching property names — saves boilerplate for DTOs.

### Setup

\`\`\`csharp
// Mapping profile
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>();
        CreateMap<CreateProductDto, Product>();
    }
}

// Register
builder.Services.AddAutoMapper(typeof(Program));

// Use in controller
public class ProductController : ControllerBase
{
    private readonly IMapper _mapper;
    public ProductController(IMapper mapper) => _mapper = mapper;

    [HttpGet]
    public IActionResult Get()
    {
        var products = _repo.GetAll();
        var dtos = _mapper.Map<List<ProductDto>>(products);
        return Ok(dtos);
    }
}
\`\`\`

### Custom Mapping

\`\`\`csharp
CreateMap<Product, ProductDto>()
    .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Name))
    .ForMember(dest => dest.FullPrice, opt => opt.MapFrom(src => src.Price * 1.18m));
\`\`\`

### Pitfalls

- **Silent bugs:** Mismatched names → values silently null.
- **Hard to debug:** Errors appear at runtime, not compile time.
- **Performance:** Reflection-based — slower than manual mapping.`,

// 49: MediatR
`### One-Line Answer

Mediator pattern: everyone talks through ONE mediator instead of directly. Decouples controllers from handlers.

### Setup

\`\`\`csharp
// 1. Define a Request
public class CreateOrderCommand : IRequest<int>
{
    public string ProductName { get; set; }
    public int Quantity { get; set; }
}

// 2. Define a Handler
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, int>
{
    private readonly AppDbContext _context;
    public CreateOrderHandler(AppDbContext context) => _context = context;

    public async Task<int> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        var order = new Order { ProductName = request.ProductName, Quantity = request.Quantity };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync(ct);
        return order.Id;
    }
}

// 3. Register
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// 4. Controller just sends commands
public class OrderController : ControllerBase
{
    private readonly IMediator _mediator;
    public OrderController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderCommand command)
    {
        var orderId = await _mediator.Send(command);
        return Ok(orderId);
    }
}
\`\`\`

### Notifications — One event, MULTIPLE handlers

\`\`\`csharp
public class OrderCreatedNotification : INotification { public int OrderId { get; set; } }

// Handler 1: Send email
public class SendEmailHandler : INotificationHandler<OrderCreatedNotification> { /* ... */ }
// Handler 2: Update inventory
public class UpdateInventoryHandler : INotificationHandler<OrderCreatedNotification> { /* ... */ }

await _mediator.Publish(new OrderCreatedNotification { OrderId = 1 });
\`\`\`

### Why Use MediatR?

- Controller stays thin — just sends commands.
- Each handler does ONE thing (SRP).
- Easy to add logging, validation as pipeline behaviors.
- Testable — test each handler in isolation.

### When NOT to Use

- Small projects with simple CRUD — it's overkill.`,
];
