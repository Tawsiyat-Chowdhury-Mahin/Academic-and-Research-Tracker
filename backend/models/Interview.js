import mongoose from 'mongoose';

const interviewSchema = mongoose.Schema(
  {
    role: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    overallScore: { type: Number, required: true },
    questionsAndAnswers: [
      {
        question: { type: String, required: true },
        userAnswer: { type: String, required: true },
        feedback: { type: String, required: true },
        score: { type: Number, required: true },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
