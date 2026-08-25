import mongoose from 'mongoose';

const facultyReviewSchema = new mongoose.Schema({
  facultyName: { type: String, required: true },
  initial: { type: String, required: true },
  department: { type: String, default: 'Computer Science & Engineering' },
  courseCode: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], default: 'Moderate' },
  teachingQuality: { type: Number, min: 1, max: 5, default: 5 },
  helpfulness: { type: Number, min: 1, max: 5, default: 5 },
  reviewText: { type: String, required: true },
  studentGrade: { type: String, default: 'A' },
  likesCount: { type: Number, default: 12 }
}, { timestamps: true });

export default mongoose.model('FacultyReview', facultyReviewSchema);
