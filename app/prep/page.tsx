"use client";

import { useState, useEffect } from "react";
import AnswerModal from "../../components/answer-modal";
import { dotnetAnswers } from "./dotnet-answers";
import { javascriptAnswers, nodeAnswers, reactAnswers } from "./frontend-answers";

const answers: Record<string, string[]> = {
  React: reactAnswers,
  JavaScript: javascriptAnswers,
  "Node.js": nodeAnswers,
  ".NET / C#": dotnetAnswers,
};

const data: Record<string, { color: string; bg: string; icon: string; questions: string[] }> = {
  React: {
    color: "#61DAFB", bg: "#0d1f2d", icon: "⚛️",
    questions: [
      "Explain the component lifecycle in React. How does it differ between class and functional components?",
      "What are React Hooks? Why were they introduced and what problems do they solve?",
      "How does useEffect work? Explain the dependency array and cleanup function with examples.",
      "What is useState? How does React batch state updates and what are its limitations?",
      "Explain useMemo and useCallback. When should you use them and when should you avoid them?",
      "What is the difference between props and state? Can a component modify its own props?",
      "How do you build a custom Hook? Walk through a real-world example (e.g., useFetch, useDebounce).",
      "What are controlled and uncontrolled components? When would you prefer one over the other?",
      "Explain the Virtual DOM. How does React's diffing algorithm work?",
      "What is reconciliation in React? How does the key prop affect it?",
      "Context API vs Redux – when would you choose one over the other?",
      "What are common techniques to optimize a React application? (Code splitting, lazy loading, memoization)",
      "What is prop drilling and how do you avoid it?",
      "Explain the difference between useRef and useState. When would you use useRef?",
      "What are React Portals and when would you use them?",
      "How does React handle event delegation internally?",
      "What is the difference between useLayoutEffect and useEffect?",
      "How would you implement error boundaries in React?",
      "What is React Fiber and how does it improve rendering?",
      "Explain the concept of lifting state up with an example.",
      "What is Suspense in React? How does it work with lazy loading?",
      "How do you handle forms in React – both controlled and with libraries like React Hook Form?",
      "What is StrictMode in React and what does it help catch?",
      "How would you implement infinite scroll or pagination in React?",
    ]
  },
  JavaScript: {
    color: "#F7DF1E", bg: "#1a1a0d", icon: "🟡",
    questions: [
      "What is debouncing and throttling? Explain with use cases and implement both from scratch.",
      "What is callback hell? How do Promises and async/await solve it?",
      "Explain the JavaScript Event Loop. How does it handle synchronous and asynchronous code?",
      "What is the difference between single-threaded execution and async/await in JavaScript?",
      "What is a closure in JavaScript? Give a practical use case.",
      "What is hoisting? How does it behave differently for var, let, const, and function declarations?",
      "What is the difference between forEach and map? Can forEach return a value?",
      "Explain event propagation – what is bubbling and capturing? What is event delegation?",
      "What is the difference between == and ===? Explain type coercion in JavaScript.",
      "What is a Promise? Explain Promise.all, Promise.race, Promise.allSettled, and Promise.any.",
      "What is the difference between null, undefined, and NaN?",
      "Explain prototypal inheritance in JavaScript.",
      "What is the difference between call, apply, and bind?",
      "What are WeakMap and WeakSet? When would you use them?",
      "Explain the concept of the Temporal Dead Zone (TDZ).",
      "What is a generator function and how does yield work?",
      "What is memoization? Implement a memoize utility function.",
      "What is the difference between deep copy and shallow copy? How do you achieve a deep clone?",
      "Explain currying and partial application in JavaScript.",
      "What is the Proxy object in JavaScript? Give a real use case.",
      "Explain the difference between ES Modules and CommonJS (require/module.exports).",
      "What are Symbol types in JavaScript and what are they used for?",
    ]
  },
  "Node.js": {
    color: "#68A063", bg: "#0d1a0d", icon: "🟢",
    questions: [
      "What are Node.js clusters? How do they help scale a Node application across CPU cores?",
      "How would you scale a Node.js server to handle high traffic?",
      "What is rate limiting? How would you implement it in a Node/Express application?",
      "What is Helmet.js? What HTTP headers does it set and why are they important?",
      "What is CORS? How do you configure it properly in a Node.js application?",
      "Explain CQRS. When and why would you use it?",
      "What is the difference between PUT and PATCH HTTP methods?",
      "How do you handle multipart/form-data in Node.js?",
      "Can you send a body/payload with a GET request? Is it valid per HTTP spec?",
      "Explain the differences between HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.",
      "What is hashing? How is it different from encryption?",
      "What is the Node.js event loop? How is it different from the browser's event loop?",
      "What is middleware in Express.js? How does the middleware chain work?",
      "What is the difference between process.nextTick, setImmediate, and setTimeout in Node.js?",
      "How do you handle uncaught exceptions and unhandled promise rejections in Node.js?",
      "What are streams in Node.js? Explain readable, writable, and transform streams.",
      "What is JWT? How do you implement authentication using JWT in Node.js?",
      "How does connection pooling work in Node.js with databases?",
      "How would you implement background jobs or queues in Node.js? (Bull, BullMQ)",
      "How would you implement graceful shutdown in a Node.js application?",
    ]
  },
  Redux: {
    color: "#764ABC", bg: "#150d1f", icon: "🔄",
    questions: [
      "What are the three core principles of Redux?",
      "Explain the flow: Action → Reducer → Store. How does a state update happen?",
      "What is the difference between actions and action creators?",
      "What are reducers? Why must they be pure functions?",
      "What is Redux middleware? Explain redux-thunk vs redux-saga.",
      "What is the difference between Redux and Context API for state management?",
      "How does useSelector and useDispatch work in React-Redux?",
      "What is Redux Toolkit (RTK)? How does createSlice simplify Redux setup?",
      "What is the purpose of combineReducers?",
      "How would you handle async operations (API calls) in Redux?",
      "What is the difference between Redux and Zustand? When would you switch?",
      "How do you handle optimistic updates in Redux?",
    ]
  },
  ".NET / C#": {
    color: "#9B59B6", bg: "#1a0d1f", icon: "🟣",
    questions: [
      "What is Dependency Injection (DI)? What problem does it solve and how is it implemented in ASP.NET Core?",
      "Explain the three DI lifetimes: Singleton, Scoped, and Transient. Give real-world examples for each.",
      "What is the difference between constructor injection, property injection, and method injection?",
      "What are design patterns? Explain Repository, Factory, Singleton, and Strategy patterns with C# examples.",
      "What is the Builder pattern? How is it used in Program.cs / WebApplication.Builder?",
      "What is the difference between an abstract class and an interface in C#? When would you use each?",
      "Explain the SOLID principles with a C# code example for each.",
      "Explain the role of Program.cs in a .NET 6+ application. What is WebApplication.CreateBuilder?",
      "What is the middleware pipeline in ASP.NET Core? How does the order of middleware registration matter?",
      "What is short-circuiting in ASP.NET Core middleware? Give an example where it's intentional (e.g., auth, caching).",
      "What is the difference between app.Use, app.Run, and app.Map in the middleware pipeline?",
      "How do you create custom middleware in ASP.NET Core?",
      "What is the difference between ref and out parameters in C#? Give a real-world example for each.",
      "What is the difference between const and readonly in C#? When would you use each?",
      "What is the difference between static, sealed, and abstract classes?",
      "Explain value types vs reference types in C#. What is boxing and unboxing?",
      "What is the difference between IEnumerable, ICollection, IList, and IQueryable?",
      "What are nullable reference types in C# 8+? How do the ? and ! operators work?",
      "Explain async/await in C#. What is the difference between Task, Task<T>, and ValueTask?",
      "What are records in C# 9+? How are they different from classes?",
      "What are extension methods in C#? Give a practical use case.",
      "What is pattern matching in C# and how has it evolved across versions?",
      "What is LINQ? What are the two syntax styles (query syntax vs method syntax)?",
      "Write a LINQ query to group a list of employees by department and return the count per department.",
      "Write a LINQ query to find the top 3 highest-paid employees from a list.",
      "Write a LINQ query using join to combine two lists (e.g., Orders and Customers).",
      "What is the difference between IEnumerable and IQueryable in the context of LINQ?",
      "What is deferred execution in LINQ? Which operators trigger immediate execution?",
      "What is the difference between Select and SelectMany in LINQ?",
      "Explain the difference between First(), FirstOrDefault(), Single(), and SingleOrDefault().",
      "What is Entity Framework Core? How does it differ from classic ADO.NET?",
      "Explain Code First vs Database First vs Model First approaches in EF Core.",
      "What are migrations in EF Core? Walk through creating and applying a migration.",
      "What is the difference between Eager Loading, Lazy Loading, and Explicit Loading in EF Core?",
      "What is the DbContext? Explain its lifetime and why Scoped is the correct DI lifetime for it.",
      "How does EF Core translate LINQ queries to SQL? When would the generated SQL be inefficient?",
      "What is the N+1 query problem in EF Core and how do you fix it?",
      "How do you handle database transactions in EF Core?",
      "What is AsNoTracking() and when should you use it?",
      "How do you execute raw SQL queries in EF Core?",
      "What is ADO.NET? Walk through the steps to connect to a database and execute a query.",
      "What is the difference between SqlDataReader and SqlDataAdapter?",
      "When would you choose ADO.NET over EF Core for a backend project?",
      "What is Dapper? How does it compare to EF Core and raw ADO.NET?",
      "What are SqlParameters and why are they important? (SQL injection prevention)",
      "What are ActionFilters in ASP.NET Core? How are they different from middleware?",
      "How does model validation work in ASP.NET Core? (DataAnnotations, FluentValidation)",
      "How would you implement global exception handling in ASP.NET Core?",
      "What is AutoMapper? How does it work and what are its pitfalls?",
      "What is MediatR and how does it implement the Mediator pattern in .NET?",
    ]
  },
  SQL: {
    color: "#F39C12", bg: "#1a1200", icon: "🗃️",
    questions: [
      "What is the difference between WHERE and HAVING clauses?",
      "Explain the different types of JOINs: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF.",
      "What is the difference between UNION and UNION ALL?",
      "What are aggregate functions? Explain SUM, COUNT, AVG, MIN, MAX with GROUP BY.",
      "What is a subquery? What is the difference between a correlated and non-correlated subquery?",
      "What are CTEs (Common Table Expressions)? Write an example using WITH.",
      "What are window functions? Explain ROW_NUMBER(), RANK(), DENSE_RANK(), and LEAD/LAG.",
      "Write a query to find the second highest salary from an Employee table.",
      "Write a query to find duplicate records in a table and delete them keeping one.",
      "Write a query to pivot rows to columns (e.g., monthly sales per product in one row).",
      "What is the difference between DELETE, TRUNCATE, and DROP?",
      "What is a self-join? Give a real-world example (e.g., employee-manager hierarchy).",
      "What is an index in SQL? What are the types? (Clustered, Non-Clustered, Composite, Covering)",
      "What is the difference between a clustered and non-clustered index?",
      "When should you NOT add an index? What are the downsides of over-indexing?",
      "What is a query execution plan? How do you read and optimize it?",
      "What are ACID properties? Explain each with a banking transaction example.",
      "What are isolation levels in SQL? (Read Uncommitted, Read Committed, Repeatable Read, Serializable)",
      "What is a deadlock? How do you detect and prevent it?",
      "What is optimistic vs pessimistic locking?",
      "What is a dirty read, phantom read, and non-repeatable read?",
      "What are the normal forms? Explain 1NF, 2NF, 3NF, and BCNF with examples.",
      "What is denormalization? When is it justified?",
      "What are stored procedures and functions? When would you use each?",
      "What are triggers in SQL? Give a use case and explain when they can be dangerous.",
      "What is a view? What is the difference between a view and a materialized view?",
      "How would you design a schema for a multi-tenant SaaS application?",
      "How would you implement soft deletes in a SQL schema?",
      "Write a query to calculate a rolling 7-day average of daily sales.",
      "How would you find all employees who earn more than their direct manager?",
      "What is sharding in databases? How does it differ from partitioning?",
      "What is the difference between SQL Server, PostgreSQL, and MySQL in terms of features?",
    ]
  },
  "Backend & Systems": {
    color: "#E74C3C", bg: "#1f0d0d", icon: "🖥️",
    questions: [
      // Networking
      "What is the difference between TCP and UDP? When would you choose UDP over TCP?",
      "Explain the TCP 3-way handshake. What happens during connection setup and teardown?",
      "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3? What improvements does each bring?",
      "What is TLS/SSL? How does the TLS handshake work at a high level?",
      "What is the difference between IPv4 and IPv6?",
      "What is a WebSocket? How does it differ from HTTP long polling and Server-Sent Events?",
      "What is DNS? Walk through what happens when you type a URL in a browser.",
      "What is the difference between a reverse proxy and a forward proxy?",
      // Load Balancing & Nginx
      "What is a load balancer? Explain the difference between Layer 4 (transport) and Layer 7 (application) load balancers.",
      "What is the difference between an internal and external load balancer? When would you use each?",
      "What are the common load balancing algorithms? (Round Robin, Least Connections, IP Hash, Weighted)",
      "What is Nginx? List at least 5 things you can use Nginx for in a production setup.",
      "How do you configure Nginx as a reverse proxy for a Node.js or .NET application?",
      "What is Nginx rate limiting and how do you configure it?",
      "What is an upstream block in Nginx? How do you configure load balancing in Nginx config?",
      "How does Nginx handle SSL termination? Why is it done at the proxy layer?",
      "What is the difference between Nginx and Apache? When would you choose one over the other?",
      // API Performance Optimization
      "How would you optimize an API that is responding slowly? Walk through your investigation process.",
      "What is connection pooling and why is it critical for API performance?",
      "What are the different types of caching? (In-memory, distributed, HTTP cache, CDN) When do you use each?",
      "What is a CDN? How does it reduce API/server load?",
      "What is pagination? Compare offset-based vs cursor-based pagination for large datasets.",
      "What is the N+1 problem in REST APIs and how do you fix it?",
      "What are database query optimizations you would apply before scaling infrastructure?",
      "What is horizontal vs vertical scaling? What are the limits of each?",
      "How do you use async/non-blocking I/O to improve API throughput?",
      "What is response compression (gzip/brotli) and how does it help API performance?",
      "What is HTTP caching? Explain ETag, Cache-Control, and Last-Modified headers.",
      // MongoDB
      "What is MongoDB? How is it different from a relational database?",
      "What is a document in MongoDB? How is it structured?",
      "What is the difference between embedding and referencing documents in MongoDB? When do you use each?",
      "What are MongoDB indexes? What types exist? (Single field, Compound, Text, Geospatial, TTL)",
      "What is the aggregation pipeline in MongoDB? Write an example to group orders by customer and sum totals.",
      "What is the difference between find() and aggregate() in MongoDB?",
      "What is a replica set in MongoDB? How does it provide high availability?",
      "What is sharding in MongoDB? How does it differ from replica sets?",
      "What are MongoDB transactions? When did they become available and what are their limitations?",
      "What is the $lookup stage in the aggregation pipeline? How is it similar to a SQL JOIN?",
      "How would you model a one-to-many relationship in MongoDB? Give a real example.",
      "What is the difference between updateOne, updateMany, findOneAndUpdate, and replaceOne?",
      "What is the ObjectId in MongoDB? Why is it useful for distributed systems?",
      "What is a capped collection in MongoDB? When would you use it?",
      // Kafka & RabbitMQ
      "What is a message broker? Why would you use one instead of direct API calls?",
      "What is Apache Kafka? Explain topics, partitions, producers, consumers, and consumer groups.",
      "What is the difference between Kafka and RabbitMQ? When would you choose one over the other?",
      "What is message ordering in Kafka? How does partitioning affect order guarantees?",
      "What is the difference between at-most-once, at-least-once, and exactly-once delivery semantics?",
      "What is a dead letter queue (DLQ)? How do you handle poison messages in RabbitMQ or Kafka?",
      "What is Kafka consumer lag? How do you monitor and reduce it?",
      "What is an exchange in RabbitMQ? Explain Direct, Fanout, Topic, and Headers exchanges.",
      "How does Kafka retain messages? How does it differ from traditional message queues?",
      "What is event sourcing? How does Kafka fit into an event-driven architecture?",
      "What is the difference between a queue and a topic?",
      "How would you implement a retry mechanism with exponential backoff in a message consumer?",
      // Auth: JWT vs Sessions
      "What is the difference between JWT (token-based) and session-based authentication?",
      "How does a JWT work? Explain the three parts: Header, Payload, Signature.",
      "What are the security risks of JWT? (e.g., algorithm confusion, storing in localStorage)",
      "What is a refresh token? How do you implement silent token refresh securely?",
      "What is OAuth 2.0? Explain the Authorization Code flow vs Client Credentials flow.",
      "What is the difference between authentication and authorization?",
      "What is RBAC (Role-Based Access Control) vs ABAC (Attribute-Based Access Control)?",
      "How do you invalidate a JWT before it expires? What are the common strategies?",
      "What is the difference between symmetric and asymmetric JWT signing (HS256 vs RS256)?",
      "Where should you store JWTs on the client – localStorage, sessionStorage, or HttpOnly cookies? Why?",
      // Docker
      "What is Docker? What problem does it solve compared to running apps directly on a server?",
      "What is the difference between a Docker image and a Docker container?",
      "Explain the layers in a Dockerfile. Why does layer order matter for build caching?",
      "What is Docker Compose? How do you use it to run a multi-container application locally?",
      "What is the difference between CMD and ENTRYPOINT in a Dockerfile?",
      "What is a multi-stage build in Docker? Why would you use it?",
      "What are Docker volumes? What is the difference between a bind mount and a named volume?",
      "What is a Docker network? Explain bridge, host, and overlay network modes.",
      "How do you reduce a Docker image size? (Alpine, multi-stage, .dockerignore, etc.)",
      "What is the difference between Docker and Kubernetes? When do you need Kubernetes?",
      "How do you pass environment variables to a Docker container securely?",
      "What is Docker Hub? How do you push and pull images from a registry?",
      // CI/CD
      "What is CI/CD? What is the difference between Continuous Integration, Delivery, and Deployment?",
      "Walk me through a typical CI/CD pipeline for a backend API. What stages would it include?",
      "What is the difference between a deployment pipeline and a release pipeline?",
      "What tools have you used for CI/CD? (GitHub Actions, Azure DevOps, Jenkins, GitLab CI)",
      "What is a build artifact in CI/CD? How is it passed between pipeline stages?",
      "How do you handle secrets and environment variables in a CI/CD pipeline securely?",
      "What is a blue-green deployment? How does it reduce downtime?",
      "What is a canary deployment? How does it reduce risk when releasing new features?",
      "What is a rollback strategy in CI/CD? How would you automate it?",
      "What is Infrastructure as Code (IaC)? How does it fit into a CI/CD pipeline? (Terraform, Bicep)",
      "What is a health check endpoint? How is it used in CI/CD and load balancers?",
      "What is the difference between unit tests, integration tests, and end-to-end tests in a pipeline context?",
    ]
  }
};

