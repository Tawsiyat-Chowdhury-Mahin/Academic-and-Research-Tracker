import StudyPlan from '../models/StudyPlan.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;

// Sample fallback in-memory data if MongoDB is temporarily offline
let fallbackPlans = [
  {
    _id: 'sample-plan-1',
    planName: 'Spring 2026 Exam & Assignment Schedule',
    viewMode: 'Daily',
    dailyAvailableHours: 4,
    tasks: [
      {
        _id: 't1',
        title: 'Midterm Exam Preparation',
        course: 'CSE327 Software Engineering',
        type: 'Exam',
        deadlineDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        estimatedHours: 6,
        priority: 'High',
        completed: false
      },
      {
        _id: 't2',
        title: 'Sprint 2 Project Report',
        course: 'CSE411 Database Systems',
        type: 'Assignment',
        deadlineDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        estimatedHours: 4,
        priority: 'Medium',
        completed: false
      }
    ],
    schedule: [
      {
        timeSlot: '09:00 AM - 11:00 AM',
        activity: 'CSE327: Review MVC Architecture & Controller patterns',
        course: 'CSE327',
        targetGoal: 'Complete Chapter 4 & 5 review questions',
        isDone: false
      },
      {
        timeSlot: '02:00 PM - 04:00 PM',
        activity: 'CSE411: Write Database Normalization section',
        course: 'CSE411',
        targetGoal: 'Draft 3 pages for Sprint 2 report',
        isDone: true
      }
    ],
    notes: 'Prioritize CSE327 midterm first because it has the nearest deadline.'
  }
];

// 1. Get all study plans
export const getStudyPlans = async (req, res) => {
  try {
    if (isDbConnected()) {
      const plans = await StudyPlan.find().sort({ createdAt: -1 });
      return res.json(plans);
    }
    return res.json(fallbackPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Create a new study plan
export const createStudyPlan = async (req, res) => {
  try {
    if (isDbConnected()) {
      const created = await StudyPlan.create(req.body);
      return res.status(201).json(created);
    }
    const newObj = { _id: Date.now().toString(), createdAt: new Date().toISOString(), ...req.body };
    fallbackPlans.unshift(newObj);
    return res.status(201).json(newObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Update an existing study plan
export const updateStudyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const updated = await StudyPlan.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(updated);
    }
    const index = fallbackPlans.findIndex(p => p._id === id);
    if (index !== -1) {
      fallbackPlans[index] = { ...fallbackPlans[index], ...req.body };
      return res.json(fallbackPlans[index]);
    }
    return res.status(404).json({ message: 'Plan not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Delete a study plan
export const deleteStudyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await StudyPlan.findByIdAndDelete(id);
      return res.json({ message: 'Study plan deleted successfully' });
    }
    fallbackPlans = fallbackPlans.filter(p => p._id !== id);
    return res.json({ message: 'Study plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};