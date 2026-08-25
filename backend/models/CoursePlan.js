import mongoose from 'mongoose';

const plannedCourseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  credits: { type: Number, required: true, default: 3 },
  category: { type: String, default: 'Major Core' },
  prerequisites: [{ type: String }],
  status: { type: String, enum: ['Completed', 'In Progress', 'Planned'], default: 'Planned' }
});

const coursePlanSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo-student' },
  planTitle: { type: String, required: true, default: '4-Year CSE Degree Roadmap' },
  targetGraduationYear: { type: Number, default: 2026 },
  totalRequiredCredits: { type: Number, default: 136 },
  completedCredits: { type: Number, default: 96 },
  plannedSemesters: [
    {
      term: { type: String, required: true }, // e.g. "Spring 2026", "Summer 2026"
      credits: { type: Number, default: 12 },
      courses: [plannedCourseSchema]
    }
  ]
}, { timestamps: true });

export default mongoose.model('CoursePlan', coursePlanSchema);
