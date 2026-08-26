import Job from '../models/Job.js';
import mongoose from 'mongoose';

// Authentic BRAC University & Bangladesh Tech Opportunities
let mockJobs = [
  {
    _id: "job-tut-1",
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
    _id: "job-ra-1",
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
  },
  {
    _id: "job-bs23-1",
    title: "Junior Software Engineer (MERN & Cloud)",
    company: "Brain Station 23",
    location: "Mohakhali, Dhaka",
    type: "Full-time",
    description: "Design and implement scalable RESTful APIs, React user interfaces, and cloud-native microservices for international FinTech and enterprise clients.",
    requirements: [
      "B.Sc. in CSE from an accredited university (BRACU, BUET, DU, etc.)",
      "Hands-on project experience with React, Node.js, Express, and MongoDB/PostgreSQL",
      "Solid knowledge of OOP, Data Structures, and Git version control"
    ],
    link: "https://brainstation-23.com/career"
  },
  {
    _id: "job-therap-1",
    title: "Associate Software Engineer (Core Java / Systems)",
    company: "Therap (BD) Ltd.",
    location: "Banani, Dhaka",
    type: "Full-time",
    description: "Join Therap's international healthcare software suite engineering team. Work with enterprise-grade Java backends, multi-threaded high-throughput services, and Oracle/PostgreSQL databases.",
    requirements: [
      "Strong foundational problem-solving and algorithmic skills (LeetCode / Codeforces experience)",
      "In-depth mastery of Core Java, OOP design patterns, and Relational Databases",
      "B.Sc. in Computer Science & Engineering"
    ],
    link: "https://therapbd.com/careers/"
  },
  {
    _id: "job-bjit-1",
    title: "DevOps & Cloud Engineering Intern",
    company: "BJIT Ltd.",
    location: "Baridhara / Gulshan, Dhaka",
    type: "Internship",
    description: "Work alongside senior DevOps architects setting up automated CI/CD pipelines, Docker container orchestration, Kubernetes clusters, and AWS cloud infrastructure monitoring (Prometheus & Grafana).",
    requirements: [
      "Familiarity with Linux / Bash scripting and Docker basics",
      "Basic understanding of CI/CD concepts (GitHub Actions / Jenkins)",
      "Enrolled in final year B.Sc. in CSE"
    ],
    link: "https://bjitgroup.com/careers"
  },
  {
    _id: "job-srbd-1",
    title: "Research Engineer - On-Device AI / C++",
    company: "Samsung R&D Institute Bangladesh (SRBD)",
    location: "Panthapath, Dhaka",
    type: "Full-time",
    description: "Develop cutting-edge on-device neural network processing algorithms and embedded computer vision pipelines for Galaxy ecosystem devices.",
    requirements: [
      "Expertise in modern C++ (C++14/17) and Python",
      "Deep understanding of Neural Network architectures and GPU computing",
      "Strong analytical problem-solving acumen"
    ],
    link: "https://research.samsung.com/srbd"
  },
  {
    _id: "job-cefalo-1",
    title: "Frontend Engineering Intern (React & TypeScript)",
    company: "Cefalo Bangladesh Ltd.",
    location: "Dhanmondi, Dhaka",
    type: "Internship",
    description: "Collaborate with Scandinavian development teams building clean, accessible, high-performance web applications using modern React, TypeScript, and Tailwind CSS.",
    requirements: [
      "Proficiency in modern JavaScript (ES6+), React hooks, and CSS flex/grid",
      "Eagerness to write unit tests and practice Agile/Scrum methodologies",
      "Portfolio of deployed web projects or GitHub repositories"
    ],
    link: "https://cefalo.com/careers"
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

    res.status(201).json({ message: 'BRACU Opportunities seeded successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