const categoryOrder = ["React", "JavaScript", "Node.js", "Redux", ".NET / C#", "SQL", "Backend & Systems"];

const sections: Record<string, { label: string; range: [number, number] }[]> = {
  "Backend & Systems": [
    { label: "🌐 Networking & Protocols", range: [0, 7] },
    { label: "⚖️ Load Balancing & Nginx", range: [8, 16] },
    { label: "⚡ API Performance Optimization", range: [17, 27] },
    { label: "🍃 MongoDB", range: [28, 41] },
    { label: "📨 Kafka & RabbitMQ", range: [42, 53] },
    { label: "🔐 Auth: JWT vs Sessions", range: [54, 63] },
    { label: "🐳 Docker", range: [64, 75] },
    { label: "🚀 CI/CD", range: [76, 87] },
  ]
};

/* ── Markdown renderer ─────────────────────────────────────────── */

/* ── QuestionCard ──────────────────────────────────────────────── */

function QuestionCard({ q, idx, done, color, onToggle, onOpen, hasAnswer }: {
  q: string; idx: number; done: boolean; color: string; onToggle: () => void; onOpen?: () => void; hasAnswer?: boolean;
}) {
  const canOpen = Boolean(hasAnswer && onOpen);

  return (
    <div onClick={canOpen ? onOpen : undefined}
      style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        padding: "12px 16px", borderRadius: 12,
        background: done ? "#121212" : "#161616",
        border: `1px solid ${done ? "#262626" : "#242424"}`,
        cursor: canOpen ? "pointer" : "default",
        transition: "all 0.15s"
      }}>
      <button
        type="button"
        aria-label={done ? `Mark question ${idx + 1} as not reviewed` : `Mark question ${idx + 1} as reviewed`}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
          border: `2px solid ${done ? color : "#3a3a3a"}`,
          background: done ? color : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
          padding: 0, cursor: "pointer"
        }}>
        {done && <span style={{ color: "#000", fontSize: 11, fontWeight: 900 }}>✓</span>}
      </button>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 11, color, fontWeight: 700, marginRight: 6, opacity: 0.55 }}>Q{idx + 1}</span>
        <span style={{ fontSize: 13.5, lineHeight: 1.65, color: done ? "#8b8b8b" : "#d8d8d8", textDecoration: done ? "line-through" : "none" }}>
          {q}
        </span>
      </div>
      {hasAnswer && <span style={{ fontSize: 10, color: "#4ade80", opacity: 0.5, marginTop: 3, flexShrink: 0 }}>VIEW</span>}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */

