import mongoose from 'mongoose';

const interviewSchema = mongoose.Schema(
  {
    role: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    overallScore: { type: Number, required: true },
    questionsAndAnswers: [
      {
        question: { type: String, required: true },
        userAnswer: { type: String, default: '(No response provided)' },
        feedback: { type: String, default: 'Evaluation completed.' },
        score: { type: Number, default: 0 },
        idealAnswer: { type: String, default: '' },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
