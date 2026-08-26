import Interview from '../models/Interview.js';
import mongoose from 'mongoose';

// Predefined pools of questions, categorized keywords, scoring rubrics, and 100% model answers
const questionPool = {
  Architecture: {
    Easy: [
      {
        id: 1,
        question: "Explain the MVC (Model-View-Controller) architectural pattern and how data and control flow between each component.",
        keywords: ["model", "view", "controller", "data", "business logic", "separation of concerns", "route", "database"],
        idealAnswer: "MVC separates an application into three interconnected components: 1) Model represents the core business logic, schema, and database interactions. 2) View renders the UI presentation to the user. 3) Controller intercepts incoming HTTP requests via routes, queries or mutates the Model, and determines which View or JSON response to return. This guarantees strict separation of concerns, maintainability, and testability."
      },
      {
        id: 2,
        question: "What are the core differences between Monolithic and Microservices software architectures?",
        keywords: ["monolith", "microservices", "decoupled", "independent", "deploy", "scalability", "api gateway", "service"],
        idealAnswer: "In a Monolithic architecture, all functional modules (auth, billing, catalog) share a single codebase and deployment unit. In Microservices, the system is decomposed into decoupled, independently deployable services organized around business domains. Microservices communicate via lightweight protocols (REST/gRPC/Kafka), enable granular horizontal scalability and polyglot stacks, but introduce network latency, distributed data consistency challenges, and operational overhead requiring API Gateways."
      }
    ],
    Medium: [
      {
        id: 3,
        question: "Explain the SOLID principles in Software Engineering and why they are essential for maintainable system design.",
        keywords: ["solid", "single responsibility", "open-closed", "liskov", "interface segregation", "dependency inversion", "maintainability", "coupling"],
        idealAnswer: "SOLID consists of 5 object-oriented design principles: 1) Single Responsibility (a class should have only one reason to change). 2) Open-Closed (classes should be open for extension but closed for modification). 3) Liskov Substitution (subtypes must be substitutable for their base types without altering program correctness). 4) Interface Segregation (clients should not depend on interfaces they do not use; prefer fine-grained interfaces). 5) Dependency Inversion (high-level modules should not depend on low-level modules; both should depend on abstractions/interfaces). They reduce coupling, maximize cohesion, and ensure long-term maintainability."
      },
      {
        id: 4,
        question: "What is Clean Architecture (or Hexagonal Architecture) and how does the Dependency Inversion Principle protect core domain entities?",
        keywords: ["clean architecture", "domain", "entities", "use cases", "dependency inversion", "decoupled", "framework independent", "adapters"],
        idealAnswer: "Clean Architecture organizes software in concentric layers: Domain Entities at the core, surrounded by Use Cases (Application logic), Interface Adapters (Controllers, Presenters), and Frameworks/Drivers (Databases, Web Frameworks). The fundamental Dependency Rule mandates that code dependencies can ONLY point inward toward domain entities. By applying Dependency Inversion (defining repository interfaces inside the use case layer implemented by external database adapters), the business logic remains framework-agnostic, easily mockable, and testable without a live database or UI."
      }
    ],
    Hard: [
      {
        id: 5,
        question: "How do you manage distributed transactions and data consistency across independent microservices (e.g. Saga Pattern vs Two-Phase Commit)?",
        keywords: ["saga", "choreography", "orchestration", "distributed transaction", "eventual consistency", "compensating transaction", "message broker", "2pc"],
        idealAnswer: "Because microservices follow the Database-per-Service pattern, traditional ACID 2-Phase Commit (2PC) creates blocking locks and single points of failure across networks. Instead, the Saga Pattern is used to achieve Eventual Consistency across distributed transactions. A Saga is a sequence of local transactions where each step publishes an event/message via a message broker (e.g. RabbitMQ/Kafka). If a step fails, the Saga executes Compensating Transactions backward to rollback state. Sagas are implemented via Choreography (event-driven pub/sub) or Orchestration (a centralized orchestrator coordinator managing execution state)."
      },
      {
        id: 6,
        question: "Explain the CAP Theorem and how modern distributed cloud systems make trade-offs between Consistency, Availability, and Partition Tolerance.",
        keywords: ["cap theorem", "consistency", "availability", "partition tolerance", "network partition", "pacelc", "trade-off", "distributed system"],
        idealAnswer: "The CAP Theorem states that any distributed data store can simultaneously guarantee at most two out of three properties: Consistency (every read receives the most recent write or an error), Availability (every non-failing node returns a non-error response without guarantee of latest write), and Partition Tolerance (the system continues to operate despite arbitrary network dropped messages). Because network partitions are inevitable across cloud networks, systems must choose between CP (favoring strong consistency like Spanner or MongoDB with primary election) and AP (favoring high availability with eventual consistency like Cassandra or DynamoDB). PACELC extends this by addressing the trade-off between latency and consistency in normal non-partitioned states."
      }
    ]
  },
  Database: {
    Easy: [
      {
        id: 1,
        question: "Explain Database Normalization (1NF, 2NF, 3NF, BCNF) and why we eliminate data redundancy and insertion/deletion anomalies.",
        keywords: ["normalization", "1nf", "2nf", "3nf", "bcnf", "redundancy", "anomaly", "functional dependency", "primary key", "foreign key"],
        idealAnswer: "Normalization is the systematic process of organizing relational database schemas to minimize data redundancy and prevent insertion, update, and deletion anomalies. 1NF requires atomic attribute values and unique records. 2NF removes partial functional dependencies (all non-key attributes must depend on the entire primary key). 3NF eliminates transitive dependencies (non-key attributes must not depend on other non-key attributes). BCNF (Boyce-Codd) is a stricter 3NF variant where every determinant must be a candidate key."
      },
      {
        id: 2,
        question: "What is the difference between Primary Key, Foreign Key, and Unique Key constraints in relational database modeling?",
        keywords: ["primary key", "foreign key", "unique", "relational", "integrity", "referential", "null", "schema", "table"],
        idealAnswer: "A Primary Key uniquely identifies each row in a table, enforces entity integrity, creates a default clustered index, and cannot accept NULL values (only 1 per table). A Unique Key also enforces column uniqueness but permits NULL values (multiple allowed per table). A Foreign Key creates a referential integrity constraint linking a column in a child table to the Primary Key of a parent table, preventing orphaned records and enforcing CASCADE updates/deletions."
      }
    ],
    Medium: [
      {
        id: 3,
        question: "Explain ACID properties in relational database transactions versus the BASE model in distributed NoSQL databases.",
        keywords: ["acid", "atomicity", "consistency", "isolation", "durability", "base", "eventual consistency", "transaction", "commit", "rollback"],
        idealAnswer: "ACID guarantees strict transactional integrity in relational databases: Atomicity (all-or-nothing execution with automatic rollback on error), Consistency (valid state transitions adhering to schema constraints), Isolation (concurrent transactions execute independently without interference, using isolation levels like Read Committed or Serializable), and Durability (committed writes persist on non-volatile storage despite system crashes). Conversely, distributed NoSQL databases use BASE: Basically Available (system remains available under partition), Soft State (state can change over time without user input), and Eventual Consistency (data replicates to all replicas given sufficient time), trading immediate consistency for horizontal scalability."
      },
      {
        id: 4,
        question: "How does B-Tree and Hash database indexing work under the hood, and what are the trade-offs between Read speed versus Write overhead?",
        keywords: ["indexing", "b-tree", "hash", "lookup", "query performance", "write overhead", "disk i/o", "clustered index", "scan"],
        idealAnswer: "B-Tree indexes organize sorted data in balanced multi-way search trees, allowing O(log N) point lookups, range queries (`BETWEEN`, `>`, `<`), and sorted scans (`ORDER BY`) with minimal disk I/O. Hash indexes compute key hashes offering O(1) exact equality lookups (`=`) but cannot support range queries or sorting. The trade-off: Indexes dramatically accelerate `SELECT` read speed by eliminating full table scans, but introduce write overhead on `INSERT`, `UPDATE`, and `DELETE` operations because the database must continuously rebalance trees and update index blocks in secondary memory."
      }
    ],
    Hard: [
      {
        id: 5,
        question: "How do you scale a relational or NoSQL database architecture for high throughput using Horizontal Sharding, Partitioning, and Read-Replicas?",
        keywords: ["sharding", "horizontal partitioning", "read-replica", "shard key", "replication", "load balancing", "high availability", "failover"],
        idealAnswer: "Scaling database architecture requires a multi-tier strategy: 1) Read-Replicas: Replicate data asynchronously from a single Primary master to multiple read-only secondary nodes, offloading heavy analytical and read traffic via load balancers. 2) Horizontal Partitioning & Sharding: Partition massive tables across independent physical server nodes using a deterministic Shard Key (e.g. range, hash, or directory-based sharding). 3) Connection Pooling & Caching: Place in-memory caches (Redis) in front of shards to absorb high-frequency queries and maintain sub-millisecond throughput."
      },
      {
        id: 6,
        question: "Explain Polyglot Persistence: When should an enterprise architecture use a Relational DB (PostgreSQL), a Document Store (MongoDB), and an In-Memory Cache (Redis)?",
        keywords: ["polyglot persistence", "postgresql", "mongodb", "redis", "in-memory", "cache", "structured", "unstructured", "acid", "document"],
        idealAnswer: "Polyglot Persistence is the architectural practice of utilizing different database technologies tailored to specific domain workloads within the same enterprise ecosystem. 1) PostgreSQL (RDBMS): Used for core transactional business data, financial records, and entity relations where strict ACID compliance, relational joins, and foreign key constraints are mandatory. 2) MongoDB (Document Store): Used for semi-structured catalogs, flexible schemas, user profiles, or audit logs requiring agile iteration and dynamic nested JSON documents. 3) Redis (In-Memory Key-Value): Used as an ultra-fast cache, session store, distributed rate limiter, and real-time leaderboard capable of handling millions of operations per second with microsecond latencies."
      }
    ]
  },
  Frontend: {
    Easy: [
      { 
        id: 1, 
        question: "What is React Virtual DOM and how does reconciliation / diffing work?", 
        keywords: ["virtual dom", "reconciliation", "diffing", "render", "state", "component"],
        idealAnswer: "The Virtual DOM is a lightweight JavaScript representation of the real DOM kept in memory. When component state changes, React creates a new Virtual DOM tree, performs a fast heuristic diffing algorithm against the previous snapshot (reconciliation), computes the minimal set of DOM mutations, and batches updates to the real browser DOM, avoiding expensive layout reflows."
      },
      { 
        id: 2, 
        question: "Explain the difference between state and props in React components.", 
        keywords: ["state", "props", "mutable", "immutable", "parent", "component", "unidirectional"],
        idealAnswer: "Props are read-only, immutable arguments passed from parent components down to child components to configure them following unidirectional data flow. State is mutable internal data managed within the component itself via useState/useReducer; when state changes, it triggers a re-render of the component and its children."
      }
    ],
    Medium: [
      { 
        id: 3, 
        question: "Describe React Hooks lifecycle behavior with useEffect and dependency arrays.", 
        keywords: ["hook", "useeffect", "dependency", "lifecycle", "mount", "unmount", "cleanup"],
        idealAnswer: "useEffect manages component side effects: with an empty dependency array `[]`, the effect runs once on mount and its return cleanup function runs on unmount. With dependencies `[a, b]`, the effect executes whenever any listed dependency value changes, running the previous cycle's cleanup before executing the new effect. Omitting the array runs the effect after every single render."
      },
      { 
        id: 4, 
        question: "How does React state batching work in modern React 18/19?", 
        keywords: ["batching", "asynchronous", "render", "update", "performance", "queue"],
        idealAnswer: "In React 18/19, Automatic Batching groups multiple state updates (even inside async callbacks, promises, setTimeout, or native DOM event listeners) into a single consolidated re-render pass, reducing unnecessary render cycles and boosting application performance without manual unstable_batchedUpdates."
      }
    ],
    Hard: [
      { 
        id: 5, 
        question: "How do you optimize rendering performance in large-scale React applications?", 
        keywords: ["memo", "lazy", "suspense", "bundle", "virtualization", "re-render", "profiler"],
        idealAnswer: "1) Code-splitting with React.lazy and Suspense to reduce initial JavaScript bundle size. 2) Memoization via React.memo, useMemo, and useCallback to prevent unnecessary re-renders of heavy children. 3) List virtualization (react-window/react-virtualized) to render only visible DOM nodes. 4) State colocation to prevent root-level re-render waterfalls. 5) Profiling via React DevTools Profiler to detect rendering bottlenecks."
      },
      { 
        id: 6, 
        question: "Compare state management patterns: Context API, Redux Toolkit, and Zustand for enterprise frontends.", 
        keywords: ["redux", "context", "store", "reducer", "action", "provider", "zustand", "immutable"],
        idealAnswer: "Context API is built-in and suited for low-frequency global state (themes, authenticated user sessions) but triggers re-renders across all consuming components. Redux Toolkit provides strict unidirectional data flow, immutable state updates via Immer, devtools time-travel debugging, and middleware (RTK Query) for complex enterprise apps. Zustand offers lightweight, hook-based centralized stores with selector-based subscriptions that avoid unnecessary component re-renders without Provider wrapper boilerplate."
      }
    ]
  },
  Backend: {
    Easy: [
      { 
        id: 1, 
        question: "What is Express Middleware and how does the request-response cycle work with next()?", 
        keywords: ["middleware", "request", "response", "next", "pipeline", "router", "express"],
        idealAnswer: "Middleware functions in Express execute in a sequential pipeline with access to the Request (`req`), Response (`res`), and `next` function. Middleware can run code, mutate req/res objects (e.g. parsing JSON, auth checks), terminate the cycle by sending a response (`res.json()`), or invoke `next()` to pass control to the subsequent handler in the stack."
      },
      { 
        id: 2, 
        question: "What are the key architectural differences between SQL (Relational) and NoSQL (Document) databases?", 
        keywords: ["sql", "nosql", "relational", "schema", "flexible", "scale", "horizontal", "tables"],
        idealAnswer: "SQL databases (PostgreSQL, MySQL) enforce predefined rigid schemas, store data in relational tables with foreign keys, emphasize ACID transactions, and typically scale vertically. NoSQL databases (MongoDB) store flexible JSON/BSON documents, accommodate evolving polymorphic schemas, support horizontal scaling via native sharding, and prioritize high write throughput and developer agility."
      }
    ],
    Medium: [
      { 
        id: 3, 
        question: "How do you implement centralized error handling and input validation in an Express REST API?", 
        keywords: ["error", "middleware", "next", "try-catch", "validation", "status code", "boundary"],
        idealAnswer: "1) Input validation: Use validation libraries (Zod or Joi) as middleware before controllers to sanitize payload types and reject bad inputs with 400 Bad Request. 2) Centralized Error Middleware: Define an error-handling middleware with 4 arguments `(err, req, res, next)` at the end of the router pipeline to format consistent JSON error responses with appropriate HTTP status codes (400, 401, 404, 500) and log stack traces."
      },
      { 
        id: 4, 
        question: "Explain the JWT (JSON Web Token) authentication flow and token refresh strategy.", 
        keywords: ["jwt", "token", "header", "payload", "signature", "verify", "auth", "refresh token", "cookies"],
        idealAnswer: "A JWT contains three parts: Header, Payload, and cryptographic Signature. On login, the server issues a short-lived Access Token (e.g. 15 mins) and a long-lived Refresh Token stored securely in an `httpOnly, secure` cookie. The client passes the Access Token in the `Authorization: Bearer <token>` header on API calls. When the access token expires, the client calls a `/refresh` endpoint where the backend verifies the refresh token and issues a new access token without re-prompting login."
      }
    ],
    Hard: [
      { 
        id: 5, 
        question: "How do you design a scalable microservices architecture with an API Gateway and Service Discovery?", 
        keywords: ["microservices", "scale", "gateway", "service-discovery", "decouple", "load balancer", "resilience"],
        idealAnswer: "An API Gateway acts as the single reverse-proxy entry point handling SSL termination, JWT authentication, rate limiting, request routing, and protocol translation. Service Discovery (e.g. Consul, Eureka, or Kubernetes DNS) automatically registers and tracks dynamic microservice container IP addresses and ports, enabling client-side or server-side load balancing and health checking."
      },
      { 
        id: 6, 
        question: "Explain database connection pooling, indexing strategies, and query optimization for high-concurrency Node.js backends.", 
        keywords: ["connection pool", "indexing", "b-tree", "query optimization", "concurrency", "performance", "async"],
        idealAnswer: "Connection pooling maintains a pool of pre-established database TCP connections, eliminating the latency of opening/closing sockets per HTTP request in Node's async event loop. Query optimization involves using `EXPLAIN ANALYZE` to create compound/covering B-Tree indexes on filtered columns, selecting only needed fields (avoiding `SELECT *`), paginating large datasets with cursor-based keyset pagination, and caching frequent reads in Redis."
      }
    ]
  },
  Tutor: {
    Easy: [
      { 
        id: 1, 
        question: "How do you explain the concept of Recursion and Call Stack frames to a beginner CSE student?", 
        keywords: ["recursion", "base case", "call stack", "frame", "termination", "stack overflow", "function call"],
        idealAnswer: "Recursion is a programming technique where a function solves a problem by calling a smaller instance of itself until it hits a Base Case (the termination condition that returns without recursing). Each function invocation pushes a new stack frame onto the Call Stack holding its local variables; once the base case returns, stack frames pop off in LIFO order. Omitting the base case exhausts stack memory, triggering a StackOverflowError."
      },
      { 
        id: 2, 
        question: "Explain the Four Pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism) with relatable code analogies.", 
        keywords: ["encapsulation", "abstraction", "inheritance", "polymorphism", "class", "object", "oop", "overriding"],
        idealAnswer: "1) Encapsulation: Bundling data and methods into a single class while restricting direct external access via private fields and public getters/setters (like a capsule medicine). 2) Abstraction: Hiding internal complex implementation details and exposing only clean interfaces (like driving a car by pressing pedals without knowing internal combustion physics). 3) Inheritance: Allowing a child class to inherit properties and methods from a parent class (`Student` extends `Person`) to maximize code reuse. 4) Polymorphism: The ability for different objects to respond to the same method call in specialized ways via method overriding (runtime) and method overloading (compile-time)."
      }
    ],
    Medium: [
      { 
        id: 3, 
        question: "How would you mentor a student who is struggling with Linked List pointer manipulation and Segfaults / NullPointerExceptions?", 
        keywords: ["pointer", "null", "reference", "node", "head", "next", "visualization", "edge cases", "debugging"],
        idealAnswer: "1) Visual Mapping: Have the student physically draw node boxes and directional arrows on paper before writing code. 2) Pointer Sequence: Emphasize preserving connections by creating temporary pointers (e.g. `temp = curr.next`) before breaking existing links. 3) Guard Clauses: Explicitly check for `head == null` or `curr.next == null` before dereferencing pointers to prevent NullPointerExceptions. 4) Step-by-step Debugging: Trace loop pointer updates line-by-line for single-node and multi-node edge cases."
      },
      { 
        id: 4, 
        question: "Explain the difference between Pass-by-Value and Pass-by-Reference in Java / Python to a junior student.", 
        keywords: ["pass by value", "pass by reference", "memory", "heap", "stack", "object reference", "mutable", "immutable"],
        idealAnswer: "In languages like Java and Python, everything is evaluated strictly Pass-by-Value. For primitive variables (ints, booleans), a copy of the actual primitive value is passed on the stack; modifying the parameter inside the function has zero effect on the caller's variable. For objects, a copy of the object reference (memory address pointing to the heap) is passed by value: modifying object properties mutates the shared underlying object on the heap, but reassigning the reference variable itself (`obj = new Object()`) does not rebind the caller's variable."
      }
    ],
    Hard: [
      { 
        id: 5, 
        question: "How do you break down Big-O asymptotic analysis (Time and Space Complexity) when explaining Divide and Conquer algorithms like Merge Sort?", 
        keywords: ["big o", "time complexity", "space complexity", "divide and conquer", "log n", "recurrence relation", "merge sort"],
        idealAnswer: "Break it down into a recursion tree: 1) Divide step splits the array of size N in half at each level, producing a tree of depth `log2(N)`. 2) Merge step takes linear `O(N)` work across all sub-arrays at every level to merge sorted halves. Multiplying tree depth by level work gives total time complexity `O(N log N)` in all cases (Best, Average, Worst). For space complexity, merging requires auxiliary temporary arrays of size `O(N)` plus `O(log N)` call stack space, yielding `O(N)` auxiliary space complexity."
      },
      { 
        id: 6, 
        question: "A student's multithreaded program encounters a Deadlock / Race Condition. How do you guide them to identify and resolve it?", 
        keywords: ["deadlock", "race condition", "mutex", "lock", "synchronization", "thread safety", "critical section"],
        idealAnswer: "1) Race Condition: Occurs when concurrent threads access shared mutable state without proper synchronization. Guide the student to identify critical sections and protect them with Mutexes, Locks, atomic variables, or synchronized blocks. 2) Deadlock: Occurs when two or more threads circular-wait for locks held by each other (Coffman conditions). Guide them to eliminate circular wait by enforcing a strict global lock acquisition ordering across all threads or using timeout-based tryLock mechanisms."
      }
    ]
  }
};

