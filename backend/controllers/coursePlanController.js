import CoursePlan from '../models/CoursePlan.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;

const sampleCoursePlans = [
  {
    userId: 'demo-student',
    planTitle: 'BRACU B.Sc. in CSE Degree Pathway (136 Credits)',
    targetGraduationYear: 2026,
    totalRequiredCredits: 136,
    completedCredits: 96,
    plannedSemesters: [
      {
        term: 'Spring 2026 (Upcoming)',
        credits: 12,
        courses: [
          { code: 'CSE470', title: 'Software Engineering II', credits: 3, category: 'Major Core', prerequisites: ['CSE327'], status: 'Planned' },
          { code: 'CSE423', title: 'Computer Graphics', credits: 3, category: 'Major Elective', prerequisites: ['CSE220', 'MAT215'], status: 'Planned' },
          { code: 'CSE421', title: 'Computer Networks', credits: 3, category: 'Major Core', prerequisites: ['CSE320'], status: 'Planned' },
          { code: 'CSE400', title: 'Final Year Thesis / Project (Phase 1)', credits: 3, category: 'Capstone', prerequisites: ['Completed 90+ Credits'], status: 'Planned' }
        ]
      },
      {
        term: 'Summer 2026',
        credits: 9,
        courses: [
          { code: 'CSE400', title: 'Final Year Thesis / Project (Phase 2)', credits: 3, category: 'Capstone', prerequisites: ['Phase 1'], status: 'Planned' },
          { code: 'CSE460', title: 'Operating Systems', credits: 3, category: 'Major Core', prerequisites: ['CSE320'], status: 'Planned' },
          { code: 'ECO101', title: 'Introduction to Economics', credits: 3, category: 'General Education', prerequisites: [], status: 'Planned' }
        ]
      }
    ]
  }
];

let fallbackCoursePlans = [...sampleCoursePlans];

export const getCoursePlans = async (req, res) => {
  try {
    if (isDbConnected()) {
      let plans = await CoursePlan.find().sort({ createdAt: -1 });
      if (plans.length === 0) {
        plans = await CoursePlan.insertMany(sampleCoursePlans);
      }
      return res.json(plans);
    }
    return res.json(fallbackCoursePlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveCoursePlan = async (req, res) => {
  try {
    if (isDbConnected()) {
      const created = await CoursePlan.create(req.body);
      return res.status(201).json(created);
    }
    const newObj = { _id: Date.now().toString(), ...req.body };
    fallbackCoursePlans.unshift(newObj);
    return res.status(201).json(newObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
