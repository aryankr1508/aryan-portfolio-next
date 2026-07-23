import { PrepCategory } from "./prep-types";
import { q } from "./prep-types";

const jpaSqlCategory: PrepCategory = {
  name: "JPA & SQL",
  color: "#38bdf8",
  bg: "#0b1b24",
  icon: "🗄️",
  description: "Hibernate, transactions, database design, and SQL interview queries",
  sections: [
    {
      label: "🧬 JPA & Hibernate",
      questions: [
        q(
          "What are JPA and Hibernate?",
          "JPA, now Jakarta Persistence, is a specification for object-relational persistence. Hibernate is a popular implementation. JPA defines APIs and mapping rules; Hibernate performs SQL generation, dirty checking, caching, and database interaction.",
          "I code mainly against JPA abstractions such as EntityManager and repositories, while Hibernate is the provider doing the work. ORM removes repetitive mapping code, but I still inspect generated SQL and understand database behavior.",
        ),
        q(
          "What is a JPA entity?",
          "An entity is a persistent domain object mapped to a database table and identified by `@Id`. It needs a no-argument constructor for provider use and should have equality semantics that remain safe across persistence states.",
          "An entity represents database-backed identity and lifecycle, not an API payload. I keep request/response DTOs separate, control relationships deliberately, and avoid putting generated mutable IDs blindly into equals and hashCode.",
        ),
        q(
          "What is a Spring Data repository?",
          "A repository is an abstraction around persistence operations. Spring Data can create implementations from interfaces, derived method names, declared JPQL/native queries, and specifications.",
          "Repositories keep query and persistence concerns behind a focused interface. I avoid turning them into a second service layer; business workflows and transaction boundaries belong in services.",
        ),
        q(
          "CrudRepository vs JpaRepository: what is added?",
          "CrudRepository exposes basic save, find, exists, count, and delete operations. JpaRepository builds on repository abstractions with JPA-oriented capabilities such as flush, saveAndFlush, batch deletion, paging, and sorting through its hierarchy.",
          "I normally use JpaRepository in a JPA application when paging, sorting, or flush operations are useful. I expose only domain-meaningful repository methods to services rather than letting every caller perform arbitrary persistence.",
        ),
        q(
          "What does repository save() actually do?",
          "Spring Data JPA's save delegates to EntityManager.persist for a new entity and merge for an entity considered existing. The returned value matters with merge because it is the managed copy; the passed detached object does not become managed.",
          "Save does not necessarily execute SQL immediately because writes can wait until flush or commit. For a managed entity inside a transaction, dirty checking usually makes an extra save call unnecessary.",
        ),
        q(
          "What is the difference between persist() and merge()?",
          "`persist` makes a new entity managed and returns void. `merge` copies state from a detached or new object into a managed instance and returns that managed instance. The original object passed to merge stays detached.",
          "I use persist for new aggregate creation. With merge I always use the returned reference. For updates I prefer loading the managed entity and applying allowed changes, which also avoids overwriting fields from a stale detached payload.",
        ),
        q(
          "How do remove() and delete work?",
          "EntityManager.remove marks a managed entity for deletion, with SQL normally issued at flush. Repository delete methods may first load or attach an entity depending on the method and provider behavior. Cascades can propagate deletion.",
          "I load and authorize the entity before deletion when business rules matter. For bulk deletes I use a deliberate query, knowing bulk operations bypass the persistence context and entity callbacks unless handled explicitly.",
        ),
        q(
          "What is dirty checking?",
          "Within a persistence context, Hibernate tracks managed entity state. At flush it detects changes and produces SQL updates without requiring an explicit repository save for every mutation.",
          "Dirty checking is why a transactional service can load an Order, call `order.cancel()`, and commit. I keep transactions bounded because every managed entity consumes tracking memory, and I avoid accidental setters that create unintended updates.",
        ),
        q(
          "What is the first-level cache?",
          "The first-level cache is the persistence context associated with an EntityManager/session. It guarantees one managed instance per entity identity in that context and can avoid repeated selects during the same transaction.",
          "The first-level cache is automatic and local to the persistence context. It is also a write-behind unit of work. It is not a cross-request application cache, and bulk SQL can make its in-memory state stale.",
        ),
        q(
          "What is the second-level cache?",
          "The optional second-level cache is shared across persistence contexts, typically by entity type and ID. Query caching is separate. It requires a provider and a careful invalidation/concurrency strategy.",
          "I enable second-level caching only for measured read-heavy, low-change data. It can reduce database reads, but stale data and invalidation complexity are real. Redis at the service level and Hibernate L2 cache solve different problems.",
        ),
        q(
          "Lazy vs eager loading: what is the trade-off?",
          "Lazy relationships load when accessed; eager relationships are expected to be loaded with the entity, though SQL shape is provider-dependent. Lazy avoids unused data but can cause extra queries or fail outside the persistence context. Eager can over-fetch.",
          "I keep collections lazy by default and fetch exactly what each use case needs with a fetch join, entity graph, or DTO projection. I do not solve LazyInitializationException by enabling Open Session in View or making every relationship eager.",
        ),
        q(
          "What is the N+1 query problem?",
          "One query loads N parent rows, then accessing a lazy relationship runs one more query per parent. The application seems correct but performs N+1 round trips and degrades quickly.",
          "I detect N+1 through SQL logs, query counts, APM, and integration tests. I fix it per use case with a fetch join, entity graph, batch fetching, or DTO projection—not by globally changing everything to eager.",
        ),
        q(
          "What are JPA cascade types?",
          "Cascade propagates entity operations from a parent association to its children: PERSIST, MERGE, REMOVE, REFRESH, DETACH, or ALL. It describes lifecycle propagation, not database foreign-key cascade by itself.",
          "I cascade only where the child truly belongs to the aggregate lifecycle. Cascade REMOVE from Order to OrderLine can make sense; cascading remove from many Orders to a shared Product would be dangerous.",
        ),
        q(
          "What does orphanRemoval do?",
          "For an owned one-to-one or one-to-many relationship, orphanRemoval deletes a child removed from the parent's association. Cascade REMOVE applies when the parent itself is removed; orphan removal applies when the relationship is severed.",
          "I use orphanRemoval for privately owned children such as OrderLines. I keep both sides of a bidirectional relationship in sync with add/remove helper methods so the in-memory model matches the database change.",
        ),
        q(
          "What is a fetch join?",
          "A JPQL fetch join loads an association in the same query as its parent, avoiding a later lazy query. Fetching several to-many collections can multiply rows, and paginating a collection fetch join is problematic.",
          "A fetch join is a targeted N+1 fix. I use `select distinct o from Order o join fetch o.customer` for a to-one relation. For large paged collections, I often page IDs first and fetch details in a second bounded query.",
        ),
        q(
          "JPQL vs native SQL: when do you use each?",
          "JPQL queries entities and mapped attributes, so it is portable and integrates with ORM. Native SQL queries database tables and can use vendor-specific features, complex CTEs, hints, or tuned projections.",
          "I start with JPQL or a projection for ordinary domain queries. I use native SQL when the database can express an important query better or faster, then test the mapping and accept the portability trade-off explicitly.",
        ),
        q(
          "What is @Transactional and where should it go?",
          "Transactional defines a unit of work. Spring usually applies it through a proxy that begins, commits, or rolls back around a public method. By default, unchecked exceptions trigger rollback; checked exceptions do not unless configured.",
          "I put transaction boundaries on service use cases, not controllers or every repository call. I keep the transaction short and avoid slow remote calls inside it. I also remember self-invocation bypasses the usual proxy, and private annotations are not intercepted.",
        ),
        q(
          "What are transaction propagation modes?",
          "REQUIRED joins an existing transaction or creates one. REQUIRES_NEW suspends the outer transaction and creates an independent one. SUPPORTS joins if present. MANDATORY requires one. NOT_SUPPORTED runs without one. NESTED uses a savepoint where supported.",
          "REQUIRED is the safe default. I use REQUIRES_NEW only when the operation must commit independently, such as a carefully designed audit record. It consumes another connection and can create surprising consistency, so I do not use it as a quick rollback workaround.",
        ),
        q(
          "What is flush, and how is it different from commit?",
          "Flush synchronizes pending persistence-context changes to the database but does not end the transaction. Commit finalizes the transaction. A later query may trigger an automatic flush so it sees current changes.",
          "Flush makes SQL happen early enough to surface constraints or satisfy query consistency; commit makes it durable. A flushed transaction can still roll back. I call flush explicitly only when that timing is required.",
        ),
        q(
          "How do optimistic and pessimistic locking work in JPA?",
          "Optimistic locking uses a `@Version` field and rejects an update if another transaction changed the row. Pessimistic locking asks the database to lock rows during the transaction, blocking or failing competing access.",
          "I prefer optimistic locking for normal web editing because conflicts are rare and no long lock is held. I catch the conflict and retry or return 409. I reserve pessimistic locking for short, high-contention critical sections and always consider lock timeouts.",
        ),
      ],
    },
    {
      label: "🏛️ Database fundamentals",
      questions: [
        q(
          "What are primary, foreign, and composite keys?",
          "A primary key uniquely identifies a row. A foreign key enforces that a referenced parent key exists. A composite key uses multiple columns together for identity, often in join tables or domain-natural relationships.",
          "Primary keys give stable identity; foreign keys protect referential integrity. I use composite keys when the combination is genuinely the identity, such as student plus course enrollment, but may still use a surrogate ID if ORM ergonomics and references benefit.",
        ),
        q(
          "What is an index, and why is it not free?",
          "An index is an additional ordered access structure that lets the database find rows without scanning the whole table. It consumes storage and every insert, update, or delete may need to maintain it.",
          "I add indexes for measured query patterns—filter, join, and ordering columns—not for every field. I verify with an execution plan and consider selectivity, write cost, index size, and whether the query needs a composite or covering index.",
        ),
        q(
          "Clustered vs non-clustered index: what is the difference?",
          "A clustered index determines or closely represents the table's physical row organization, so a table normally has one. A non-clustered index is a separate structure containing keys and a locator to the row, so many can exist.",
          "A clustered key should generally be stable and reasonably narrow because non-clustered indexes may reference it. Exact behavior varies by database, so I verify the engine instead of treating SQL Server terminology as universal.",
        ),
        q(
          "How does column order matter in a composite index?",
          "A composite B-tree is ordered from its leading column onward. Queries that constrain the leftmost prefix can use it efficiently; skipping the first column often prevents a direct seek.",
          "For an index on `(tenant_id, status, created_at)`, tenant-only and tenant-plus-status queries fit naturally. I choose order from equality filters, range filters, sorting, and selectivity, then confirm with the plan.",
        ),
        q(
          "Explain database normalization.",
          "Normalization reduces duplication and update anomalies. 1NF makes values atomic; 2NF removes partial dependency on part of a composite key; 3NF removes transitive dependency between non-key attributes.",
          "I normally design transactional tables around 3NF, then denormalize deliberately for a measured read need. The goal is one authoritative place for each fact, not splitting tables merely to quote a normal form.",
        ),
        q(
          "What are the ACID properties?",
          "Atomicity means all-or-nothing; Consistency preserves declared rules; Isolation controls interference between concurrent transactions; Durability keeps committed results despite failure.",
          "For a bank transfer, debit and credit are atomic, constraints keep balances and references consistent, isolation prevents unsafe concurrent views, and durability ensures a committed transfer survives restart.",
        ),
        q(
          "What are transaction isolation levels?",
          "Read Uncommitted permits dirty reads. Read Committed prevents them. Repeatable Read also protects previously read rows from changing under common definitions. Serializable gives behavior equivalent to a serial order, preventing phantoms at the highest concurrency cost. Snapshot/MVCC options vary by database.",
          "I use the lowest isolation that preserves the use case, then add an atomic update or optimistic version check where needed. I verify exact database semantics because names such as Repeatable Read behave differently across engines.",
        ),
        q(
          "What are dirty reads, non-repeatable reads, and phantom reads?",
          "A dirty read sees uncommitted data that may roll back. A non-repeatable read gets different values for the same row within one transaction. A phantom means repeating a predicate query sees a changed set of rows.",
          "The anomalies increase from uncommitted value, to changed row, to changed result set. Isolation controls them, but business correctness may still need a unique constraint, lock, or atomic conditional update.",
        ),
        q(
          "What is a database deadlock?",
          "Two or more transactions hold locks and each waits for another in a cycle. The database detects the cycle and aborts a victim. Long transactions and inconsistent access order increase risk.",
          "I prevent deadlocks by updating resources in a consistent order, keeping transactions short, indexing predicates so fewer rows lock, and retrying the chosen victim safely. I diagnose using the database deadlock graph, not only application logs.",
        ),
        q(
          "Optimistic vs pessimistic database locking?",
          "Optimistic concurrency does not hold a long application lock; an update checks a version or old value and fails on conflict. Pessimistic locking acquires a database lock before modification and makes competitors wait or fail.",
          "Optimistic is my default for low-contention web workflows. Pessimistic can suit short high-contention inventory or allocation flows. Both still need timeouts, retry policy, and careful transaction boundaries.",
        ),
      ],
    },
    {
      label: "⌨️ SQL interview questions",
      questions: [
        q(
          "Write SQL to find the second-highest salary.",
          "Use `DENSE_RANK` when duplicate top salaries should share rank. Filter for rank two. A `MAX` below the maximum is a simpler alternative for this exact question.",
          "I clarify whether ‘second highest’ means the second distinct salary. Then I use DENSE_RANK so duplicate top earners do not shift the result.",
          {
            code: `WITH ranked AS (
    SELECT employee_id, salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_rank
    FROM employees
)
SELECT employee_id, salary
FROM ranked
WHERE salary_rank = 2;`,
            language: "sql",
          },
        ),
        q(
          "Write SQL to find the Nth-highest salary.",
          "Rank distinct salary values descending and parameterize the desired rank. Decide whether the result should return the salary value or every employee earning it.",
          "I use DENSE_RANK for the Nth distinct salary and filter on the rank parameter. If the interviewer wants exactly one row despite ties, I discuss ROW_NUMBER and a deterministic tie-breaker.",
          {
            code: `WITH ranked AS (
    SELECT e.*,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_rank
    FROM employees e
)
SELECT *
FROM ranked
WHERE salary_rank = :n;`,
            language: "sql",
          },
        ),
        q(
          "How do you find duplicate records?",
          "Group by the columns that define a duplicate and keep groups whose count is greater than one. The key design question is which columns represent logical identity.",
          "I first define duplicate—for example email within one tenant—then group by those columns and use HAVING COUNT(*) > 1.",
          {
            code: `SELECT tenant_id, email, COUNT(*) AS copies
FROM users
GROUP BY tenant_id, email
HAVING COUNT(*) > 1;`,
            language: "sql",
          },
        ),
        q(
          "How do you delete duplicates while keeping one row?",
          "Assign a row number inside each duplicate group using a deterministic keeper rule, then delete rows numbered greater than one. Run the select first, use a transaction, and add a unique constraint afterward.",
          "I use ROW_NUMBER partitioned by the logical key, order by the row I want to keep, and delete rank greater than one. Then I prevent recurrence with a unique constraint.",
          {
            code: `WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
               PARTITION BY tenant_id, email
               ORDER BY created_at, id
           ) AS rn
    FROM users
)
DELETE FROM users
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);`,
            language: "sql",
          },
        ),
        q(
          "What is the difference between WHERE and HAVING?",
          "WHERE filters individual input rows before grouping. HAVING filters grouped results after GROUP BY and aggregate calculation.",
          "If the condition does not depend on an aggregate, I put it in WHERE so fewer rows reach grouping. I use HAVING for conditions such as `COUNT(*) > 5`.",
        ),
        q(
          "Explain GROUP BY with an example.",
          "GROUP BY partitions rows by equal key values so aggregates such as count, sum, minimum, maximum, and average can be computed per group.",
          "Every selected expression must normally be grouped or aggregated. For example, group orders by customer to calculate total spend. I also consider null grouping and whether joins duplicate rows before aggregation.",
          {
            code: `SELECT customer_id,
       COUNT(*) AS order_count,
       SUM(total_amount) AS total_spend
FROM orders
WHERE status = 'PAID'
GROUP BY customer_id;`,
            language: "sql",
          },
        ),
        q(
          "What are window functions?",
          "Window functions compute across related rows without collapsing them into one row per group. An `OVER` clause defines partition, order, and sometimes a moving frame.",
          "GROUP BY reduces rows; window functions preserve them. I use windows for ranking, running totals, previous-row comparison, and top N per group.",
        ),
        q(
          "ROW_NUMBER vs RANK vs DENSE_RANK?",
          "ROW_NUMBER assigns unique sequential numbers. RANK gives ties the same position and leaves gaps. DENSE_RANK gives ties the same position without gaps.",
          "For scores 100, 100, 90: ROW_NUMBER is 1,2,3; RANK is 1,1,3; DENSE_RANK is 1,1,2. I add a deterministic ORDER BY when selecting one row.",
        ),
        q(
          "Explain INNER, LEFT, RIGHT, and FULL joins.",
          "INNER returns matching rows from both sides. LEFT preserves every left row and fills unmatched right columns with null. RIGHT is the mirror. FULL preserves unmatched rows from both sides where supported.",
          "I choose joins from which side must be preserved. I am careful not to put a right-table filter in WHERE after a LEFT JOIN unless I intentionally want to remove unmatched rows and effectively turn it into an inner join.",
        ),
        q(
          "What is a self join?",
          "A self join uses the same table in two logical roles through aliases. It is common for adjacency relationships such as an employee pointing to a manager in the employee table.",
          "I alias the table by role so the query remains readable: employee `e` joins manager `m` on `e.manager_id = m.id`.",
          {
            code: `SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;`,
            language: "sql",
          },
        ),
        q(
          "Write SQL for employees earning more than their manager.",
          "Self-join employees to their manager and compare the two salary values.",
          "This is a self-join: one alias is the employee, the other is the manager. An inner join is appropriate because a top-level employee without a manager cannot satisfy the comparison.",
          {
            code: `SELECT e.id, e.name, e.salary,
       m.name AS manager_name, m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.id = e.manager_id
WHERE e.salary > m.salary;`,
            language: "sql",
          },
        ),
        q(
          "What are CTEs, and when do you use a recursive CTE?",
          "A common table expression names a query result for the following statement, improving composition and readability. A recursive CTE repeatedly joins its result to walk hierarchies or graphs until no more rows appear.",
          "I use ordinary CTEs to make complex SQL readable, not assuming they always materialize. I use recursive CTEs for employee hierarchies, category trees, and dependency paths, with a depth or cycle guard when data may be bad.",
        ),
        q(
          "How would you query an employee hierarchy?",
          "Start with the root employee as the anchor, then recursively join employees whose manager ID equals the previous level's employee ID. Carry depth and a path if ordering or cycle detection is needed.",
          "A recursive CTE is the natural relational solution. I index manager_id and define what happens with cycles or multiple roots.",
          {
            code: `WITH RECURSIVE hierarchy AS (
    SELECT id, name, manager_id, 0 AS depth
    FROM employees
    WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, e.manager_id, h.depth + 1
    FROM employees e
    JOIN hierarchy h ON e.manager_id = h.id
)
SELECT * FROM hierarchy ORDER BY depth, id;`,
            language: "sql",
          },
        ),
        q(
          "How do you get the top K most frequent values in SQL?",
          "Group by the value, count rows, order counts descending, and take K. Define tie behavior: a hard K rows uses limit/top, while rank can include every value tied at the boundary.",
          "I group and count, then order descending. If ties must all be preserved, I apply DENSE_RANK to the aggregated counts instead of using a hard limit.",
          {
            code: `SELECT product_id, COUNT(*) AS frequency
FROM order_items
GROUP BY product_id
ORDER BY frequency DESC
FETCH FIRST :k ROWS ONLY;`,
            language: "sql",
          },
        ),
        q(
          "How do you optimize a slow SQL query?",
          "Measure the real query and parameters, inspect the execution plan, identify scans, poor estimates, spills, sorts, and expensive joins, then reduce rows early or add the right index. Retest because an intuitive rewrite can be worse.",
          "My order is reproduce, plan, row counts, indexes, query shape, then schema or caching. I check sargability, selected columns, N+1 calls, stale statistics, lock waits, and parameter sensitivity before scaling hardware.",
        ),
      ],
    },
  ],
};

export const jpaHibernateCategory: PrepCategory = {
  ...jpaSqlCategory,
  name: "JPA / Hibernate",
  description: "ORM, entity lifecycle, fetching, caching, locking, and transactions",
  sections: [jpaSqlCategory.sections[0]],
};

export const sqlDatabaseCategory: PrepCategory = {
  ...jpaSqlCategory,
  name: "SQL & Databases",
  color: "#22d3ee",
  bg: "#0a1e24",
  icon: "🗃️",
  description: "SQL queries, joins, indexing, transactions, modeling, and optimization",
  sections: jpaSqlCategory.sections.slice(1),
};
