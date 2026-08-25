import StudyPlan from '../models/StudyPlan.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;

let initialSamplePlans = [
  {
    planName: "Spring 2026 Midterm & Assignment Planner",
    viewMode: "Daily",
    dailyAvailableHours: 5,
    tasks: [
      {
        title: "CSE327 Software Engineering Midterm Revision",
        course: "CSE327",
        type: "Exam",
        deadlineDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        estimatedHours: 6,
        priority: "High",
        completed: false
      },
      {
        title: "CSE411 Database Schema Design Report",
        course: "CSE411",
        type: "Assignment",
        deadlineDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        estimatedHours: 4,
        priority: "Medium",
        completed: false
      },
      {
        title: "CSE422 Machine Learning Lab 3 (Neural Nets)",
        course: "CSE422",
        type: "Assignment",
        deadlineDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        estimatedHours: 3,
        priority: "High",
        completed: true
      }
    ],
    schedule: [
      {
        timeSlot: "09:00 AM - 11:30 AM",
        activity: "CSE327: Review MVC Controller Architecture & UML diagrams",
        course: "CSE327",
        targetGoal: "Solve sample midterm questions",
        isDone: false
      },
      {
        timeSlot: "02:00 PM - 04:30 PM",
        activity: "CSE411: Write BCNF normalization breakdown",
        course: "CSE411",
        targetGoal: "Complete Section 3 of project report",
        isDone: true
      }
    ],
    notes: "Focus on CSE327 MVC patterns first as the exam is approaching in 3 days."
  }
];

let fallbackPlans = [...initialSamplePlans];

export const getStudyPlans = async (req, res) => {
  try {
    if (isDbConnected()) {
      let plans = await StudyPlan.find().sort({ createdAt: -1 });
      if (plans.length === 0) {
        plans = await StudyPlan.insertMany(initialSamplePlans);
      }
      return res.json(plans);
    }
    return res.json(fallbackPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStudyPlan = async (req, res) => {
  try {
    if (isDbConnected()) {
      const created = await StudyPlan.create(req.body);
      return res.status(201).json(created);
    }
    const newObj = { _id: Date.now().toString(), ...req.body };
    fallbackPlans.unshift(newObj);
    return res.status(201).json(newObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

export const deleteStudyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await StudyPlan.findByIdAndDelete(id);
      return res.json({ message: 'Deleted successfully' });
    }
    fallbackPlans = fallbackPlans.filter(p => p._id !== id);
    return res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};