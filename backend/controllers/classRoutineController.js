import ClassRoutine from '../models/ClassRoutine.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;

const sampleRoutines = [
  {
    userId: 'demo-student',
    semester: 'Spring 2026',
    totalCredits: 12,
    slots: [
      {
        day: 'Sunday & Tuesday',
        timeSlot: '08:00 AM - 09:20 AM',
        courseCode: 'CSE327',
        courseTitle: 'Software Engineering',
        section: '01',
        room: 'UB20401',
        facultyInitial: 'NIP'
      },
      {
        day: 'Sunday & Tuesday',
        timeSlot: '11:00 AM - 12:20 PM',
        courseCode: 'CSE422',
        courseTitle: 'Artificial Intelligence',
        section: '03',
        room: 'UB30502',
        facultyInitial: 'MTA'
      },
      {
        day: 'Monday & Wednesday',
        timeSlot: '09:30 AM - 10:50 AM',
        courseCode: 'CSE411',
        courseTitle: 'Database Systems',
        section: '02',
        room: 'UB20304',
        facultyInitial: 'JMR'
      },
      {
        day: 'Monday & Wednesday',
        timeSlot: '02:00 PM - 03:20 PM',
        courseCode: 'MAT215',
        courseTitle: 'Complex Variables & Laplace',
        section: '05',
        room: 'UB10202',
        facultyInitial: 'ARH'
      }
    ]
  }
];

let fallbackRoutines = [...sampleRoutines];

export const getClassRoutines = async (req, res) => {
  try {
    if (isDbConnected()) {
      let routines = await ClassRoutine.find().sort({ createdAt: -1 });
      if (routines.length === 0) {
        routines = await ClassRoutine.insertMany(sampleRoutines);
      }
      return res.json(routines);
    }
    return res.json(fallbackRoutines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveClassRoutine = async (req, res) => {
  try {
    if (isDbConnected()) {
      const created = await ClassRoutine.create(req.body);
      return res.status(201).json(created);
    }
    const newObj = { _id: Date.now().toString(), ...req.body };
    fallbackRoutines.unshift(newObj);
    return res.status(201).json(newObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
