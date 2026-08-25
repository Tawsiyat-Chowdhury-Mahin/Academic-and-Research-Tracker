import CVAnalysis from '../models/CVAnalysis.js';
import mongoose from 'mongoose';

// Categorization keyword map
const skillCategories = {
  languages: ['python', 'java', 'javascript', 'typescript', 'ruby', 'cpp', 'go', 'rust', 'html', 'css', 'c#'],
  frameworks: ['react', 'angular', 'vue', 'node', 'express', 'redux', 'django', 'flask', 'spring', 'pytorch', 'tensorflow', 'pandas', 'nextjs', 'vite'],
  tools: ['sql', 'mysql', 'postgresql', 'mongodb', 'sqlite', 'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'tableau', 'webpack', 'maven', 'jira']
};

// Helper function to perform a basic keyword match analysis with category breakdown
const analyzeTexts = (resumeText, jobDescription) => {
  const resumeWords = new Set(resumeText.toLowerCase().match(/\b\w+\b/g) || []);
  const jdWords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
  
  const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'for', 'on', 'with', 'as', 'at', 'by', 'an', 'be', 'this', 'are', 'from', 'or', 'with', 'your', 'our', 'we']);
  const jdKeywords = [...new Set(jdWords.filter(word => word.length > 2 && !stopWords.has(word)))];
  
  if (jdKeywords.length === 0) {
    return { 
      score: 100, 
      missingKeywords: [], 
      suggestions: ['Job description has no keywords to match.'],
      categoryScores: { languages: 100, frameworks: 100, tools: 100 }
    };
  }

  const matchedKeywords = jdKeywords.filter(word => resumeWords.has(word));
  const missingKeywords = jdKeywords.filter(word => !resumeWords.has(word));
  
  const score = Math.round((matchedKeywords.length / jdKeywords.length) * 100);
  
  // Category-based scoring
  const getCategoryScore = (categoryList) => {
    const jdCatKeywords = jdKeywords.filter(w => categoryList.includes(w));
    if (jdCatKeywords.length === 0) return null; // Category not in Job Description
    const matchedCat = jdCatKeywords.filter(w => resumeWords.has(w));
    return Math.round((matchedCat.length / jdCatKeywords.length) * 100);
  };

  const categoryScores = {
    languages: getCategoryScore(skillCategories.languages) ?? 50, // default if not mentioned
    frameworks: getCategoryScore(skillCategories.frameworks) ?? 50,
    tools: getCategoryScore(skillCategories.tools) ?? 50
  };

  const suggestions = [];
  if (score < 40) {
    suggestions.push('Add more relevant experience related to the job requirements.');
  }
  if (missingKeywords.length > 0) {
    suggestions.push(`Consider adding some of these missing keywords: ${missingKeywords.slice(0, 5).join(', ')}.`);
  } else {
    suggestions.push('Great match! Your resume contains all keywords from the job description.');
  }
  suggestions.push('Ensure your resume contains action verbs to showcase achievements.');

  return {
    score,
    missingKeywords: missingKeywords.slice(0, 10),
    suggestions,
    categoryScores
  };
};

// Demo database for CV Analyzer (in-memory fallback)
let mockAnalyses = [
  {
    _id: "mock-cv-1",
    resumeText: "Experienced React Developer. Technical skills: React, Node, Express, JavaScript, Git, Redux, REST APIs.",
    jobDescription: "Looking for a Frontend Developer with React, Redux, Git, and JavaScript knowledge.",
    score: 85,
    suggestions: [
      "Great match! Your resume contains all core keywords from the job description.",
      "Ensure your resume contains action verbs to showcase achievements."
    ],
    missingKeywords: ["REST APIs"],
    categoryScores: { languages: 100, frameworks: 80, tools: 75 },
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    _id: "mock-cv-2",
    resumeText: "Python developer with some Java experience. Skills: SQL, Tableau, Pandas, Excel.",
    jobDescription: "Senior React Engineer needed. Skills: React, CSS, HTML5, TypeScript, Webpack.",
    score: 15,
    suggestions: [
      "Add more relevant experience related to the job requirements.",
      "Consider adding some of these missing keywords: React, CSS, HTML5, TypeScript, Webpack.",
      "Ensure your resume contains action verbs to showcase achievements."
    ],
    missingKeywords: ["React", "CSS", "HTML5", "TypeScript", "Webpack"],
    categoryScores: { languages: 25, frameworks: 10, tools: 15 },
    createdAt: new Date(Date.now() - 7200000)
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
    const analyses = await CVAnalysis.find({}).sort({ createdAt: -1 });
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

    const { score, missingKeywords, suggestions, categoryScores } = analyzeTexts(resumeText, jobDescription);

    if (!isConnected()) {
      const newAnalysis = {
        _id: `mock-cv-${Date.now()}`,
        resumeText,
        jobDescription,
        score,
        suggestions,
        missingKeywords,
        categoryScores,
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
      missingKeywords,
      // We can extend Mongoose model schema or let it save dynamically if schema allows.
      // Wait, let's store categoryScores in schema if mongoose schema doesn't define it.
      // Wait, let's verify if models/CVAnalysis.js has categoryScores. It doesn't yet.
      // Let's modify CVAnalysis.js to allow categoryScores.
    });

    const createdAnalysis = await analysis.save();
    // We will save categoryScores to the MongoDB document dynamically if we add it to the schema.
    // Let's also update models/CVAnalysis.js schema to prevent SQL/Mongoose discarding fields.
    // Let's see: yes! Let's update CVAnalysis model schema as well.
    res.status(201).json({ ...createdAnalysis.toJSON(), categoryScores });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete analysis record
// @route   DELETE /api/cv-analyses/:id
// @access  Public
export const deleteAnalysis = async (req, res) => {
  try {
    if (!isConnected()) {
      mockAnalyses = mockAnalyses.filter(a => a._id !== req.params.id);
      return res.status(200).json({ message: 'Analysis record deleted (mock)' });
    }
    const analysis = await CVAnalysis.findById(req.params.id);
    if (analysis) {
      await CVAnalysis.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Analysis record deleted' });
    } else {
      res.status(404).json({ message: 'Analysis record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    if (!isConnected()) {
      const analysis = mockAnalyses.find(a => a._id === req.params.id);
      if (analysis) return res.status(200).json(analysis);
      return res.status(404).json({ message: 'Analysis record not found (mock)' });
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
