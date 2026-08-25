import CgpaRecord from '../models/CgpaRecord.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;

const sampleCgpaData = [
  {
    userId: 'demo-student',
    studentName: 'Mahin',
    studentId: 'CSE-2026-001',
    department: 'Computer Science & Engineering',
    currentCgpa: 3.86,
    totalCreditsCompleted: 96,
    targetCgpa: 3.90,
    semesters: [
      {
        semesterName: 'Fall 2025',
        semesterGpa: 3.92,
        semesterCredits: 12,
        courses: [
          { courseCode: 'CSE327', courseTitle: 'Software Engineering', credits: 3, grade: 'A', gradePoint: 4.0 },
          { courseCode: 'CSE422', courseTitle: 'Artificial Intelligence', credits: 3, grade: 'A', gradePoint: 4.0 },
          { courseCode: 'CSE411', courseTitle: 'Database Management Systems', credits: 3, grade: 'A-', gradePoint: 3.7 },
          { courseCode: 'MAT215', courseTitle: 'Complex Variables & Laplace', credits: 3, grade: 'A', gradePoint: 4.0 }
        ]
      },
      {
        semesterName: 'Summer 2025',
        semesterGpa: 3.80,
        semesterCredits: 9,
        courses: [
          { courseCode: 'CSE220', courseTitle: 'Data Structures', credits: 3, grade: 'A', gradePoint: 4.0 },
          { courseCode: 'CSE260', courseTitle: 'Digital Logic Design', credits: 3, grade: 'A-', gradePoint: 3.7 },
          { courseCode: 'ENG102', courseTitle: 'English Composition II', credits: 3, grade: 'A-', gradePoint: 3.7 }
        ]
      }
    ]
  }
];

let fallbackCgpa = [...sampleCgpaData];

export const getCgpaRecords = async (req, res) => {
  try {
    if (isDbConnected()) {
      let records = await CgpaRecord.find().sort({ createdAt: -1 });
      if (records.length === 0) {
        records = await CgpaRecord.insertMany(sampleCgpaData);
      }
      return res.json(records);
    }
    return res.json(fallbackCgpa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveCgpaRecord = async (req, res) => {
  try {
    if (isDbConnected()) {
      const created = await CgpaRecord.create(req.body);
      return res.status(201).json(created);
    }
    const newObj = { _id: Date.now().toString(), ...req.body };
    fallbackCgpa.unshift(newObj);
    return res.status(201).json(newObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
