import { PrepCategory } from "./prep-types";
import { q } from "./prep-types";

export const javaCoreCategory: PrepCategory = {
  name: "Java Core",
  color: "#f59e0b",
  bg: "#21170a",
  icon: "☕",
  description: "OOP, strings, collections, memory, exceptions, Java 8, and concurrency",
  sections: [
    {
      label: "🧱 OOP & object design",
      questions: [
        q(
          "Explain the four OOP principles with a real-world example.",
          "The four pillars are encapsulation, abstraction, inheritance, and polymorphism. Encapsulation keeps an object's data and the rules that protect it together. Abstraction exposes only what a caller needs. Inheritance models an IS-A relationship. Polymorphism lets the same contract choose different behavior at runtime.",
          "I think of OOP as organizing code around objects with responsibilities. Encapsulation protects state, abstraction hides complexity, inheritance reuses a genuine IS-A relationship, and polymorphism lets me program to an interface. In a payment system, CardPayment and UpiPayment can both implement PaymentMethod while keeping their internal processing private.",
          {
            example: "A car exposes `accelerate()` without making the driver understand fuel injection. Its speed is private and changed through safe methods. An electric car may inherit common vehicle behavior, while different vehicle types implement `move()` differently.",
          },
        ),
        q(
          "What is the difference between abstraction and encapsulation?",
          "Abstraction answers “what can this thing do?” while hiding unnecessary implementation. Encapsulation answers “how do I keep this thing's state valid?” by bundling data and behavior behind an access boundary.",
          "Abstraction hides complexity from the caller; encapsulation protects the internals of an object. A repository interface abstracts whether data comes from SQL or an API. A BankAccount encapsulates its balance and only allows changes through deposit and withdraw rules.",
          {
            example: "A coffee machine's buttons are abstraction. Its sealed casing and controlled internal parts are encapsulation.",
            trap: "Saying both simply mean “data hiding.” Data hiding is part of encapsulation; abstraction is about presenting the right level of detail.",
          },
        ),
        q(
          "Interface vs abstract class: when would you choose each?",
          "An interface defines a capability or contract and supports multiple implementations. An abstract class is a partially built base type: it can hold instance state, constructors, protected helpers, and shared implementation. A class can implement many interfaces but extend only one class.",
          "I use an interface for a role such as PaymentProcessor because unrelated classes can implement it and callers stay loosely coupled. I use an abstract class when closely related types share state or a template workflow, such as an AbstractFileImporter with common parsing steps.",
          {
            details: "Modern interfaces may have abstract, default, static, and private methods, but no ordinary per-object mutable state. Abstract classes may contain concrete and abstract methods, constructors, and instance fields.",
          },
        ),
        q(
          "Can a Java interface have methods and fields?",
          "Yes. Interface methods may be abstract, `default`, `static`, or private helper methods. Interface fields are implicitly `public static final`, so they are constants rather than per-object state.",
          "Yes. Besides abstract methods, Java 8 added default and static methods, and Java 9 added private helper methods. Its fields are constants because they are implicitly public, static, and final. I still keep interfaces focused on contracts rather than using them as constant bags.",
          {
            code: `interface PaymentMethod {
    int MAX_RETRIES = 3;
    Receipt pay(Money amount);
    default boolean supportsRefund() { return false; }
    static boolean valid(Money amount) { return amount.isPositive(); }
}`,
          },
        ),
        q(
          "Why does Java not support multiple inheritance of classes?",
          "Multiple class inheritance can make state and behavior ambiguous. If two parents provide the same method or maintain overlapping state, the child has no obvious single implementation to inherit. This is the diamond problem.",
          "Java avoids multiple class inheritance to prevent ambiguous state and method resolution. It allows multiple interfaces instead. If two interfaces provide the same default method, the implementing class must resolve the conflict explicitly.",
          {
            example: "If `Phone` and `Camera` both inherited a different `start()` implementation into `SmartPhone`, which one should run? Java makes the choice explicit through interfaces and composition.",
          },
        ),
        q(
          "What is the difference between method overloading and overriding?",
          "Overloading means the same method name has different parameter lists, usually in one class. The compiler selects the method, so it is compile-time polymorphism. Overriding means a subclass supplies a new implementation with the same compatible signature. Runtime dispatch selects it.",
          "Overloading is resolved at compile time from the declared argument types; overriding is resolved at runtime from the actual object type. Return type alone cannot overload a method, and an overriding method cannot reduce visibility or throw broader checked exceptions.",
          {
            code: `class Printer {
    void print(String value) {}       // overload
    void print(int value) {}
}

class Animal { void speak() {} }
class Dog extends Animal {
    @Override void speak() {}         // override
}`,
          },
        ),
        q(
          "Explain runtime polymorphism and dynamic method dispatch.",
          "A parent-type reference can point to a child object. When an overridden instance method is called, the JVM chooses the implementation using the object's actual runtime type, not the reference's declared type.",
          "Runtime polymorphism is dynamic dispatch of overridden instance methods. For example, a List reference may hold an ArrayList, and a PaymentProcessor reference may hold StripeProcessor. This lets callers depend on a stable contract while implementations vary.",
          {
            code: `PaymentProcessor processor = new UpiProcessor();
processor.pay(amount); // UpiProcessor.pay runs`,
            trap: "Fields and static methods are not dynamically dispatched in the same way; they are resolved from the reference/class.",
          },
        ),
        q(
          "What is compile-time polymorphism?",
          "It is usually method overloading: the compiler picks a method using the method name, number of arguments, and declared argument types. No runtime object decision is needed.",
          "Compile-time polymorphism is overloading. The compiler binds the call to the most specific compatible signature. It is different from overriding, where the JVM chooses the implementation from the runtime object.",
          {
            example: "`Math.max(int, int)` and `Math.max(double, double)` share a name, but the compiler selects one from the arguments.",
          },
        ),
        q(
          "What is the difference between an IS-A and a HAS-A relationship?",
          "IS-A means inheritance or interface realization: a SavingsAccount is an Account. HAS-A means composition: an Order has a PaymentMethod. IS-A substitutes one type for another; HAS-A delegates work to a contained collaborator.",
          "I use IS-A only when the child can safely replace the parent according to the Liskov principle. I use HAS-A for most reuse because it keeps collaborators replaceable. An Order has a PricingStrategy; making Order inherit PricingStrategy would model the domain incorrectly.",
        ),
        q(
          "Composition vs inheritance: why is composition usually preferred?",
          "Inheritance creates tight compile-time coupling to one base class and exposes protected implementation details. Composition assembles behavior from collaborators, so it is easier to replace, test, and evolve. It also avoids fragile deep hierarchies.",
          "I prefer composition for code reuse because I can inject and swap behavior without changing the class hierarchy. I reserve inheritance for a stable, genuine subtype relationship. ‘Favor composition’ is guidance, not a ban on inheritance.",
          {
            example: "A ReportService can contain a `Formatter` and switch between PDF and CSV. If it inherited `PdfFormatter`, adding CSV would force an awkward hierarchy.",
          },
        ),
        q(
          "What are association, aggregation, and composition?",
          "Association is any relationship between objects. Aggregation is a weak whole-part relationship where the part can live independently. Composition is a strong ownership relationship where the part's lifecycle belongs to the whole.",
          "A Doctor and Patient are associated. A Department aggregates Employees because employees can exist after that department changes. An Order composes OrderLines because those lines have no useful independent lifecycle. The difference is mainly ownership and lifecycle.",
        ),
        q(
          "What do SOLID principles mean in practical Java design?",
          "SOLID means: one reason to change; extend behavior without constantly editing stable code; subtypes remain substitutable; clients depend on small focused interfaces; and high-level policy depends on abstractions, not concrete infrastructure.",
          "I use SOLID as design pressure, not ceremony. I keep controllers thin, split broad interfaces, inject repository contracts, and add strategies for variable rules. The goal is code that changes locally and remains testable—not creating an interface for every three-line class.",
        ),
      ],
    },
    {
      label: "🧵 String & immutability",
      questions: [
        q(
          "Why is String immutable in Java?",
          "Once a String is created, its character content cannot change. This makes pooled strings safe to share, keeps hash codes stable for map keys, improves thread safety, and prevents security-sensitive values such as class names or URLs from changing after validation.",
          "String is immutable so the JVM can safely pool and share it, its hash remains stable in HashMap, and callers cannot mutate security-sensitive values behind another component's back. Operations like concat return a new String.",
          {
            example: "`name.toUpperCase()` does not change `name`; it returns another String.",
          },
        ),
        q(
          "String vs StringBuilder: which should you use?",
          "String is an immutable value and is ideal for text that should not change. StringBuilder owns a resizable mutable character buffer, making repeated appends in a loop much cheaper than creating many intermediate Strings.",
          "I use String for ordinary values and StringBuilder when constructing text through many mutations, especially in loops. The compiler already optimizes a simple `a + b + c`, so I do not introduce StringBuilder everywhere.",
          {
            code: `StringBuilder csv = new StringBuilder();
for (String name : names) {
    csv.append(name).append(',');
}
String result = csv.toString();`,
          },
        ),
        q(
          "StringBuffer vs StringBuilder: what is the difference?",
          "Both are mutable character sequences. StringBuffer synchronizes its methods, while StringBuilder does not. That makes StringBuilder normally faster and the default for local variables; StringBuffer is a legacy thread-safe option.",
          "The difference is synchronization. I choose StringBuilder for request-local construction. If multiple threads really must edit one buffer, I first reconsider the design; StringBuffer is available, but sharing a mutable buffer often creates unnecessary contention.",
        ),
        q(
          "What is the Java String Pool?",
          "The String Pool is a JVM-managed store of canonical String instances. Identical string literals in the same runtime can refer to the same object, which saves memory because literals occur frequently.",
          "String literals are interned, so two occurrences of `\"abc\"` normally reference the same pooled object. This is an optimization, but business comparisons must still use `equals`, not rely on reference identity.",
          {
            code: `String a = "abc";
String b = "abc";
System.out.println(a == b);       // usually true: same pooled object
System.out.println(a.equals(b));  // true: same characters`,
          },
        ),
        q(
          "What is the difference between new String(\"abc\") and the literal \"abc\"?",
          "The literal uses the pooled canonical instance. `new String(\"abc\")` explicitly creates a distinct heap object whose content equals the pooled string.",
          "The literal reuses the pool; `new String` forces another object. Therefore their contents are equal but their references are usually different. I almost never call the String constructor because it adds an unnecessary object.",
          {
            code: `String pooled = "abc";
String copied = new String("abc");
pooled == copied;      // false
pooled.equals(copied); // true`,
          },
        ),
        q(
          "What is the difference between == and equals() in Java?",
          "`==` compares primitive values or, for objects, whether two references point to the exact same object. `equals()` expresses logical content equality when a class overrides it.",
          "For Strings and value objects I use `equals` for content. I use `==` for primitives, enum constants, or intentional identity checks. To be null-safe I can use `Objects.equals(a, b)`.",
          {
            trap: "A class that does not override `equals` inherits Object's identity comparison, so `equals` is not automatically a field-by-field comparison.",
          },
        ),
        q(
          "What does String.intern() do?",
          "`intern()` returns the canonical pooled representation of an equal String. If the pool has no equal value, that value is added and its canonical reference is returned.",
          "Intern converts equal strings to a shared canonical reference. It can reduce memory for very repetitive values, but I use it cautiously because the global pool adds lookup and memory pressure. It is never required for correct equality.",
        ),
        q(
          "Why is the String class final?",
          "If String could be subclassed, a subtype could violate immutability or change equality and hashing behavior. Marking it final preserves the guarantees relied on by pooling, class loading, security APIs, and hash-based collections.",
          "String is final to protect its immutable value semantics. The JVM and Java libraries can safely share and trust a String because no subclass can override behavior and make the value appear to change.",
        ),
        q(
          "Why does String work well as a HashMap key?",
          "String is immutable, has content-based equals, and caches or efficiently computes a stable hash. Once inserted, it cannot change bucket identity, so lookup remains reliable.",
          "A good key needs stable equality and hash behavior. String provides both because it is immutable and compares by characters. Custom keys should offer the same property—usually by being immutable and overriding equals and hashCode together.",
        ),
      ],
    },
    {
      label: "🗂️ Collections",
      questions: [
        q(
          "ArrayList vs LinkedList: which is the better default?",
          "ArrayList stores elements in a contiguous resizable array, giving O(1) indexed access and good CPU-cache locality. LinkedList stores nodes with next/previous pointers, so indexing is O(n) and each element costs more memory.",
          "ArrayList is my default. LinkedList only helps when I already have an iterator/node position and perform many insertions there. Even for queues, ArrayDeque is usually better. Big-O alone hides allocation and cache costs.",
        ),
        q(
          "HashMap vs Hashtable: what is the difference?",
          "HashMap is unsynchronized, allows one null key and null values, and is the modern general-purpose map. Hashtable is a legacy synchronized class, allows no nulls, and locks operations broadly.",
          "For single-threaded or externally confined state I use HashMap. For shared concurrent access I use ConcurrentHashMap, not Hashtable, because it offers better concurrency and modern atomic methods.",
        ),
        q(
          "Explain how HashMap works internally in Java 8+.",
          "HashMap spreads the key's hash, calculates a bucket index, and stores an entry there. On get, it finds the bucket then checks hash and `equals`. Collisions share a bucket as a linked list; a sufficiently large crowded bucket can become a red-black tree.",
          "HashMap uses hashCode to choose a bucket and equals to find the exact key inside it. Average get and put are O(1). Java 8 can treeify a heavily collided bucket, making that bucket's lookup O(log n), provided the table is large enough.",
          {
            details: "The default load factor is 0.75. Crossing `capacity × loadFactor` triggers resize. Treeification normally needs at least 8 entries in a bucket and table capacity of at least 64; otherwise resizing is preferred.",
          },
        ),
        q(
          "How does ConcurrentHashMap provide thread-safe concurrency?",
          "Modern ConcurrentHashMap allows lock-free or very low-contention reads and uses CAS plus fine-grained synchronization for updates rather than locking the entire map. It also provides atomic compound operations such as `computeIfAbsent`.",
          "ConcurrentHashMap is designed for shared maps with many readers and writers. Reads generally do not take a global lock; writes coordinate per bucket using CAS or small synchronized regions. It rejects nulls because null would be ambiguous during concurrent reads.",
          {
            code: `counts.computeIfAbsent(key, ignored -> new LongAdder()).increment();`,
          },
        ),
        q(
          "How does HashSet work internally?",
          "HashSet is backed by a HashMap. Each set element becomes a map key and all keys point to the same dummy value. Uniqueness therefore comes from the key's `hashCode` and `equals`.",
          "HashSet delegates storage to HashMap, so add and contains are average O(1). If a custom object's equality or hash changes after insertion, the set may no longer find it—another reason set elements should have stable identity.",
        ),
        q(
          "What is TreeMap and when would you use it?",
          "TreeMap is a sorted map backed by a red-black tree. Key operations are O(log n), and it can answer ordering questions such as first, last, floor, ceiling, and range views.",
          "I choose TreeMap when I need keys kept sorted or navigation operations, not just lookup. HashMap is faster on average for plain lookup. Keys need natural ordering or a Comparator consistent with the intended equality.",
        ),
        q(
          "What is TreeSet and how does it decide duplicates?",
          "TreeSet is a sorted set backed by a TreeMap. It uses `compareTo` or a Comparator; if comparison returns zero, the element is treated as a duplicate even if `equals` says otherwise.",
          "TreeSet gives unique sorted values with O(log n) operations. I make its comparator consistent with equals, because returning zero means ‘same element’ to the set and can silently discard a value.",
        ),
        q(
          "Which Queue implementations should you know?",
          "ArrayDeque is the usual fast FIFO queue or double-ended queue. PriorityQueue removes by priority rather than insertion order. LinkedList also implements Deque but is rarely the best default. ConcurrentLinkedQueue is non-blocking, while BlockingQueue implementations support producer-consumer coordination.",
          "For normal FIFO I use ArrayDeque; for top-priority work, PriorityQueue; for bounded worker pipelines, ArrayBlockingQueue or LinkedBlockingQueue; and for lock-free shared FIFO, ConcurrentLinkedQueue.",
        ),
        q(
          "How does PriorityQueue work, and is its iteration sorted?",
          "PriorityQueue is normally a binary min-heap. The head is the smallest element under natural order or a Comparator. Offer and poll are O(log n), peek is O(1), but iterating the collection does not produce fully sorted order.",
          "PriorityQueue is ideal when I repeatedly need the next smallest or largest item, such as top K. Only the head is guaranteed. If I need every value sorted, I poll into a result or sort separately.",
        ),
        q(
          "Why is Stack considered legacy, and what should replace it?",
          "`Stack` extends Vector and carries legacy synchronized behavior and an awkward API. `Deque` expresses stack operations directly with `push`, `pop`, and `peek`; ArrayDeque is usually faster.",
          "I use `Deque<T> stack = new ArrayDeque<>()` instead of Stack. It avoids legacy Vector inheritance and also supports queue behavior when needed. ArrayDeque does not allow null, which keeps empty results unambiguous.",
        ),
        q(
          "What are fail-fast and fail-safe iterators?",
          "A fail-fast iterator detects structural modification outside the iterator and usually throws ConcurrentModificationException on a best-effort basis. So-called fail-safe iterators traverse a snapshot or weakly consistent view and continue during concurrent updates.",
          "ArrayList and HashMap iterators are fail-fast, which helps expose unsafe modification but is not a thread-safety guarantee. CopyOnWriteArrayList iterates a snapshot; ConcurrentHashMap iterators are weakly consistent. ‘Fail-safe’ is common interview language, not an official Java interface.",
        ),
        q(
          "Iterator vs ListIterator: what extra capability does ListIterator provide?",
          "Iterator moves forward and can remove the current element. ListIterator works only with lists and can move in both directions, report indices, replace an element, and add during traversal.",
          "I use Iterator for generic collection traversal. I use ListIterator when list-specific bidirectional editing is required. I modify through the iterator itself to avoid fail-fast structural modification errors.",
        ),
        q(
          "Comparable vs Comparator: when do you use each?",
          "Comparable defines a type's single natural order inside the class via `compareTo`. Comparator is an external strategy, so a type can have multiple orderings and third-party types can be sorted without modification.",
          "I use Comparable for an obvious natural order, such as an ID or date. I use Comparator for business-specific views like employee by salary then name. Comparators compose cleanly with `comparing` and `thenComparing`.",
          {
            code: `Comparator<Employee> bySalaryThenName =
    Comparator.comparing(Employee::salary)
              .thenComparing(Employee::name);`,
          },
        ),
        q(
          "Why is HashMap lookup described as O(1), and when is it not?",
          "A well-distributed hash points directly to one of many buckets, so the expected amount of work per lookup stays roughly constant as the map grows. Collisions, expensive hash/equality methods, and resize costs can change the real cost.",
          "HashMap lookup is average O(1), not guaranteed O(1). A badly designed hash can crowd one bucket. Java 8 tree bins limit a heavily collided bucket toward O(log n), while an individual resize is O(n) but amortized over many inserts.",
        ),
        q(
          "Explain the equals() and hashCode() contract.",
          "`equals` must be reflexive, symmetric, transitive, consistent, and false for null. Equal objects must have the same hash code. Unequal objects may share a hash, though good distribution matters for performance.",
          "I always override equals and hashCode together using the same stable fields. Hash collections first choose a bucket using hashCode, then use equals to confirm the key. Mutating those fields after insertion can make the entry effectively unreachable.",
        ),
        q(
          "List, Set, and Map: how do you choose?",
          "A List preserves position and allows duplicates. A Set represents unique membership. A Map associates unique keys with values. The domain question—order, uniqueness, or lookup—should choose the interface before a concrete implementation.",
          "I start with the contract: List for an ordered sequence, Set for unique items, Map for key-based access. Then I choose ArrayList, HashSet, HashMap, sorted, or concurrent variants based on ordering and concurrency needs.",
        ),
        q(
          "What happens when a HashMap resizes?",
          "When size exceeds capacity times load factor, HashMap creates a larger bucket array and redistributes entries based on the new capacity. This costs O(n) for that operation, so repeated poor sizing can add latency.",
          "Resize is occasional linear work, which is why HashMap remains amortized O(1). If I know a large expected size, I pre-size the map to reduce resizing, but I avoid huge speculative capacity that wastes memory.",
        ),
        q(
          "What are immutable and unmodifiable collections?",
          "An unmodifiable view blocks changes through that reference but can still reflect changes made to its backing collection. An immutable collection owns content that cannot change. `List.copyOf` and `List.of` create unmodifiable value-based lists.",
          "I distinguish a read-only wrapper from an immutable snapshot. `Collections.unmodifiableList(original)` can change when `original` changes; `List.copyOf(original)` takes a shallow snapshot. The elements themselves may still be mutable.",
        ),
        q(
          "ArrayDeque vs LinkedList for a queue or deque?",
          "ArrayDeque uses a resizable circular array, avoids one node allocation per element, and has better memory locality. LinkedList pays pointer and allocation costs. Both provide constant-time end operations.",
          "ArrayDeque is my default queue, deque, and stack. LinkedList is useful only in unusual cases requiring its List and Deque nature together; most code is clearer and faster with ArrayDeque.",
        ),
      ],
    },
    {
      label: "🧠 JVM memory & garbage collection",
      questions: [
        q(
          "What is stored in heap memory?",
          "The heap is shared JVM memory where objects and arrays normally live. Garbage collectors reclaim objects that are no longer reachable from GC roots. Modern collectors divide or region the heap to make collection more efficient.",
          "Objects normally live on the heap, which all threads share. The garbage collector manages their lifetime. A local variable may hold a reference on a thread's stack while the referenced object lives on the heap.",
        ),
        q(
          "What is stored in a thread's stack?",
          "Each thread has its own stack made of frames for active method calls. A frame holds local variables, operand data, and return information. Deep or unbounded recursion can exhaust it and cause StackOverflowError.",
          "The stack is per-thread and follows method calls; the heap is shared and holds objects. Primitive locals may be stored directly in a frame, while object variables hold references. Stack data disappears naturally when a method returns.",
        ),
        q(
          "What is Metaspace?",
          "Metaspace stores class metadata using native memory. It replaced PermGen in Java 8 and can grow until configured or native-memory limits are reached. Class loaders must become unreachable for their classes to be unloaded.",
          "Metaspace holds class-level metadata outside the regular heap. A common leak pattern is retaining class loaders during repeated redeployments, which keeps their class metadata alive and can produce OutOfMemoryError: Metaspace.",
        ),
        q(
          "How does Java garbage collection work at a high level?",
          "GC starts from roots such as live stack references, static fields, and JNI handles, then traces reachable objects. Unreachable objects are collectible. Generational collectors optimize for the observation that most objects die young.",
          "Java GC is reachability-based, not reference-counting. Young collections reclaim short-lived objects frequently; older survivors are handled less often. I tune only after measuring pause time, allocation rate, heap occupancy, and application goals.",
          {
            trap: "`System.gc()` is only a request, and `finalize()` is deprecated and unreliable for resource cleanup. Use try-with-resources for external resources.",
          },
        ),
        q(
          "What are strong, soft, weak, and phantom references?",
          "A strong reference keeps an object alive. A softly reachable object may survive until memory pressure, though soft references are poor general caches. Weak references are cleared once no strong path remains. Phantom references are enqueued after final reachability processing and support advanced cleanup tracking.",
          "Normal variables are strong references. WeakHashMap can associate metadata without extending a key's lifetime. PhantomReference with ReferenceQueue is for low-level lifecycle tracking. For production caches I prefer a real cache library with explicit size and expiry policies.",
        ),
        q(
          "Can Java have memory leaks even with garbage collection?",
          "Yes. GC only removes unreachable objects. A leak occurs when code accidentally keeps references to objects it no longer needs—for example an unbounded static map, listener, ThreadLocal, queue, or cache.",
          "A Java leak is usually unwanted reachability. I confirm it with heap usage trends, a heap dump, dominator tree, and GC logs; then trace the retaining path. The fix is to remove the reference or bound the data structure, not simply increase heap size.",
        ),
        q(
          "What is the difference between StackOverflowError and OutOfMemoryError?",
          "StackOverflowError usually means one thread exhausted its call stack, often through runaway recursion. OutOfMemoryError means the JVM could not allocate in a memory area such as heap, metaspace, direct buffer memory, or native threads.",
          "I diagnose StackOverflow by examining repeating frames. For OOM I first read the exact message, capture heap/native evidence, and check allocation and retention. They are Errors, so ordinary business code should not pretend it can safely recover.",
        ),
      ],
    },
    {
      label: "🚨 Exception handling",
      questions: [
        q(
          "Checked vs unchecked exceptions: when should you use each?",
          "Checked exceptions must be caught or declared and can model a recoverable condition a caller is expected to handle. Unchecked exceptions extend RuntimeException and usually signal programming mistakes, invalid arguments, or business rules handled at an application boundary.",
          "I use checked exceptions sparingly when the caller has a meaningful recovery action, such as an I/O fallback. I use domain-specific unchecked exceptions for invalid application state and translate them once at the API boundary. I do not use exceptions for normal control flow.",
        ),
        q(
          "How does finally work, and when might it not run?",
          "`finally` normally runs after try/catch whether control returns or an exception is thrown, so it can release resources. It may not run if the JVM terminates abruptly, the process crashes, or execution never leaves the try block.",
          "Finally is guaranteed for normal control flow, including return, but I prefer try-with-resources for AutoCloseable resources because it is safer and preserves suppressed exceptions correctly.",
          {
            trap: "Returning from `finally` hides earlier returns and exceptions. It is legal but dangerous and should be avoided.",
          },
        ),
        q(
          "What is try-with-resources?",
          "It automatically closes resources that implement AutoCloseable, in reverse declaration order, even when work fails. If both the body and close fail, the body's exception remains primary and close failures are recorded as suppressed.",
          "I use try-with-resources for streams, JDBC connections, statements, and similar resources. It is clearer and less error-prone than a manual finally block.",
          {
            code: `try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    return statement.executeQuery();
}`,
          },
        ),
        q(
          "What is the difference between throw and throws?",
          "`throw` is a statement that actually raises one exception object. `throws` is part of a method declaration and advertises exception types that may leave the method.",
          "`throw new OrderNotFoundException(id)` creates the failure at a specific point. `throws IOException` tells callers that the method may propagate that checked exception. One acts; the other declares a contract.",
        ),
        q(
          "How do you create and use a custom exception?",
          "Create a meaningful domain type extending RuntimeException or Exception, carry useful context, preserve the original cause when wrapping, and handle it at the right boundary rather than catching it everywhere.",
          "I create custom exceptions to express domain meaning, such as InsufficientStockException. A global exception handler maps it to a stable API error and status code. I never expose stack traces or internal database messages to clients.",
          {
            code: `final class InsufficientStockException extends RuntimeException {
    InsufficientStockException(String sku, int requested) {
        super("Insufficient stock for " + sku + ", requested " + requested);
    }
}`,
          },
        ),
        q(
          "Explain the Java exception hierarchy.",
          "`Throwable` has two main branches: Error and Exception. Errors represent serious JVM or environment failures. Exceptions are application-level failures. RuntimeException and its children are unchecked; most other Exception types are checked.",
          "I catch the narrowest exception I can handle and let unexpected failures reach a centralized boundary. Catching Throwable or Error is rarely safe, and catching Exception just to log and continue can leave the application in an invalid state.",
        ),
      ],
    },
    {
      label: "🌊 Java 8 functional programming",
      questions: [
        q(
          "What is a lambda expression?",
          "A lambda is a concise implementation of a functional interface. It can capture effectively final variables from its surrounding scope and lets behavior be passed like data.",
          "A lambda replaces boilerplate anonymous classes when there is one abstract method. For example, `orders.removeIf(order -> order.isExpired())`. I keep lambdas small; complex business logic gets a named method.",
        ),
        q(
          "What is a functional interface?",
          "It has exactly one abstract method, so a lambda or method reference can implement it. It may still inherit Object methods and contain default or static methods. `@FunctionalInterface` asks the compiler to enforce the rule.",
          "Runnable, Comparator, Predicate, and Function are functional interfaces. The single abstract method gives the lambda its target type. I add `@FunctionalInterface` to custom contracts to protect that intent.",
        ),
        q(
          "Explain Predicate, Consumer, Supplier, and Function.",
          "`Predicate<T>` tests T and returns boolean. `Consumer<T>` accepts T and returns nothing. `Supplier<T>` produces T without input. `Function<T,R>` transforms T into R.",
          "I remember them as test, use, create, transform. Predicates compose with and/or/negate; Functions compose; Suppliers are useful for lazy creation; Consumers commonly represent side effects.",
          {
            code: `Predicate<Order> paid = Order::isPaid;
Consumer<Order> publish = eventBus::publish;
Supplier<UUID> ids = UUID::randomUUID;
Function<Order, OrderDto> toDto = mapper::toDto;`,
          },
        ),
        q(
          "What is a method reference?",
          "A method reference is shorthand for a lambda that only calls an existing method. Forms include static methods, a bound instance, an arbitrary instance of a type, and constructors.",
          "`users.stream().map(User::name)` is equivalent to `user -> user.name()`. I use method references when they improve clarity, not when readers must work to infer which overload is selected.",
        ),
        q(
          "How should Optional be used?",
          "Optional explicitly models that a return value may be absent and encourages callers to handle that case. It is mainly a return type, not a universal replacement for null in fields, DTOs, method parameters, or JPA entities.",
          "I return Optional from lookup methods when absence is normal. I prefer `map`, `flatMap`, `orElseGet`, or `orElseThrow` over calling get. I use `orElseGet` when the fallback is expensive because `orElse` evaluates eagerly.",
        ),
        q(
          "How do Java streams work?",
          "A stream is a lazy pipeline over a data source. Intermediate operations such as filter and map describe transformations; a terminal operation such as collect or reduce triggers traversal. Streams do not store data.",
          "I use streams for clear data transformations, not as a claim of automatic speed. A stream pipeline is lazy until a terminal operation. It should avoid shared mutable state, and a source generally cannot be reused after consumption.",
        ),
        q(
          "What is the difference between map() and flatMap()?",
          "`map` turns each input into one output. `flatMap` turns each input into a nested stream-like value and flattens those values into one level.",
          "If every department maps to a List of employees, `map` produces Stream<List<Employee>>, while `flatMap(dept -> dept.employees().stream())` produces Stream<Employee>. Optional.flatMap similarly avoids Optional<Optional<T>>.",
        ),
        q(
          "How do filter(), collect(), and reduce() differ?",
          "`filter` keeps elements matching a predicate. `collect` accumulates into a mutable result container such as a list or grouped map. `reduce` combines values into a single immutable result using an associative operation.",
          "I filter to select, map to transform, collect to build a container, and reduce for values such as sum or maximum. For parallel reduction, the identity and combiner must obey associativity and identity rules.",
          {
            code: `Map<String, Long> byStatus = orders.stream()
    .filter(Order::isActive)
    .collect(Collectors.groupingBy(Order::status, Collectors.counting()));`,
          },
        ),
        q(
          "When should you use parallel streams?",
          "Parallel streams split work across the common ForkJoinPool. They can help large, CPU-heavy, easily partitioned, stateless operations after measurement. They often hurt small tasks, blocking I/O, ordered pipelines, or shared-state operations.",
          "I do not add `parallel()` by instinct. I benchmark with production-like data, confirm the work is CPU-bound, and consider common-pool interference. In server code I usually prefer an explicitly managed executor so concurrency and isolation are visible.",
        ),
        q(
          "What is stream lazy evaluation and short-circuiting?",
          "Intermediate operations do no work until a terminal operation requests values. Elements flow through the pipeline one at a time, allowing operations such as findFirst, anyMatch, or limit to stop early.",
          "Streams are fused and lazy. `filter(...).map(...).findFirst()` does not filter the whole collection first—it processes only enough elements to find a result. That can improve efficiency and explains why side effects inside stream operations are unreliable.",
        ),
      ],
    },
    {
      label: "🧵 Multithreading & concurrency",
      questions: [
        q(
          "Explain the Java thread lifecycle.",
          "Java exposes NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, and TERMINATED. RUNNABLE includes code ready to run and code currently executing; BLOCKED means waiting to enter a synchronized monitor.",
          "A thread starts NEW, becomes RUNNABLE after start, may wait or block for coordination, and ends TERMINATED. I use thread dumps to distinguish blocked-on-monitor from waiting-on-condition rather than guessing from CPU symptoms.",
        ),
        q(
          "Runnable vs extending Thread: which should you use?",
          "Runnable represents a unit of work; Thread is the mechanism that runs it. Separating them preserves inheritance freedom, improves testing, and lets an executor manage the actual threads.",
          "I implement Runnable or, more often, submit tasks to ExecutorService. Extending Thread tightly couples the task to thread creation and is rarely needed unless I am customizing Thread behavior itself.",
        ),
        q(
          "Callable vs Runnable, and what is Future?",
          "Runnable returns no value and cannot declare checked exceptions. Callable returns a value and may throw. Submitting either to an ExecutorService returns a Future that represents completion, result, cancellation, or failure.",
          "I use Callable when a background task produces a result. Future.get blocks, can time out, and wraps task failure in ExecutionException. For composing asynchronous stages, CompletableFuture is more expressive.",
        ),
        q(
          "What is CompletableFuture and how do you handle errors?",
          "CompletableFuture represents a value that may arrive later and supports pipelines: transform with thenApply, start dependent async work with thenCompose, combine independent work, and recover with exceptionally or handle.",
          "I use CompletableFuture when independent I/O calls can run concurrently or stages need composition. I supply an application-owned executor, handle timeouts and exceptions, and avoid blocking with join in the middle of an async pipeline.",
          {
            code: `CompletableFuture<User> user = supplyAsync(() -> loadUser(id), executor);
CompletableFuture<List<Order>> orders =
    user.thenCompose(u -> supplyAsync(() -> loadOrders(u.id()), executor));
return orders.orTimeout(2, TimeUnit.SECONDS)
             .exceptionally(ex -> List.of());`,
          },
        ),
        q(
          "What does synchronized guarantee?",
          "A synchronized method or block gives mutual exclusion for the same monitor and establishes a happens-before visibility relationship when a lock is released then acquired. The critical part is that every access follows the same locking discipline.",
          "Synchronized protects a critical section with one monitor and also makes preceding writes visible to the next holder. I lock the smallest coherent state transition, avoid calling slow external services while holding the lock, and use a private lock object when appropriate.",
        ),
        q(
          "What does volatile guarantee, and what does it not guarantee?",
          "Volatile guarantees visibility and ordering for reads and writes of that variable. It does not make a read-modify-write sequence such as `count++` atomic.",
          "I use volatile for a simple state flag where one thread writes and others read. For counters I use AtomicInteger or locking. Visibility is not the same as atomicity.",
          {
            code: `private volatile boolean running = true; // good flag
// volatile int count; count++ is still a race`,
          },
        ),
        q(
          "How does AtomicInteger work, and when is it useful?",
          "AtomicInteger provides lock-free atomic operations such as increment and compareAndSet, typically using CPU compare-and-swap. It is ideal for one independently changing integer but does not protect invariants across several variables.",
          "I use AtomicInteger for counters or sequence state. If I must update balance and status together, one atomic integer is not enough—I use a lock or immutable state updated atomically. For very hot counters, LongAdder can reduce contention.",
        ),
        q(
          "synchronized vs Lock: when is Lock worth using?",
          "The synchronized keyword is simpler and releases automatically. Lock implementations provide timed and interruptible acquisition, tryLock, fairness options, and multiple Condition objects, but must be unlocked in finally.",
          "I start with synchronized for simple mutual exclusion. I use ReentrantLock when I need tryLock, a timeout, interruptible waiting, or multiple conditions. The extra control comes with extra responsibility.",
          {
            code: `lock.lock();
try {
    updateSharedState();
} finally {
    lock.unlock();
}`,
          },
        ),
        q(
          "What is ExecutorService and why use a thread pool?",
          "ExecutorService separates task submission from thread management. A pool reuses threads, bounds or controls concurrency, queues work, and supports orderly shutdown. Creating a raw thread per request is costly and unbounded.",
          "I choose pool size and queue policy from the workload. CPU work is near core count; blocking I/O may allow more concurrency but needs downstream limits. I always plan rejection, metrics, and graceful shutdown rather than using an unbounded queue blindly.",
        ),
        q(
          "What is a race condition?",
          "A race occurs when correctness depends on unpredictable interleaving between threads. The classic check-then-act sequence can let two threads both observe an old state and perform an action that should happen once.",
          "I identify the invariant, then make the whole state transition atomic using synchronization, a lock, an atomic database update, or an atomic concurrent collection method. Making only one variable volatile does not fix a multi-step race.",
        ),
        q(
          "What is a deadlock and how do you prevent it?",
          "Deadlock occurs when threads wait in a cycle for locks held by each other. Prevention includes consistent lock ordering, small critical sections, avoiding nested locks, and timed tryLock where recovery is possible.",
          "I confirm a suspected deadlock with a thread dump, which shows the ownership cycle. I prevent it with a global lock order and by not holding locks during I/O. A timeout limits damage but does not replace correct ordering.",
        ),
        q(
          "What is CountDownLatch?",
          "CountDownLatch is a one-shot gate initialized with a count. Worker threads call countDown; waiting threads continue when it reaches zero. It cannot be reset.",
          "I use CountDownLatch when one task must wait for a known set of independent startup or test operations. For a reusable meeting point I would consider CyclicBarrier or Phaser.",
        ),
        q(
          "What is Semaphore?",
          "Semaphore owns a number of permits. Threads acquire before entering a limited resource and release afterward. It limits concurrency rather than forcing only one thread.",
          "I use a semaphore to cap concurrent calls to a fragile downstream service or a small resource pool. I release in finally and decide explicitly whether acquisition should block, time out, or fail fast.",
        ),
        q(
          "What is the difference between wait(), sleep(), and join()?",
          "`wait` releases the object's monitor and waits for notification; it must be used under that monitor. `sleep` pauses the current thread without releasing locks. `join` waits for another thread to terminate.",
          "I avoid low-level wait/notify unless implementing a concurrency primitive. BlockingQueue, latches, and futures express intent more safely. A key interview point is that sleep does not release a held monitor, while wait does.",
        ),
        q(
          "How do you size a thread pool?",
          "CPU-bound work usually starts near the number of available cores. I/O-bound work can use more threads because many wait, but the correct limit also depends on memory, latency targets, database connections, and downstream capacity.",
          "I start from workload type, then load-test and observe queue time, active threads, CPU, memory, and downstream saturation. A pool cannot create capacity in the database; setting 500 workers against 20 connections often makes latency worse.",
        ),
        q(
          "What are virtual threads, and when would you use them?",
          "Virtual threads are lightweight JVM-managed threads designed to make high-concurrency blocking-style I/O code practical. Many virtual threads are scheduled over fewer platform threads. They do not make CPU work faster.",
          "I use virtual threads for large numbers of mostly blocking I/O tasks when the libraries fit that model. I still bound scarce downstream resources, avoid long pinning operations, and measure. They simplify the programming model; they do not remove database or API limits.",
        ),
      ],
    },
  ],
};
