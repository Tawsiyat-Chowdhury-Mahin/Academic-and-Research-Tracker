import FacultyReview from '../models/FacultyReview.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;

const sampleReviews = [
  {
    facultyName: 'Nazmul Islam Pranto',
    initial: 'NIP',
    department: 'Computer Science & Engineering',
    courseCode: 'CSE327',
    rating: 5,
    difficulty: 'Moderate',
    teachingQuality: 5,
    helpfulness: 5,
    reviewText: 'Explains complex DevOps and software engineering architecture patterns with hands-on lab demos. Very supportive during consultation hours.',
    studentGrade: 'A',
    likesCount: 28
  },
  {
    facultyName: 'Md. Tawhid Anwar',
    initial: 'MTA',
    department: 'Computer Science & Engineering',
    courseCode: 'CSE110 & CSE111',
    rating: 5,
    difficulty: 'Moderate',
    teachingQuality: 5,
    helpfulness: 5,
    reviewText: 'One of the best faculty members for foundation programming and OOP. His explanations of recursion and call stack traces are crystal clear.',
    studentGrade: 'A',
    likesCount: 45
  },
  {
    facultyName: 'Jumana Rahman',
    initial: 'JMR',
    department: 'Computer Science & Engineering',
    courseCode: 'CSE220',
    rating: 5,
    difficulty: 'Moderate',
    teachingQuality: 5,
    helpfulness: 5,
    reviewText: 'Excellent guidance on linked lists and binary trees. Makes data structure conceptual problems easy to digest.',
    studentGrade: 'A',
    likesCount: 19
  }
];

let fallbackReviews = [...sampleReviews];

export const getFacultyReviews = async (req, res) => {
  try {
    if (isDbConnected()) {
      let reviews = await FacultyReview.find().sort({ createdAt: -1 });
      if (reviews.length === 0) {
        reviews = await FacultyReview.insertMany(sampleReviews);
      }
      return res.json(reviews);
    }
    return res.json(fallbackReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFacultyReview = async (req, res) => {
  try {
    if (isDbConnected()) {
      const created = await FacultyReview.create(req.body);
      return res.status(201).json(created);
    }
    const newObj = { _id: Date.now().toString(), ...req.body };
    fallbackReviews.unshift(newObj);
    return res.status(201).json(newObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
