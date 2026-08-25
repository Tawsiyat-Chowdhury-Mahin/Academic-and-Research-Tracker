import mongoose from 'mongoose';

const courseGradeSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseTitle: { type: String, required: true },
  credits: { type: Number, required: true, default: 3 },
  grade: { type: String, required: true, default: 'A' },
  gradePoint: { type: Number, required: true, default: 4.0 }
});

const cgpaRecordSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo-student' },
  studentName: { type: String, default: 'Mahin' },
  studentId: { type: String, default: 'CSE-2026-001' },
  department: { type: String, default: 'Computer Science & Engineering' },
  currentCgpa: { type: Number, required: true, default: 3.85 },
  totalCreditsCompleted: { type: Number, required: true, default: 96 },
  targetCgpa: { type: Number, default: 3.90 },
  semesters: [
    {
      semesterName: { type: String, required: true },
      semesterGpa: { type: Number, required: true },
      semesterCredits: { type: Number, required: true },
      courses: [courseGradeSchema]
    }
  ]
}, { timestamps: true });

export default mongoose.model('CgpaRecord', cgpaRecordSchema);
