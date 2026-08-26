import Alumni from '../models/Alumni.js';
import mongoose from 'mongoose';

// Authentic BRAC University & Preconnect Alumni / Faculty dataset
let mockAlumni = [
  {
    _id: "alum-nip",
    name: "Nazmul Islam Pranto",
    graduationYear: 2022,
    degree: "B.Sc. in Computer Science and Engineering",
    company: "BRAC University (ex-BJIT Ltd)",
    role: "Lecturer & Cloud/DevOps Specialist",
    skills: ["DevOps", "AWS", "Kubernetes", "Docker", "CI/CD", "Terraform", "Ansible", "Python", "Java", "Django", "MERN Stack"],
    email: "nazmul.islam@bracu.ac.bd",
    linkedin: "https://www.linkedin.com/in/nazmul-islam-pranto/",
    bio: "Lecturer in CSE at BRAC University (ex-DevOps & Cloud Engineer at BJIT Ltd). Seeking Masters/PhD opportunities. Experienced in AWS, Azure, CI/CD pipelines (Jenkins, GitLab), Kubernetes, Docker, Terraform, Prometheus/Grafana, Django, Java Spring Boot, and MERN stack systems."
  },
  {
    _id: "alum-mta",
    name: "Md. Tawhid Anwar",
    graduationYear: 2017,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "BRAC University",
    role: "Senior Lecturer & Course Coordinator",
    skills: ["Python", "Java", "Machine Learning", "Explainable AI", "Data Science", "OOP", "Curriculum Design", "Mentoring"],
    email: "tawhid.anwar@bracu.ac.bd",
    linkedin: "https://www.linkedin.com/in/md-tawhid-anwar/",
    bio: "Senior Lecturer in CSE at BRAC University with 7+ years of teaching experience. Chancellor’s Gold Medalist & Valedictorian. Published Q1 ML/XAI researcher (6 publications), Course Coordinator (CSE110 & CSE111), and Creator of 'Learn with Tawhid' programming tutorials."
  },
  {
    _id: "alum-jmr",
    name: "Jumana Rahman",
    graduationYear: 2019,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "BRAC University Department of CSE",
    role: "Lecturer & Former Student Tutor",
    skills: ["Java", "Data Structures", "Algorithms", "Curriculum Development", "Academic Advising"],
    email: "jumana.rahman@bracu.ac.bd",
    linkedin: "https://linkedin.com/in/jumana-rahman-bracu",
    bio: "BRACU CSE Alumna & Lecturer. Former Student Tutor for introductory programming. Passionate about CS education, algorithmic thinking, and advising undergraduate researchers."
  },
  {
    _id: "alum-msr",
    name: "Md. Shahriar Rahman",
    graduationYear: 2021,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "BRAC University (ex-Accelx Inc)",
    role: "Lecturer & AI Software Engineer",
    skills: ["Python", "FastAPI", "TensorFlow", "Computer Vision", "Together Initiatives", "System Design"],
    email: "shahriar.rahman@bracu.ac.bd",
    linkedin: "https://linkedin.com/in/shahriar-rahman-ai",
    bio: "Lecturer in CSE at BRAC University. Previously worked as AI Software Engineer at Accelx Inc and Junior Software Engineer at Together Initiatives Ltd. Researches practical applied machine learning."
  },
  {
    _id: "alum-an",
    name: "Arian Nuhan",
    graduationYear: 2022,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "Brain Station 23",
    role: "Senior Software Engineer (FinTech Unit)",
    skills: ["React", "Node.js", "PostgreSQL", "Docker", "Microservices", "REST APIs"],
    email: "arian.nuhan@alumni.bracu.ac.bd",
    linkedin: "https://linkedin.com/in/arian-nuhan",
    bio: "BRACU Alumnus working at Brain Station 23 on enterprise banking and fintech solutions. Happy to assist junior students with portfolio reviews and coding interview prep."
  },
  {
    _id: "alum-taz",
    name: "Tanjeem Azwad Zaman",
    graduationYear: 2023,
    degree: "B.Sc. in Computer Science & Engineering",
    company: "Samsung R&D Institute Bangladesh (SRBD)",
    role: "Associate Machine Learning Engineer",
    skills: ["C++", "Python", "PyTorch", "On-Device AI", "CUDA", "Embedded Systems"],
    email: "tanjeem.azwad@alumni.bracu.ac.bd",
    linkedin: "https://linkedin.com/in/tanjeem-azwad",
    bio: "BRAC University CSE graduate currently doing on-device AI and computer vision research at Samsung R&D Institute Bangladesh. Open for research collaborations and mock interviews."
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all alumni with filtering
// @route   GET /api/alumni
// @access  Public
export const getAlumni = async (req, res) => {
  try {
    const { keyword, company, graduationYear, degree } = req.query;

    if (!isConnected()) {
      let filtered = [...mockAlumni];
      if (keyword) {
        const kw = keyword.toLowerCase();
        filtered = filtered.filter(a => 
          a.name.toLowerCase().includes(kw) ||
          a.role.toLowerCase().includes(kw) ||
          a.skills.some(s => s.toLowerCase().includes(kw))
        );
      }
      if (company) {
        filtered = filtered.filter(a => a.company.toLowerCase().includes(company.toLowerCase()));
      }
      if (graduationYear) {
        filtered = filtered.filter(a => a.graduationYear === Number(graduationYear));
      }
      if (degree && degree !== 'All') {
        filtered = filtered.filter(a => a.degree.toLowerCase().includes(degree.toLowerCase()));
      }
      return res.status(200).json(filtered);
    }

    const query = {};
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { role: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }
    if (graduationYear) {
      query.graduationYear = Number(graduationYear);
    }
    if (degree && degree !== 'All') {
      query.degree = { $regex: degree, $options: 'i' };
    }

    let alumniList = await Alumni.find(query).sort({ graduationYear: -1 });
    if (alumniList.length === 0 && !keyword && !company && !graduationYear && (!degree || degree === 'All')) {
      await Alumni.deleteMany({});
      alumniList = await Alumni.insertMany(mockAlumni.map(({ _id, ...rest }) => rest));
    }
    res.status(200).json(alumniList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get alumni profile by ID
// @route   GET /api/alumni/:id
// @access  Public
export const getAlumnusById = async (req, res) => {
  try {
    if (!isConnected()) {
      const alum = mockAlumni.find(a => a._id === req.params.id);
      if (alum) return res.status(200).json(alum);
      return res.status(404).json({ message: 'Alumni not found (mock)' });
    }

    const alum = await Alumni.findById(req.params.id);
    if (alum) {
      res.status(200).json(alum);
    } else {
      res.status(404).json({ message: 'Alumni not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register new alumni profile
// @route   POST /api/alumni
// @access  Public
export const createAlumni = async (req, res) => {
  try {
    const { name, graduationYear, degree, company, role, skills, email, linkedin, bio } = req.body;

    if (!name || !graduationYear || !degree || !company || !role || !email) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!isConnected()) {
      const newAlum = {
        _id: `mock-alum-${Date.now()}`,
        name,
        graduationYear: Number(graduationYear),
        degree,
        company,
        role,
        skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()),
        email,
        linkedin: linkedin || '',
        bio: bio || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockAlumni.unshift(newAlum);
      return res.status(201).json(newAlum);
    }

    const alumni = new Alumni({
      name,
      graduationYear,
      degree,
      company,
      role,
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()),
      email,
      linkedin,
      bio
    });

    const createdAlumni = await alumni.save();
    res.status(201).json(createdAlumni);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update alumni profile
// @route   PUT /api/alumni/:id
// @access  Public
export const updateAlumni = async (req, res) => {
  try {
    if (!isConnected()) {
      const idx = mockAlumni.findIndex(a => a._id === req.params.id);
      if (idx !== -1) {
        mockAlumni[idx] = { ...mockAlumni[idx], ...req.body, updatedAt: new Date() };
        return res.status(200).json(mockAlumni[idx]);
      }
      return res.status(404).json({ message: 'Alumni not found' });
    }
    const updated = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete alumni profile
// @route   DELETE /api/alumni/:id
// @access  Public
export const deleteAlumni = async (req, res) => {
  try {
    if (!isConnected()) {
      mockAlumni = mockAlumni.filter(a => a._id !== req.params.id);
      return res.status(200).json({ message: 'Alumni removed' });
    }
    await Alumni.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Alumni removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed alumni collection with BRACU faculty/alumni
// @route   POST /api/alumni/seed
// @access  Public
export const seedAlumni = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({ message: 'Using in-memory mock alumni data.' });
    }

    await Alumni.deleteMany({});
    const docs = mockAlumni.map(({ _id, ...rest }) => rest);
    await Alumni.insertMany(docs);

    res.status(201).json({ message: 'BRACU Alumni & Faculty seeded successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
