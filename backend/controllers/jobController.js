import Job from '../models/Job.js';
import mongoose from 'mongoose';

// Authentic Live Job Postings from Bdjobs & University Academic Portals
let mockJobs = [
  {
    _id: "bdjob-1",
    title: "Frontend Developer - React / Next.js",
    company: "Betopia Group (via Bdjobs)",
    location: "Mohakhali, Dhaka",
    type: "Full-time",
    description: "Design and implement modern, high-performance web applications using React 19, Next.js, and Tailwind CSS. Collaborate with backend teams to integrate REST APIs and state management.",
    requirements: [
      "B.Sc. in CSE / IT from a recognized university",
      "Proficiency in JavaScript (ES6+), React.js, Next.js, Redux / Zustand",
      "Experience with responsive UI/UX and RESTful API integrations",
      "Familiarity with Git version control and Figma design specs"
    ],
    link: "https://bdjobs.com/h/"
  },
  {
    _id: "bdjob-2",
    title: "Junior Software Engineer - Full Stack (MERN)",
    company: "Dakpeon24 IT (via Bdjobs)",
    location: "Dhanmondi, Dhaka",
    type: "Full-time",
    description: "Develop scalable full-stack web solutions using MongoDB, Express.js, React, and Node.js. Build authentication systems and maintain production databases.",
    requirements: [
      "Hands-on experience building MERN stack projects",
      "Understanding of NoSQL databases (MongoDB / Mongoose schemas)",
      "Knowledge of JWT token authentication and role-based access control",
      "Good problem-solving acumen and team communication"
    ],
    link: "https://bdjobs.com/h/"
  },
  {
    _id: "bdjob-3",
    title: "Full Stack Software Engineer - React & Python",
    company: "NZTech (via Bdjobs)",
    location: "Gulshan, Dhaka / Hybrid",
    type: "Full-time",
    description: "Work on enterprise analytics platforms building React frontends and Python (FastAPI / Django) backends. Integrate data pipelines and machine learning inference endpoints.",
    requirements: [
      "Strong coding foundation in Python and JavaScript",
      "Experience with FastAPI or Django REST Framework",
      "Proficiency with React hooks and modern frontend tooling",
      "Basic understanding of Docker and cloud environments"
    ],
    link: "https://bdjobs.com/h/"
  },
  {
    _id: "bdjob-4",
    title: "Associate Software Engineer / Trainee",
    company: "Data Edge Limited (via Bdjobs)",
    location: "Banani, Dhaka",
    type: "Internship",
    description: "Fresh graduates welcome. Receive structured mentorship in enterprise software engineering, relational database optimization (PostgreSQL / Oracle), and clean architecture.",
    requirements: [
      "Fresh B.Sc. in Computer Science & Engineering",
      "Solid understanding of Object-Oriented Programming (OOP) in Java or C#",
      "Good understanding of Data Structures and SQL queries",
      "Willingness to learn enterprise backend technologies"
    ],
    link: "https://bdjobs.com/h/"
  },
  {
    _id: "bdjob-5",
    title: "Frontend Developer - React & TypeScript",
    company: "Walton Plaza IT Division (via Bdjobs)",
    location: "Dhaka",
    type: "Full-time",
    description: "Build e-commerce customer portals and inventory management dashboards using React, TypeScript, and micro-frontend architecture.",
    requirements: [
      "1+ years of experience with React and TypeScript",
      "Experience with state management libraries (Redux Toolkit / Context API)",
      "Strong command of CSS, Flexbox, Grid, and Tailwind CSS"
    ],
    link: "https://bdjobs.com/h/"
  },
  {
    _id: "bdjob-tut",
    title: "Undergraduate Student Tutor (CSE110 & CSE111)",
    company: "BRAC University Department of CSE",
    location: "Dhaka (Kha-224 Merul Badda, BRACU Campus)",
    type: "Part-time",
    description: "Assist course instructors in conducting lab sessions, solving student programming queries in Java/Python, grading introductory problem sets, and hosting weekly consultation hours.",
    requirements: [
      "Minimum CGPA of 3.70 with 'A' grade in CSE110, CSE111, and CSE220",
      "Excellent communication and peer-tutoring empathy",
      "Completed at least 36 credits in B.Sc. in CSE / CS"
    ],
    link: "https://connect.bracu.ac.bd/"
  },
  {
    _id: "bdjob-ra",
    title: "Graduate Research Assistant (AI & NLP Lab)",
    company: "BRACU Center for Cognitive Computing",
    location: "Dhaka / Hybrid (BRAC University New Campus)",
    type: "Contract",
    description: "Participate in funded research on Low-Resource Bengali NLP, Explainable AI, and Healthcare Data Analytics under departmental faculty supervision. Assist in paper drafting for IEEE/ACM conferences.",
    requirements: [
      "Proficiency with Python, PyTorch / HuggingFace, and Pandas",
      "Strong background in Linear Algebra and Probability",
      "Prior coursework in Machine Learning (CSE422) or Artificial Intelligence"
    ],
    link: "https://www.bracu.ac.bd/research"
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all jobs with filtering
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { keyword, location, type } = req.query;

    if (!isConnected()) {
      let filtered = [...mockJobs];
      if (keyword) {
        const kw = keyword.toLowerCase();
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw) ||
          j.requirements.some(r => r.toLowerCase().includes(kw))
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

    const query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { requirements: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type && type !== 'All') {
      query.type = type;
    }

    let jobs = await Job.find(query).sort({ createdAt: -1 });
    if (jobs.length === 0 && !keyword && !location && (!type || type === 'All')) {
      await Job.deleteMany({});
      jobs = await Job.insertMany(mockJobs.map(({ _id, ...rest }) => rest));
    }
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
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

// @desc    Post a new job
// @route   POST /api/jobs
// @access  Public
export const createJob = async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, link } = req.body;

    if (!title || !company || !location || !type || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!isConnected()) {
      const newJob = {
        _id: `mock-job-${Date.now()}`,
        title,
        company,
        location,
        type,
        description,
        requirements: Array.isArray(requirements) ? requirements : (requirements || '').split('\n').filter(r => r.trim().length > 0),
        link: link || '',
        createdAt: new Date(),
        updatedAt: new Date()
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
      requirements: Array.isArray(requirements) ? requirements : (requirements || '').split('\n').filter(r => r.trim().length > 0),
      link
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
      return res.status(200).json({ message: 'Job removed' });
    }
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed mock jobs into database
// @route   POST /api/jobs/seed
// @access  Public
export const seedJobs = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ message: 'Using in-memory mock job data.' });
    }

    await Job.deleteMany({});
    const docs = mockJobs.map(({ _id, ...rest }) => rest);
    await Job.insertMany(docs);

    res.status(201).json({ message: 'Bdjobs & University Opportunities seeded successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