// Demo database for Interview attempts
let mockInterviews = [
  {
    _id: "mock-int-1",
    role: "Architecture",
    difficulty: "Medium",
    overallScore: 88,
    questionsAndAnswers: [
      {
        question: "Explain the SOLID principles in Software Engineering and why they are essential for maintainable system design.",
        userAnswer: "SOLID stands for Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. They ensure low coupling and high cohesion across modules.",
        feedback: "Excellent response! You clearly articulated all 5 principles and highlighted coupling and cohesion.",
        score: 90,
        idealAnswer: "SOLID consists of 5 object-oriented design principles: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. They reduce coupling, maximize cohesion, and ensure long-term maintainability."
      },
      {
        question: "What is Clean Architecture and how does the Dependency Inversion Principle protect core domain entities?",
        userAnswer: "Clean Architecture organizes code in concentric layers where dependencies only point inward towards business domain logic and use cases.",
        feedback: "Great answer! Mentioning concentric layers and inward dependencies directly matches the architecture rubric.",
        score: 86,
        idealAnswer: "Clean Architecture organizes software in concentric layers with Domain Entities at the core. The Dependency Rule mandates that code dependencies can ONLY point inward toward domain entities, making business logic framework-agnostic."
      }
    ],
    createdAt: new Date(Date.now() - 1800000)
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get questions based on role and difficulty
// @route   POST /api/interviews/questions
// @access  Public
export const getQuestions = (req, res) => {
  const { role, difficulty } = req.body || {};
  
  const roleQuestions = questionPool[role] || questionPool["Architecture"] || questionPool["Frontend"];
  const finalQuestions = roleQuestions[difficulty] || roleQuestions["Medium"] || roleQuestions["Easy"];
  
  // Return questions without disclosing keywords or ideal answers during test
  const sanitized = finalQuestions.map(q => ({
    id: q.id,
    question: q.question
  }));

  res.status(200).json(sanitized);
};

// @desc    Submit answers and grade evaluation
// @route   POST /api/interviews/submit
// @access  Public
export const submitInterview = async (req, res) => {
  try {
    const { role, difficulty, answers } = req.body;

    const targetRole = role || 'Architecture';
    const targetDifficulty = difficulty || 'Medium';

    const pool = (questionPool[targetRole] && questionPool[targetRole][targetDifficulty]) 
      || (questionPool["Architecture"] && questionPool["Architecture"]["Medium"]) 
      || [];

    let totalScore = 0;
    const questionsAndAnswers = [];

    for (const q of pool) {
      let rawAnswer = "";
      
      if (Array.isArray(answers)) {
        const found = answers.find(a => a.questionId === q.id || a.question === q.question);
        rawAnswer = found ? (found.userAnswer || "") : "";
      } else if (typeof answers === 'object' && answers !== null) {
        rawAnswer = answers[q.id] || answers[q.question] || "";
      }

      const lowerAnswer = (rawAnswer || "").toLowerCase().trim();
      const matched = q.keywords.filter(kw => lowerAnswer.includes(kw.toLowerCase()));
      const percentage = q.keywords.length > 0 ? Math.round((matched.length / q.keywords.length) * 100) : 100;
      
      let itemScore = Math.min(100, Math.max(10, percentage));
      if (!lowerAnswer || lowerAnswer === '(no response submitted within time limit)' || lowerAnswer === '(no response submitted)') {
        itemScore = 0;
      }

      let feedback = "";
      if (itemScore >= 80) {
        feedback = "Excellent response! You articulated core architectural and technical concepts thoroughly.";
      } else if (itemScore >= 50) {
        const missed = q.keywords.filter(kw => !lowerAnswer.includes(kw.toLowerCase()));
        feedback = `Good attempt. To strengthen your answer, elaborate further on: ${missed.slice(0, 3).join(', ')}.`;
      } else if (itemScore >= 10) {
        feedback = `Basic answer provided. Make sure to explain system trade-offs and keyword concepts like: ${q.keywords.slice(0, 4).join(', ')}.`;
      } else {
        feedback = "No answer was recorded for this question.";
      }

      totalScore += itemScore;
      questionsAndAnswers.push({
        question: q.question,
        userAnswer: rawAnswer.trim() ? rawAnswer : "(No response recorded)",
        feedback,
        score: itemScore,
        idealAnswer: q.idealAnswer || "A complete, comprehensive explanation covering all core architectural principles and technical requirements."
      });
    }

    const overallScore = pool.length > 0 ? Math.round(totalScore / pool.length) : 0;

    if (!isConnected()) {
      const newInterview = {
        _id: `mock-int-${Date.now()}`,
        role: targetRole,
        difficulty: targetDifficulty,
        overallScore,
        questionsAndAnswers,
        createdAt: new Date()
      };
      mockInterviews.unshift(newInterview);
      return res.status(201).json(newInterview);
    }

    const interviewRecord = new Interview({
      role: targetRole,
      difficulty: targetDifficulty,
      overallScore,
      questionsAndAnswers
    });

    const saved = await interviewRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Submit interview error:", error);
    res.status(500).json({ message: error.message || "Evaluation processing failed" });
  }
};

// @desc    Get all interview simulator results
// @route   GET /api/interviews
// @access  Public
export const getInterviews = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json(mockInterviews);
    }
    const results = await Interview.find({}).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete interview result
// @route   DELETE /api/interviews/:id
// @access  Public
export const deleteInterview = async (req, res) => {
  try {
    if (!isConnected()) {
      mockInterviews = mockInterviews.filter(i => i._id !== req.params.id);
      return res.status(200).json({ message: 'Interview deleted' });
    }
    await Interview.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
