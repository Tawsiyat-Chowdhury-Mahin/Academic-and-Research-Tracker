import CVAnalysis from '../models/CVAnalysis.js';
import mongoose from 'mongoose';

// Categorization keyword map
const skillCategories = {
  languages: ['python', 'java', 'javascript', 'typescript', 'ruby', 'cpp', 'c++', 'go', 'rust', 'html', 'css', 'c#', 'sql', 'bash', 'php', 'swift', 'kotlin'],
  frameworks: ['react', 'angular', 'vue', 'node', 'nodejs', 'express', 'redux', 'django', 'flask', 'spring', 'springboot', 'pytorch', 'tensorflow', 'pandas', 'numpy', 'nextjs', 'vite', 'tailwind', 'bootstrap', 'fastapi'],
  tools: ['sql', 'mysql', 'postgresql', 'mongodb', 'sqlite', 'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'tableau', 'webpack', 'maven', 'jira', 'ci/cd', 'jenkins', 'linux', 'postman']
};

const actionVerbs = [
  "Architected", "Engineered", "Developed", "Implemented", "Optimized",
  "Spearheaded", "Refactored", "Automated", "Integrated", "Deployed",
  "Enhanced", "Orchestrated", "Accelerated", "Streamlined", "Collaborated"
];

// Helper function to perform a detailed keyword match analysis with rich actionable improvement suggestions
const analyzeTexts = (resumeText, jobDescription) => {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  
  const resumeWords = new Set(resumeLower.match(/\b[a-zA-Z0-9+#.-]+\b/g) || []);
  const jdWords = jdLower.match(/\b[a-zA-Z0-9+#.-]+\b/g) || [];
  
  const stopWords = new Set([
    'the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'for', 'on', 'with', 'as', 'at', 'by', 'an', 'be',
    'this', 'are', 'from', 'or', 'with', 'your', 'our', 'we', 'will', 'have', 'has', 'you', 'must', 'can',
    'should', 'all', 'any', 'about', 'who', 'what', 'their', 'them', 'these', 'those', 'also', 'such', 'into'
  ]);
  
  const jdKeywords = [...new Set(jdWords.filter(word => word.length > 2 && !stopWords.has(word)))];
  
  if (jdKeywords.length === 0) {
    return { 
      score: 100, 
      missingKeywords: [], 
      suggestions: ['Job description has no identifiable technical keywords.'],
      categoryScores: { languages: 100, frameworks: 100, tools: 100 },
      improvementPlan: {
        bulletRecommendations: [],
        atsAudit: [],
        keywordPlacement: [],
        tailoredPitch: "Ready to apply with full keyword coverage."
      }
    };
  }

  const matchedKeywords = jdKeywords.filter(word => resumeWords.has(word));
  const missingKeywords = jdKeywords.filter(word => !resumeWords.has(word));
  
  const rawScore = Math.round((matchedKeywords.length / jdKeywords.length) * 100);
  const score = Math.min(100, Math.max(15, rawScore * 2)); // normalized for realistic ATS scoring

  // Category-based scoring
  const getCategoryScore = (categoryList) => {
    const jdCatKeywords = jdKeywords.filter(w => categoryList.includes(w));
    if (jdCatKeywords.length === 0) return 70; // neutral default if not specifically requested
    const matchedCat = jdCatKeywords.filter(w => resumeWords.has(w));
    return Math.min(100, Math.round((matchedCat.length / jdCatKeywords.length) * 100));
  };

  const categoryScores = {
    languages: getCategoryScore(skillCategories.languages),
    frameworks: getCategoryScore(skillCategories.frameworks),
    tools: getCategoryScore(skillCategories.tools)
  };

  // 1. General Actionable Suggestions
  const suggestions = [];
  if (score < 50) {
    suggestions.push('Significant keyword gap detected: Align your project descriptions directly with the technical requirements mentioned in the job description.');
  } else if (score < 75) {
    suggestions.push('Good foundational match: Integrate 3–5 specific tools and domain keywords into your experience bullet points to cross the 80% ATS threshold.');
  } else {
    suggestions.push('Excellent candidate alignment: Your CV strongly matches the target job specifications.');
  }

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5).join(', ');
    suggestions.push(`High Priority Keywords to Add: Include "${topMissing}" in your Skills or Experience sections.`);
  }

  suggestions.push('Quantify your impact: Add numerical metrics (e.g. "% performance boost", "X users served", "Y ms latency reduction") to every project.');

  // 2. Concrete Bullet Point Improvement Recommendations
  const bulletRecommendations = [
    {
      type: "Before (Weak / Passive)",
      text: "Worked on frontend features and fixed bugs in the web app.",
      status: "weak"
    },
    {
      type: "After (High-Impact ATS Format)",
      text: `Engineered responsive user interfaces utilizing ${matchedKeywords.slice(0, 2).join(' & ') || 'modern frameworks'}, optimizing page load time by 30% and integrating ${missingKeywords[0] || 'clean REST APIs'}.`,
      status: "strong"
    },
    {
      type: "Before (Weak / Passive)",
      text: "Helped team with database queries and backend APIs.",
      status: "weak"
    },
    {
      type: "After (High-Impact ATS Format)",
      text: `Architected modular backend services with ${matchedKeywords.includes('node') ? 'Node.js' : 'RESTful architecture'}, implementing robust database indexing that streamlined query latency by 45%.`,
      status: "strong"
    }
  ];

  // 3. ATS Compliance & Formatting Audit
  const resumeLengthWords = resumeText.trim().split(/\s+/).length;
  const atsAudit = [
    {
      check: "Resume Word Count & Length",
      passed: resumeLengthWords >= 150 && resumeLengthWords <= 800,
      feedback: resumeLengthWords < 150 ? "CV is too brief. Expand on technical project methodologies and outcomes." : resumeLengthWords > 800 ? "CV exceeds 800 words. Condense to 1-2 pages for maximum recruiter readability." : "Optimal length (1-2 pages formatted)."
    },
    {
      check: "Action Verb Density",
      passed: actionVerbs.some(v => resumeLower.includes(v.toLowerCase())),
      feedback: actionVerbs.some(v => resumeLower.includes(v.toLowerCase())) ? "Strong active language detected across project descriptions." : "Low action verb density. Start bullet points with strong action verbs like 'Engineered', 'Optimized', or 'Architected'."
    },
    {
      check: "Technical Skills Categorization",
      passed: resumeLower.includes('skills') || resumeLower.includes('technologies'),
      feedback: (resumeLower.includes('skills') || resumeLower.includes('technologies')) ? "Clear technical skills section identified." : "Missing dedicated 'Technical Skills' section. Group skills into Languages, Frameworks, and Tools."
    },
    {
      check: "Quantifiable Metrics Presence",
      passed: /\d+%|\d+ms|\d+k|\d+\+/i.test(resumeText),
      feedback: /\d+%|\d+ms|\d+k|\d+\+/i.test(resumeText) ? "Excellent use of quantitative performance numbers." : "No measurable metrics found. Add numbers, percentages, or scale indicators to demonstrate real impact."
    }
  ];

  // 4. Keyword Placement Strategy
  const keywordPlacement = missingKeywords.slice(0, 6).map((kw, i) => ({
    keyword: kw,
    recommendedSection: i % 2 === 0 ? "Technical Skills (Categorized List)" : "Projects & Experience (Action Bullets)",
    exampleSnippet: `...hands-on experience applying ${kw} in production-ready environments...`
  }));

  // 5. Tailored Elevator Pitch / Summary
  const topSkillsSummary = matchedKeywords.slice(0, 3).join(', ') || 'software development';
  const tailoredPitch = `Demonstrated proficiency in ${topSkillsSummary} with a strong track record of engineering reliable, scalable solutions. Eager to leverage these competencies alongside hands-on problem-solving to drive impactful contributions as required in this role.`;

  return {
    score,
    missingKeywords: missingKeywords.slice(0, 8),
    suggestions,
    categoryScores,
    improvementPlan: {
      bulletRecommendations,
      atsAudit,
      keywordPlacement,
      tailoredPitch
    }
  };
};

// Demo database for CV Analyzer (in-memory fallback)
let mockAnalyses = [
  {
    _id: "mock-cv-1",
    resumeText: "Experienced Full Stack Developer. Technical skills: React, Node.js, Express, JavaScript, Git, Redux, REST APIs, MongoDB, Tailwind CSS, Docker. Led development of university academic tracker portal.",
    jobDescription: "Looking for a Frontend / Full Stack Software Engineer proficient in React, Node.js, TypeScript, Docker, and REST API architecture. Strong problem-solving skills required.",
    score: 85,
    suggestions: [
      "Excellent candidate alignment: Your CV strongly matches the target job specifications.",
      "High Priority Keywords to Add: Include 'typescript' in your Skills or Experience sections.",
      "Quantify your impact: Add numerical metrics (e.g. '% performance boost', 'X users served') to every project."
    ],
    missingKeywords: ["typescript"],
    categoryScores: { languages: 90, frameworks: 95, tools: 85 },
    improvementPlan: {
      bulletRecommendations: [
        {
          type: "Before (Weak / Passive)",
          text: "Built frontend features for academic portal.",
          status: "weak"
        },
        {
          type: "After (High-Impact ATS Format)",
          text: "Engineered responsive user interfaces utilizing React and Tailwind CSS, optimizing bundle size by 35% and integrating TypeScript typing.",
          status: "strong"
        }
      ],
      atsAudit: [
        { check: "Resume Word Count & Length", passed: true, feedback: "Optimal length (1-2 pages formatted)." },
        { check: "Action Verb Density", passed: true, feedback: "Strong active language detected." },
        { check: "Technical Skills Categorization", passed: true, feedback: "Clear technical skills section identified." },
        { check: "Quantifiable Metrics Presence", passed: true, feedback: "Good metric distribution." }
      ],
      keywordPlacement: [
        { keyword: "typescript", recommendedSection: "Technical Skills", exampleSnippet: "TypeScript, JavaScript (ES6+), React.js" }
      ],
      tailoredPitch: "Demonstrated proficiency in React, Node.js, and Docker with a track record of shipping performant web applications. Excited to bring these full-stack skills to your engineering team."
    },
    createdAt: new Date(Date.now() - 3600000)
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all CV analyses
// @route   GET /api/cv-analyses
// @access  Public
export const getCVAnalyses = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json(mockAnalyses);
    }
    let analyses = await CVAnalysis.find({}).sort({ createdAt: -1 });
    if (analyses.length === 0) {
      await CVAnalysis.insertMany(mockAnalyses.map(({ _id, ...rest }) => rest));
      analyses = await CVAnalysis.find({}).sort({ createdAt: -1 });
    }
    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze CV against Job Description
// @route   POST /api/cv-analyses
// @access  Public
export const analyzeCV = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Both resume text and job description are required' });
    }

    const { score, missingKeywords, suggestions, categoryScores, improvementPlan } = analyzeTexts(resumeText, jobDescription);

    if (!isConnected()) {
      const newAnalysis = {
        _id: `mock-cv-${Date.now()}`,
        resumeText,
        jobDescription,
        score,
        suggestions,
        missingKeywords,
        categoryScores,
        improvementPlan,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockAnalyses.unshift(newAnalysis);
      return res.status(201).json(newAnalysis);
    }

    const analysis = new CVAnalysis({
      resumeText,
      jobDescription,
      score,
      suggestions,
      missingKeywords
    });

    const createdAnalysis = await analysis.save();
    res.status(201).json({
      ...createdAnalysis.toJSON(),
      categoryScores,
      improvementPlan
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single analysis record by ID
// @route   GET /api/cv-analyses/:id
// @access  Public
export const getAnalysisById = async (req, res) => {
  try {
    if (!isConnected()) {
      const item = mockAnalyses.find(a => a._id === req.params.id);
      if (item) return res.status(200).json(item);
      return res.status(404).json({ message: 'Analysis not found (mock)' });
    }
    const analysis = await CVAnalysis.findById(req.params.id);
    if (analysis) {
      res.status(200).json(analysis);
    } else {
      res.status(404).json({ message: 'Analysis not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete analysis record
// @route   DELETE /api/cv-analyses/:id
// @access  Public
export const deleteAnalysis = async (req, res) => {
  try {
    if (!isConnected()) {
      mockAnalyses = mockAnalyses.filter(a => a._id !== req.params.id);
      return res.status(200).json({ message: 'Analysis removed successfully (mock)' });
    }
    const analysis = await CVAnalysis.findById(req.params.id);
    if (analysis) {
      await CVAnalysis.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Analysis removed successfully' });
    } else {
      res.status(404).json({ message: 'Analysis not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
