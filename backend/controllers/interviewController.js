import Interview from '../models/Interview.js';
import mongoose from 'mongoose';

// Predefined pools of questions, categorized keywords, and scoring rubrics
const questionPool = {
  Architecture: {
    Easy: [
      {
        id: 1,
        question: "Explain the MVC (Model-View-Controller) architectural pattern and how data and control flow between each component.",
        keywords: ["model", "view", "controller", "data", "business logic", "separation of concerns", "route", "database"]
      },
      {
        id: 2,
        question: "What are the core differences between Monolithic and Microservices software architectures?",
        keywords: ["monolith", "microservices", "decoupled", "independent", "deploy", "scalability", "api gateway", "service"]
      }
    ],
    Medium: [
      {
        id: 3,
        question: "Explain the SOLID principles in Software Engineering and why they are essential for maintainable system design.",
        keywords: ["solid", "single responsibility", "open-closed", "liskov", "interface segregation", "dependency inversion", "maintainability", "coupling"]
      },
      {
        id: 4,
        question: "What is Clean Architecture (or Hexagonal Architecture) and how does the Dependency Inversion Principle protect core domain entities?",
        keywords: ["clean architecture", "domain", "entities", "use cases", "dependency inversion", "decoupled", "framework independent", "adapters"]
      }
    ],
    Hard: [
      {
        id: 5,
        question: "How do you manage distributed transactions and data consistency across independent microservices (e.g. Saga Pattern vs Two-Phase Commit)?",
        keywords: ["saga", "choreography", "orchestration", "distributed transaction", "eventual consistency", "compensating transaction", "message broker", "2pc"]
      },
      {
        id: 6,
        question: "Explain the CAP Theorem and how modern distributed cloud systems make trade-offs between Consistency, Availability, and Partition Tolerance.",
        keywords: ["cap theorem", "consistency", "availability", "partition tolerance", "network partition", "pacelc", "trade-off", "distributed system"]
      }
    ]
  },
  Database: {
    Easy: [
      {
        id: 1,
        question: "Explain Database Normalization (1NF, 2NF, 3NF, BCNF) and why we eliminate data redundancy and insertion/deletion anomalies.",
        keywords: ["normalization", "1nf", "2nf", "3nf", "bcnf", "redundancy", "anomaly", "functional dependency", "primary key", "foreign key"]
      },
      {
        id: 2,
        question: "What is the difference between Primary Key, Foreign Key, and Unique Key constraints in relational database modeling?",
        keywords: ["primary key", "foreign key", "unique", "relational", "integrity", "referential", "null", "schema", "table"]
      }
    ],
    Medium: [
      {
        id: 3,
        question: "Explain ACID properties in relational database transactions versus the BASE model in distributed NoSQL databases.",
        keywords: ["acid", "atomicity", "consistency", "isolation", "durability", "base", "eventual consistency", "transaction", "commit", "rollback"]
      },
      {
        id: 4,
        question: "How does B-Tree and Hash database indexing work under the hood, and what are the trade-offs between Read speed versus Write overhead?",
        keywords: ["indexing", "b-tree", "hash", "lookup", "query performance", "write overhead", "disk i/o", "clustered index", "scan"]
      }
    ],
    Hard: [
      {
        id: 5,
        question: "How do you scale a relational or NoSQL database architecture for high throughput using Horizontal Sharding, Partitioning, and Read-Replicas?",
        keywords: ["sharding", "horizontal partitioning", "read-replica", "shard key", "replication", "load balancing", "high availability", "failover"]
      },
      {
        id: 6,
        question: "Explain Polyglot Persistence: When should an enterprise architecture use a Relational DB (PostgreSQL), a Document Store (MongoDB), and an In-Memory Cache (Redis)?",
        keywords: ["polyglot persistence", "postgresql", "mongodb", "redis", "in-memory", "cache", "structured", "unstructured", "acid", "document"]
      }
    ]
  },
  Frontend: {
    Easy: [
      { id: 1, question: "What is React Virtual DOM and how does reconciliation / diffing work?", keywords: ["virtual dom", "reconciliation", "diffing", "render", "state", "component"] },
      { id: 2, question: "Explain the difference between state and props in React components.", keywords: ["state", "props", "mutable", "immutable", "parent", "component", "unidirectional"] }
    ],
    Medium: [
      { id: 3, question: "Describe React Hooks lifecycle behavior with useEffect and dependency arrays.", keywords: ["hook", "useeffect", "dependency", "lifecycle", "mount", "unmount", "cleanup"] },
      { id: 4, question: "How does React state batching work in modern React 18/19?", keywords: ["batching", "asynchronous", "render", "update", "performance", "queue"] }
    ],
    Hard: [
      { id: 5, question: "How do you optimize rendering performance in large-scale React applications?", keywords: ["memo", "lazy", "suspense", "bundle", "virtualization", "re-render", "profiler"] },
      { id: 6, question: "Compare state management patterns: Context API, Redux Toolkit, and Zustand for enterprise frontends.", keywords: ["redux", "context", "store", "reducer", "action", "provider", "zustand", "immutable"] }
    ]
  },
  Backend: {
    Easy: [
      { id: 1, question: "What is Express Middleware and how does the request-response cycle work with next()?", keywords: ["middleware", "request", "response", "next", "pipeline", "router", "express"] },
      { id: 2, question: "What are the key architectural differences between SQL (Relational) and NoSQL (Document) databases?", keywords: ["sql", "nosql", "relational", "schema", "flexible", "scale", "horizontal", "tables"] }
    ],
    Medium: [
      { id: 3, question: "How do you implement centralized error handling and input validation in an Express REST API?", keywords: ["error", "middleware", "next", "try-catch", "validation", "status code", "boundary"] },
      { id: 4, question: "Explain the JWT (JSON Web Token) authentication flow and token refresh strategy.", keywords: ["jwt", "token", "header", "payload", "signature", "verify", "auth", "refresh token", "cookies"] }
    ],
    Hard: [
      { id: 5, question: "How do you design a scalable microservices architecture with an API Gateway and Service Discovery?", keywords: ["microservices", "scale", "gateway", "service-discovery", "decouple", "load balancer", "resilience"] },
      { id: 6, question: "Explain database connection pooling, indexing strategies, and query optimization for high-concurrency Node.js backends.", keywords: ["connection pool", "indexing", "b-tree", "query optimization", "concurrency", "performance", "async"] }
    ]
  },
  Tutor: {
    Easy: [
      { id: 1, question: "How do you explain the concept of Recursion and Call Stack frames to a beginner CSE student?", keywords: ["recursion", "base case", "call stack", "frame", "termination", "stack overflow", "function call"] },
      { id: 2, question: "Explain the Four Pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism) with relatable code analogies.", keywords: ["encapsulation", "abstraction", "inheritance", "polymorphism", "class", "object", "oop", "overriding"] }
    ],
    Medium: [
      { id: 3, question: "How would you mentor a student who is struggling with Linked List pointer manipulation and Segfaults / NullPointerExceptions?", keywords: ["pointer", "null", "reference", "node", "head", "next", "visualization", "edge cases", "debugging"] },
      { id: 4, question: "Explain the difference between Pass-by-Value and Pass-by-Reference in Java / Python to a junior student.", keywords: ["pass by value", "pass by reference", "memory", "heap", "stack", "object reference", "mutable", "immutable"] }
    ],
    Hard: [
      { id: 5, question: "How do you break down Big-O asymptotic analysis (Time and Space Complexity) when explaining Divide and Conquer algorithms like Merge Sort?", keywords: ["big o", "time complexity", "space complexity", "divide and conquer", "log n", "recurrence relation", "merge sort"] },
      { id: 6, question: "A student's multithreaded program encounters a Deadlock / Race Condition. How do you guide them to identify and resolve it?", keywords: ["deadlock", "race condition", "mutex", "lock", "synchronization", "thread safety", "critical section"] }
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
        score: 90
      },
      {
        question: "What is Clean Architecture and how does the Dependency Inversion Principle protect core domain entities?",
        userAnswer: "Clean Architecture organizes code in concentric layers where dependencies only point inward towards business domain logic and use cases.",
        feedback: "Great answer! Mentioning concentric layers and inward dependencies directly matches the architecture rubric.",
        score: 86
      }
    ],
    createdAt: new Date(Date.now() - 1800000)
  },
  {
    _id: "mock-int-2",
    role: "Database",
    difficulty: "Easy",
    overallScore: 92,
    questionsAndAnswers: [
      {
        question: "Explain Database Normalization (1NF, 2NF, 3NF, BCNF) and why we eliminate data redundancy and insertion/deletion anomalies.",
        userAnswer: "Normalization decomposes relations to remove transitive and partial functional dependencies, preventing update, insertion, and deletion anomalies.",
        feedback: "Superb answer covering 1NF to BCNF and anomaly prevention.",
        score: 95
      }
    ],
    createdAt: new Date(Date.now() - 3600000)
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get questions based on role and difficulty
// @route   POST /api/interviews/questions
// @access  Public
export const getQuestions = (req, res) => {
  const { role, difficulty } = req.body;
  
  const roleQuestions = questionPool[role] || questionPool["Architecture"] || questionPool["Frontend"];
  const finalQuestions = roleQuestions[difficulty] || roleQuestions["Medium"] || roleQuestions["Easy"];
  
  res.status(200).json(finalQuestions.map(q => ({ id: q.id, question: q.question })));
};

// @desc    Submit interview responses and get feedback
// @route   POST /api/interviews/submit
// @access  Public
export const submitInterview = async (req, res) => {
  try {
    const { role, difficulty, answers } = req.body;
    
    if (!role || !difficulty || !answers) {
      return res.status(400).json({ message: 'Missing required interview parameters' });
    }

    const roleQuestions = questionPool[role] || questionPool["Architecture"] || questionPool["Frontend"];
    const pool = roleQuestions[difficulty] || roleQuestions["Medium"];

    let totalScore = 0;
    const questionsAndAnswers = [];

    for (const q of pool) {
      const userAnswer = answers[q.id] || "";
      const lowerAnswer = userAnswer.toLowerCase();
      
      const matched = q.keywords.filter(kw => lowerAnswer.includes(kw.toLowerCase()));
      const percentage = Math.round((matched.length / q.keywords.length) * 100);
      
      let itemScore = Math.min(100, Math.max(30, percentage * 2));
      if (!userAnswer.trim()) itemScore = 0;

      let feedback = "";
      if (itemScore >= 80) {
        feedback = "Excellent response! You articulated core architectural and technical concepts thoroughly.";
      } else if (itemScore >= 50) {
        const missed = q.keywords.filter(kw => !lowerAnswer.includes(kw.toLowerCase()));
        feedback = `Good attempt. To strengthen your answer, elaborate further on: ${missed.slice(0, 3).join(', ')}.`;
      } else if (itemScore > 0) {
        feedback = `Basic answer provided. Make sure to explain system trade-offs and keyword concepts like: ${q.keywords.slice(0, 4).join(', ')}.`;
      } else {
        feedback = "No answer was recorded for this question.";
      }

      totalScore += itemScore;
      questionsAndAnswers.push({
        question: q.question,
        userAnswer,
        feedback,
        score: itemScore
      });
    }

    const overallScore = pool.length > 0 ? Math.round(totalScore / pool.length) : 0;

    if (!isConnected()) {
      const newInterview = {
        _id: `mock-int-${Date.now()}`,
        role,
        difficulty,
        overallScore,
        questionsAndAnswers,
        createdAt: new Date()
      };
      mockInterviews.unshift(newInterview);
      return res.status(201).json(newInterview);
    }

    const interviewRecord = new Interview({
      role,
      difficulty,
      overallScore,
      questionsAndAnswers
    });

    const saved = await interviewRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    let interviews = await Interview.find({}).sort({ createdAt: -1 });
    if (interviews.length === 0) {
      await Interview.insertMany(mockInterviews.map(({ _id, ...rest }) => rest));
      interviews = await Interview.find({}).sort({ createdAt: -1 });
    }
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single interview simulation results
// @route   GET /api/interviews/:id
// @access  Public
export const getInterviewById = async (req, res) => {
  try {
    if (!isConnected()) {
      const interview = mockInterviews.find(h => h._id === req.params.id);
      if (interview) return res.status(200).json(interview);
      return res.status(404).json({ message: 'Simulation record not found (mock)' });
    }
    const interview = await Interview.findById(req.params.id);
    if (interview) {
      res.status(200).json(interview);
    } else {
      res.status(404).json({ message: 'Interview simulation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    if (!isConnected()) {
      mockInterviews = mockInterviews.filter(h => h._id !== req.params.id);
      return res.status(200).json({ message: 'Interview simulation deleted (mock)' });
    }
    const interview = await Interview.findById(req.params.id);
    if (interview) {
      await Interview.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Interview simulation deleted' });
    } else {
      res.status(404).json({ message: 'Interview not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
