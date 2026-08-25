import mongoose from 'mongoose';

const studyTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  type: { type: String, enum: ['Exam', 'Assignment', 'Revision', 'Lecture Prep'], default: 'Revision' },
  deadlineDate: { type: String, required: true },
  estimatedHours: { type: Number, default: 2 },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  completed: { type: Boolean, default: false }
});

const scheduleSlotSchema = new mongoose.Schema({
  timeSlot: { type: String, required: true },
  activity: { type: String, required: true },
  course: { type: String, required: true },
  targetGoal: { type: String },
  isDone: { type: Boolean, default: false }
});

const studyPlanSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo-student' },
  planName: { type: String, required: true },
  viewMode: { type: String, enum: ['Daily', 'Monthly'], default: 'Daily' },
  dailyAvailableHours: { type: Number, default: 4 },
  tasks: [studyTaskSchema],
  schedule: [scheduleSlotSchema],
  notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('StudyPlan', studyPlanSchema);