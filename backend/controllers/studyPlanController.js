import StudyPlan from '../models/StudyPlan.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;
let fallbackPlans = [];

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