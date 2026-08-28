import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import cvAnalyzerRoutes from './routes/cvAnalyzerRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import alumniRoutes from './routes/alumniRoutes.js';
import studyPlanRoutes from './routes/studyPlanRoutes.js';
import cgpaRoutes from './routes/cgpaRoutes.js';
import coursePlanRoutes from './routes/coursePlanRoutes.js';
import flashCardRoutes from "./routes/flashCardRoutes.js";
import classRoutineRoutes from './routes/classRoutineRoutes.js';
import facultyReviewRoutes from './routes/facultyReviewRoutes.js';

dotenv.config();

// Connect to database (with automatic fallback to in-memory mode if Mongo is offline)
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/cv-analyses', cvAnalyzerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/study-plans', studyPlanRoutes);
app.use('/api/cgpa', cgpaRoutes);
app.use('/api/course-plans', coursePlanRoutes);
app.use('/api/class-routines', classRoutineRoutes);
app.use('/api/faculty-reviews', facultyReviewRoutes);
app.use('/api/faculty-reviews', facultyReviewRoutes);
app.use('/api/flash-cards', flashCardRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Academic & Research Tracker Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
