import Interview from '../models/Interview.js';
import mongoose from 'mongoose';

// Predefined pools of questions and keywords for scoring
const questionPool = {
  Frontend: {
    Easy: [
      { id: 1, question: "What is React Virtual DOM and how does it work?", keywords: ["virtual dom", "reconciliation", "diffing", "render"] },
      { id: 2, question: "Explain the difference between state and props in React.", keywords: ["state", "props", "mutable", "immutable", "parent", "component"] }
    ],
    Medium: [
      { id: 3, question: "Describe React life-cycle methods or React Hooks like useEffect.", keywords: ["hook", "useeffect", "dependency", "lifecycle", "mount", "unmount"] },
      { id: 4, question: "How does React state batching work?", keywords: ["batching", "asynchronous", "render", "update"] }
    ],
    Hard: [
      { id: 5, question: "How do you optimize performance in a large React application?", keywords: ["memo", "lazy", "suspense", "bundle", "virtualization", "re-render"] },
      { id: 6, question: "Describe standard React patterns for state management (Context API vs Redux).", keywords: ["redux", "context", "store", "reducer", "action", "provider"] }
    ]
  },
  Backend: {
    Easy: [
      { id: 1, question: "What is Middleware in Express?", keywords: ["middleware", "request", "response", "next", "pipeline"] },
      { id: 2, question: "What is the difference between SQL and NoSQL databases?", keywords: ["sql", "nosql", "relational", "schema", "flexible", "scale"] }
    ],
    Medium: [
      { id: 3, question: "How do you handle error handling in an Express app?", keywords: ["error", "middleware", "next", "try-catch", "boundary"] },
      { id: 4, question: "Explain JWT (JSON Web Token) authentication flow.", keywords: ["jwt", "token", "header", "payload", "signature", "verify", "auth"] }
    ],
    Hard: [
      { id: 5, question: "How do you design a scalable microservices architecture?", keywords: ["microservices", "scale", "gateway", "service-discovery", "decouple"] },
      { id: 6, question: "What is database indexing and how does it improve query speed?", keywords: ["indexing", "b-tree", "search", "write", "performance", "query"] }
    ]
  }
};

// Demo database for Interview attempts
let mockInterviews = [
  {
    _id: "mock-int-1",
    role: "Frontend",
    difficulty: "Medium",
    overallScore: 75,
    questionsAndAnswers: [
      {
        question: "Describe React life-cycle methods or React Hooks like useEffect.",
        userAnswer: "We use useEffect hook to handle side effects in functional components. It takes a dependency array and triggers on mounting or updates.",
        feedback: "Good attempt, but you should mention more key concepts such as: lifecycle, unmount.",
        score: 65
      },
      {
        question: "How does React state batching work?",
        userAnswer: "React batches state updates asynchronously to group multiple updates together, rendering the UI only once for performance efficiency.",
        feedback: "Excellent response! You mentioned core technical concepts.",
        score: 85
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
  const { role, difficulty } = req.body;
  
  const roleQuestions = questionPool[role] || questionPool["Frontend"];
  const finalQuestions = roleQuestions[difficulty] || roleQuestions["Medium"];
  
  res.status(200).json(finalQuestions.map(q => ({ id: q.id, question: q.question })));
};

// @desc    Submit interview responses and get feedback
// @route   POST /api/interviews/submit
// @access  Public
export const submitInterview = async (req, res) => {
  try {
    const { role, difficulty, answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid answers structure" });
    }

    const rolePool = questionPool[role] || questionPool["Frontend"];
    const allQuestions = [...rolePool.Easy, ...rolePool.Medium, ...rolePool.Hard];

    let totalScore = 0;
    const questionsAndAnswers = answers.map(ans => {
      const original = allQuestions.find(q => q.question === ans.question || q.id === ans.questionId);
      if (!original) {
        return {
          question: ans.question || "Unknown Question",
          userAnswer: ans.userAnswer,
          feedback: "Question not found in system pool. Neutral scoring applied.",
          score: 50
        };
      }

      // Keyword matching algorithm
      const ansLower = ans.userAnswer.toLowerCase();
      const matched = original.keywords.filter(keyword => ansLower.includes(keyword));
      const matchRatio = matched.length / original.keywords.length;
      const score = Math.round(matchRatio * 100);
      
      let feedback = "";
      if (score >= 80) {
        feedback = "Excellent response! You mentioned core technical concepts.";
      } else if (score >= 40) {
        feedback = `Good attempt, but you should mention more key concepts such as: ${original.keywords.filter(kw => !ansLower.includes(kw)).join(', ')}.`;
      } else {
        feedback = `Weak answer. Please study: ${original.keywords.join(', ')}.`;
      }

      totalScore += score;
      return {
        question: original.question,
        userAnswer: ans.userAnswer,
        feedback,
        score
      };
    });

    const overallScore = Math.round(totalScore / answers.length);

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

    const interview = new Interview({
      role,
      difficulty,
      overallScore,
      questionsAndAnswers
    });

    const savedInterview = await interview.save();
    res.status(201).json(savedInterview);
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
    const interviews = await Interview.find({}).sort({ createdAt: -1 });
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
