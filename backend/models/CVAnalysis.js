import mongoose from 'mongoose';

const cvAnalysisSchema = mongoose.Schema(
  {
    resumeText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    score: { type: Number, required: true },
    suggestions: [{ type: String }],
    missingKeywords: [{ type: String }],
    categoryScores: {
      languages: { type: Number, default: 0 },
      frameworks: { type: Number, default: 0 },
      tools: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
  }
);

const CVAnalysis = mongoose.model('CVAnalysis', cvAnalysisSchema);

export default CVAnalysis;
