import mongoose from 'mongoose';

const routineSlotSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. "Sunday", "Tuesday"
  timeSlot: { type: String, required: true }, // e.g. "08:00 AM - 09:20 AM"
  courseCode: { type: String, required: true },
  courseTitle: { type: String, required: true },
  section: { type: String, default: '01' },
  room: { type: String, default: 'UB20401' },
  facultyInitial: { type: String, default: 'NIP' }
});

const classRoutineSchema = new mongoose.Schema({
  userId: { type: String, default: 'demo-student' },
  semester: { type: String, default: 'Spring 2026' },
  totalCredits: { type: Number, default: 12 },
  slots: [routineSlotSchema]
}, { timestamps: true });

export default mongoose.model('ClassRoutine', classRoutineSchema);
