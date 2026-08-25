import Resume from '../models/Resume.js';
import mongoose from 'mongoose';

// Demo database for Resume Builder (in-memory fallback)
let mockResumes = [
  {
    _id: "mock-res-1",
    fullName: "Alice Dev",
    email: "alice.dev@example.com",
    phone: "+1 555-0199",
    summary: "Passionate Full Stack Developer with 2+ years of experience in React and Node.js.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "HTML/CSS"],
    education: [
      {
        institution: "University of CSE",
        degree: "B.Sc. in Computer Science",
        startDate: "2021",
        endDate: "2025"
      }
    ],
    experience: [
      {
        company: "Web Solutions Inc.",
        position: "Frontend Intern",
        startDate: "Jun 2024",
        endDate: "Sep 2024",
        description: "Built responsive user interfaces and optimized state management using React Redux."
      }
    ]
  },
  {
    _id: "mock-res-2",
    fullName: "Bob Analyst",
    email: "bob.analyst@example.com",
    phone: "+1 555-0234",
    summary: "Dedicated Data Analyst skilled in Python, SQL, and data visualization.",
    skills: ["Python", "SQL", "Tableau", "Pandas", "Machine Learning"],
    education: [
      {
        institution: "Data Science Institute",
        degree: "M.Sc. in Data Analytics",
        startDate: "2022",
        endDate: "2024"
      }
    ],
    experience: [
      {
        company: "Insight Corp",
        position: "Data Assistant",
        startDate: "Mar 2023",
        endDate: "Dec 2023",
        description: "Analyzed consumer behavior datasets and built business intelligence dashboards."
      }
    ]
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all resumes
// @route   GET /api/resumes
// @access  Public
export const getResumes = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json(mockResumes);
    }
    const resumes = await Resume.find({});
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Public
export const getResumeById = async (req, res) => {
  try {
    if (!isConnected()) {
      const resume = mockResumes.find(r => r._id === req.params.id);
      if (resume) return res.status(200).json(resume);
      return res.status(404).json({ message: 'Resume not found (mock)' });
    }
    const resume = await Resume.findById(req.params.id);
    if (resume) {
      res.status(200).json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Public
export const createResume = async (req, res) => {
  try {
    const { fullName, email, phone, summary, skills, education, experience } = req.body;
    
    if (!isConnected()) {
      const newResume = {
        _id: `mock-res-${Date.now()}`,
        fullName,
        email,
        phone,
        summary,
        skills,
        education,
        experience,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockResumes.unshift(newResume);
      return res.status(201).json(newResume);
    }

    const resume = new Resume({
      fullName,
      email,
      phone,
      summary,
      skills,
      education,
      experience,
    });
    const createdResume = await resume.save();
    res.status(201).json(createdResume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Public
export const updateResume = async (req, res) => {
  try {
    const { fullName, email, phone, summary, skills, education, experience } = req.body;
    
    if (!isConnected()) {
      const idx = mockResumes.findIndex(r => r._id === req.params.id);
      if (idx !== -1) {
        mockResumes[idx] = {
          ...mockResumes[idx],
          fullName: fullName || mockResumes[idx].fullName,
          email: email || mockResumes[idx].email,
          phone: phone || mockResumes[idx].phone,
          summary: summary || mockResumes[idx].summary,
          skills: skills || mockResumes[idx].skills,
          education: education || mockResumes[idx].education,
          experience: experience || mockResumes[idx].experience,
          updatedAt: new Date()
        };
        return res.status(200).json(mockResumes[idx]);
      }
      return res.status(404).json({ message: 'Resume not found (mock)' });
    }

    const resume = await Resume.findById(req.params.id);
    if (resume) {
      resume.fullName = fullName || resume.fullName;
      resume.email = email || resume.email;
      resume.phone = phone || resume.phone;
      resume.summary = summary || resume.summary;
      resume.skills = skills || resume.skills;
      resume.education = education || resume.education;
      resume.experience = experience || resume.experience;

      const updatedResume = await resume.save();
      res.status(200).json(updatedResume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Public
export const deleteResume = async (req, res) => {
  try {
    if (!isConnected()) {
      mockResumes = mockResumes.filter(r => r._id !== req.params.id);
      return res.status(200).json({ message: 'Resume removed successfully (mock)' });
    }
    const resume = await Resume.findById(req.params.id);
    if (resume) {
      await Resume.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Resume removed successfully' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
