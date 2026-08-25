import Job from '../models/Job.js';
import mongoose from 'mongoose';

// Demo database for Job Finder (in-memory fallback)
let mockJobs = [
  {
    _id: "mock-job-1",
    title: "Software Engineer Intern",
    company: "Google",
    location: "Remote / Mountain View",
    type: "Internship",
    description: "Join Google as a Software Engineer Intern and work on projects that matter. You will collaborate with engineering teams on core infrastructure or user-facing features.",
    requirements: ["Currently pursuing a BS, MS, or PhD in Computer Science or related technical field", "Experience with Java, C++, Python, or Go", "Good understanding of data structures and algorithms"],
    link: "https://google.com/careers",
    createdAt: new Date()
  },
  {
    _id: "mock-job-2",
    title: "Frontend Developer",
    company: "Meta",
    location: "New York, NY",
    type: "Full-time",
    description: "Meta is seeking a Frontend Developer proficient in React.js and modern JavaScript. You will build user experiences for millions of active users.",
    requirements: ["3+ years of professional web development experience", "Strong knowledge of React.js, HTML5, CSS3, and JavaScript/TypeScript", "Excellent communication skills"],
    link: "https://meta.com/careers",
    createdAt: new Date()
  },
  {
    _id: "mock-job-3",
    title: "Backend Development Intern",
    company: "Amazon",
    location: "Seattle, WA",
    type: "Internship",
    description: "Help build the future of Amazon Web Services (AWS) or retail backend systems. Work on highly scalable API endpoints.",
    requirements: ["Proficiency in Java or C#", "Familiarity with SQL and NoSQL databases", "Enrollment in a computer engineering curriculum"],
    link: "https://amazon.jobs",
    createdAt: new Date()
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all jobs (with query filters)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { keyword, location, type } = req.query;

    if (!isConnected()) {
      let filtered = [...mockJobs];
      if (keyword) {
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(keyword.toLowerCase()) || 
          j.company.toLowerCase().includes(keyword.toLowerCase()) ||
          j.description.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      if (location) {
        filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
      }
      if (type && type !== 'All') {
        filtered = filtered.filter(j => j.type === type);
      }
      return res.status(200).json(filtered);
    }
    
    let query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type && type !== 'All') {
      query.type = type;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    if (!isConnected()) {
      const job = mockJobs.find(j => j._id === req.params.id);
      if (job) return res.status(200).json(job);
      return res.status(404).json({ message: 'Job not found (mock)' });
    }
    const job = await Job.findById(req.params.id);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Public
export const createJob = async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, link } = req.body;
    
    if (!isConnected()) {
      const newJob = {
        _id: `mock-job-${Date.now()}`,
        title,
        company,
        location,
        type,
        description,
        requirements,
        link,
        createdAt: new Date()
      };
      mockJobs.unshift(newJob);
      return res.status(201).json(newJob);
    }

    const job = new Job({
      title,
      company,
      location,
      type,
      description,
      requirements,
      link,
    });
    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Public
export const deleteJob = async (req, res) => {
  try {
    if (!isConnected()) {
      mockJobs = mockJobs.filter(j => j._id !== req.params.id);
      return res.status(200).json({ message: 'Job removed (mock)' });
    }
    const job = await Job.findById(req.params.id);
    if (job) {
      await Job.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed mock jobs
// @route   POST /api/jobs/seed
// @access  Public
export const seedJobs = async (req, res) => {
  try {
    const seedArray = [
      {
        title: "Software Engineer Intern",
        company: "Google",
        location: "Remote / Mountain View",
        type: "Internship",
        description: "Join Google as a Software Engineer Intern and work on projects that matter. You will collaborate with engineering teams on core infrastructure or user-facing features.",
        requirements: ["Currently pursuing a BS, MS, or PhD in Computer Science or related technical field", "Experience with Java, C++, Python, or Go", "Good understanding of data structures and algorithms"],
        link: "https://google.com/careers"
      },
      {
        title: "Frontend Developer",
        company: "Meta",
        location: "New York, NY",
        type: "Full-time",
        description: "Meta is seeking a Frontend Developer proficient in React.js and modern JavaScript. You will build user experiences for millions of active users.",
        requirements: ["3+ years of professional web development experience", "Strong knowledge of React.js, HTML5, CSS3, and JavaScript/TypeScript", "Excellent communication skills"],
        link: "https://meta.com/careers"
      },
      {
        title: "Backend Development Intern",
        company: "Amazon",
        location: "Seattle, WA",
        type: "Internship",
        description: "Help build the future of Amazon Web Services (AWS) or retail backend systems. Work on highly scalable API endpoints.",
        requirements: ["Proficiency in Java or C#", "Familiarity with SQL and NoSQL databases", "Enrollment in a computer engineering curriculum"],
        link: "https://amazon.jobs"
      }
    ];

    if (!isConnected()) {
      mockJobs = seedArray.map((j, idx) => ({ ...j, _id: `mock-job-seed-${idx}`, createdAt: new Date() }));
      return res.status(201).json({ message: "Mock jobs seeded successfully! (mock)" });
    }

    await Job.deleteMany({});
    await Job.insertMany(seedArray);
    res.status(201).json({ message: "Mock jobs seeded successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
