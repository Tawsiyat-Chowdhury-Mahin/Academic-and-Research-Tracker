import Resume from '../models/Resume.js';
import mongoose from 'mongoose';

// Demo database for Resume Builder (in-memory fallback)
let mockResumes = [
  {
    _id: "mock-res-1",
    fullName: "Tawsiyat Chowdhury Mahin",
    email: "mahin.chowdhury@student.bracu.ac.bd",
    phone: "+880 1712-345678",
    linkedin: "https://linkedin.com/in/tawsiyat-mahin",
    github: "https://github.com/Tawsiyat-Chowdhury-Mahin",
    location: "Dhaka, Bangladesh",
    summary: "Passionate Full Stack Developer with 2+ years of experience in React, Node.js, Express, and MongoDB.",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "REST APIs", "Tailwind CSS", "Docker"],
    education: [
      {
        institution: "BRAC University",
        degree: "B.Sc. in Computer Science and Engineering",
        startDate: "2022",
        endDate: "2026"
      }
    ],
    experience: [
      {
        company: "Academic and Research Tracker",
        position: "Lead Full Stack Developer",
        startDate: "2025",
        endDate: "Present",
        description: "Architected a full-stack MERN portal supporting 10+ academic and career modules with JWT authentication and ATS CV analysis."
      }
    ]
  },
  {
    _id: "mock-res-2",
    fullName: "Alice Rahman",
    email: "alice.rahman@alumni.bracu.ac.bd",
    phone: "+880 1812-987654",
    linkedin: "https://linkedin.com/in/alice-rahman",
    github: "https://github.com/alice-rahman",
    location: "Dhaka, Bangladesh",
    summary: "Dedicated Data Scientist skilled in Python, PyTorch, SQL, and NLP data analysis.",
    skills: ["Python", "SQL", "PyTorch", "Pandas", "Machine Learning", "FastAPI"],
    education: [
      {
        institution: "BRAC University",
        degree: "B.Sc. in Computer Science",
        startDate: "2021",
        endDate: "2025"
      }
    ],
    experience: [
      {
        company: "AI Research Lab",
        position: "Undergraduate Research Assistant",
        startDate: "Jan 2024",
        endDate: "Dec 2024",
        description: "Conducted experiments on Low-Resource Bengali NLP and Transformer fine-tuning."
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
    let resumes = await Resume.find({});
    if (resumes.length === 0) {
      await Resume.insertMany(mockResumes.map(({ _id, ...rest }) => rest));
      resumes = await Resume.find({});
    }
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
    const { fullName, email, phone, linkedin, github, location, summary, skills, education, experience } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: 'Please provide required personal information' });
    }

    if (!isConnected()) {
      const newResume = {
        _id: `mock-res-${Date.now()}`,
        fullName,
        email,
        phone,
        linkedin: linkedin || '',
        github: github || '',
        location: location || '',
        summary: summary || '',
        skills: Array.isArray(skills) ? skills : [],
        education: Array.isArray(education) ? education : [],
        experience: Array.isArray(experience) ? experience : [],
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
      linkedin: linkedin || '',
      github: github || '',
      location: location || '',
      summary: summary || '',
      skills: Array.isArray(skills) ? skills : [],
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : []
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
    if (!isConnected()) {
      const index = mockResumes.findIndex(r => r._id === req.params.id);
      if (index !== -1) {
        mockResumes[index] = { ...mockResumes[index], ...req.body, updatedAt: new Date() };
        return res.status(200).json(mockResumes[index]);
      }
      return res.status(404).json({ message: 'Resume not found (mock)' });
    }

    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    Object.assign(resume, req.body);
    const updated = await resume.save();
    res.status(200).json(updated);
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
      return res.status(200).json({ message: 'Resume removed' });
    }
    await Resume.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Resume removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed mock resumes into database
// @route   POST /api/resumes/seed
// @access  Public
export const seedResumes = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ message: 'Using in-memory mock resume data.' });
    }
    await Resume.deleteMany({});
    const docs = mockResumes.map(({ _id, ...rest }) => rest);
    await Resume.insertMany(docs);
    res.status(201).json({ message: 'Resumes seeded successfully into MongoDB Atlas!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