export default function PrepPage() {
  const [active, setActive] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("prep-active-tab") || "Backend & Systems";
    }
    return "Backend & Systems";
  });
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("prep-checked");
        if (saved) return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return {};
  });
  const [search, setSearch] = useState("");
  const [selectedQ, setSelectedQ] = useState<{ cat: string; idx: number } | null>(null);

  useEffect(() => {
    localStorage.setItem("prep-checked", JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem("prep-active-tab", active);
  }, [active]);

  const toggle = (cat: string, i: number) => {
    const key = `${cat}-${i}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filtered = data[active].questions.filter(q =>
    q.toLowerCase().includes(search.toLowerCase())
  );
  const selectedAnswer = selectedQ ? answers[selectedQ.cat]?.[selectedQ.idx] : null;

  const totalDone = Object.values(checked).filter(Boolean).length;
  const totalAll = categoryOrder.reduce((s, c) => s + data[c].questions.length, 0);
  const catDone = (cat: string) => data[cat].questions.filter((_, i) => checked[`${cat}-${i}`]).length;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#0e0e0e", minHeight: "100vh", color: "#e0e0e0", padding: "24px 16px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#fff" }}>🧑‍💻 Interview Question Bank</h1>
          <p style={{ color: "#666", margin: "4px 0 0", fontSize: 12 }}>3 Years Experience · Backend-Inclined Full Stack</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
            <div style={{ flex: 1, background: "#1e1e1e", borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${(totalDone / totalAll) * 100}%`, background: "#4ade80", height: "100%", borderRadius: 99, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>{totalDone} / {totalAll} reviewed</span>
        </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {categoryOrder.map(cat => {
            const done = catDone(cat);
            const total = data[cat].questions.length;
            const pct = Math.round((done / total) * 100);
            const isActive = active === cat;
            return (
              <button key={cat} onClick={() => { setActive(cat); setSearch(""); }}
                style={{
                  padding: "8px 14px", borderRadius: 10,
                  border: `2px solid ${isActive ? data[cat].color : "#2a2a2a"}`,
                  background: isActive ? data[cat].bg : "#141414",
                  color: isActive ? data[cat].color : "#666",
                  fontWeight: 600, fontSize: 11, cursor: "pointer", transition: "all 0.2s",
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, minWidth: 90
                }}>
                <span>{data[cat].icon} {cat}</span>
                <div style={{ width: "100%", background: "#2a2a2a", borderRadius: 99, height: 3 }}>
                  <div style={{ width: `${pct}%`, background: data[cat].color, height: "100%", borderRadius: 99, transition: "width 0.3s", opacity: 0.8 }} />
                </div>
                <span style={{ fontSize: 10, opacity: 0.5 }}>{done}/{total}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={`Search in ${active}...`}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10,
            border: "1px solid #2a2a2a", background: "#161616", color: "#e0e0e0",
            fontSize: 13, marginBottom: 14, boxSizing: "border-box", outline: "none"
          }}
        />

        {/* Questions */}
        {(() => {
          const hasSections = sections[active] && !search;
          if (hasSections) {
            return sections[active].map(sec => {
              const qs = data[active].questions.slice(sec.range[0], sec.range[1] + 1);
              return (
                <div key={sec.label} style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: data[active].color, marginBottom: 10, letterSpacing: 0.5, opacity: 0.85 }}>
                    {sec.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {qs.map((q, localIdx) => {
                      const realIdx = sec.range[0] + localIdx;
                      const key = `${active}-${realIdx}`;
                      const done = !!checked[key];
                      return (
                        <QuestionCard key={key} q={q} idx={realIdx} done={done} color={data[active].color}
                          onToggle={() => toggle(active, realIdx)}
                          onOpen={answers[active]?.[realIdx] ? () => setSelectedQ({ cat: active, idx: realIdx }) : undefined}
                          hasAnswer={!!answers[active]?.[realIdx]} />
                      );
                    })}
                  </div>
                </div>
              );
            });
          }

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {filtered.map(q => {
                const realIdx = data[active].questions.indexOf(q);
                const key = `${active}-${realIdx}`;
                const done = !!checked[key];
                return (
                  <QuestionCard key={key} q={q} idx={realIdx} done={done} color={data[active].color}
                    onToggle={() => toggle(active, realIdx)}
                    onOpen={answers[active]?.[realIdx] ? () => setSelectedQ({ cat: active, idx: realIdx }) : undefined}
                    hasAnswer={!!answers[active]?.[realIdx]} />
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", color: "#444", padding: 48, fontSize: 14 }}>No questions match your search.</div>
              )}
            </div>
          );
        })()}

        {/* Answer Modal */}
        {selectedQ && selectedAnswer && (
          <AnswerModal
            title={`Q${selectedQ.idx + 1}. ${data[selectedQ.cat].questions[selectedQ.idx]}`}
            content={selectedAnswer}
            accentColor={data[selectedQ.cat].color}
            onClose={() => setSelectedQ(null)}
          />
        )}

        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #1e1e1e", fontSize: 11, color: "#3a3a3a", textAlign: "center" }}>
          Click a question with a VIEW badge to open the answer · Use checkbox to mark as reviewed · Progress saved in browser
        </div>
      </div>
    </div>
  );
}
