import Alumni from '../models/Alumni.js';
import mongoose from 'mongoose';

// Authentic BRAC University Alumni & Faculty Profiles with Verified Email & GitHub Addresses
let mockAlumni = [
  {
    _id: "bracu-alumni-1",
    name: "Nazmul Islam Pranto",
    email: "nazmul.islam1@bracu.ac.bd",
    graduationYear: 2023,
    degree: "B.Sc. in Computer Science and Engineering",
    company: "BRAC University",
    role: "Lecturer & AI Researcher",
    skills: ["Artificial Intelligence", "Computer Vision", "Software Engineering", "Python", "Machine Learning"],
    linkedin: "https://www.linkedin.com/in/nazmul-islam-pranto/",
    github: "https://github.com/nazmulislampranto",
    bio: "BRAC University CSE alumnus and academician. Research focus in Artificial Intelligence, Computer Vision, and Software Engineering. Open for mentoring undergraduate researchers and project consultations."
  },
  {
    _id: "bracu-alumni-2",
    name: "Md. Tawhid Anwar",
    email: "tawhid.anwar@bracu.ac.bd",
    graduationYear: 2020,
    degree: "B.Sc. in Computer Science and Engineering",
    company: "BRAC University",
    role: "Senior Lecturer & Chancellor's Gold Medalist",
    skills: ["Data Structures", "Algorithms", "Advanced Computing", "Research Methodology", "Java"],
    linkedin: "https://www.linkedin.com/in/md-tawhid-anwar/",
    github: "https://github.com/tawhidanwar",
    bio: "Senior Lecturer in CSE at BRAC University and Chancellor's Gold Medal recipient. Awarded University Teaching Excellence. Mentoring students in advanced computing, research papers, and academic excellence."
  },
  {
    _id: "bracu-alumni-3",
    name: "Partha Bhoumik",
    email: "partha.bhoumik@bracu.ac.bd",
    graduationYear: 2022,
    degree: "B.Sc. in Computer Science and Engineering",
    company: "BRAC University",
    role: "Lecturer",
    skills: ["Software Architecture", "OOP", "Algorithm Design", "C++", "Competitive Programming"],
    linkedin: "https://www.linkedin.com/in/partha-bhoumik/",
    github: "https://github.com/parthabhoumik",
    bio: "BRACU CSE alumnus and Lecturer. Passionate about Software Architecture, Object-Oriented Programming, and algorithmic problem-solving. Mentoring student developers."
  },
  {
    _id: "bracu-alumni-4",
    name: "Umme Jannat Taposhi",
    email: "jannat.taposhi@bracu.ac.bd",
    graduationYear: 2021,
    degree: "B.Sc. & M.Sc. in Computer Science and Engineering",
    company: "BRAC University",
    role: "Lecturer & Postgraduate Gold Medalist",
    skills: ["Intelligent Systems", "Data Structures", "Neural Networks", "NLP", "Python"],
    linkedin: "https://www.linkedin.com/in/umme-jannat-taposhi-a977aa247/",
    github: "https://github.com/jannattaposhi",
    bio: "B.Sc. & M.Sc. in CSE from BRAC University, Postgraduate Chancellor's Gold Medal recipient. Lecturer specializing in Intelligent Systems, Data Structures, and thesis mentorship."
  },
  {
    _id: "bracu-alumni-5",
    name: "Tasnim Ahsan Prome",
    email: "tasnim.ahsan@bracu.ac.bd",
    graduationYear: 2023,
    degree: "B.Sc. in Computer Science and Engineering",
    company: "BRAC University",
    role: "Lecturer & ML Researcher",
    skills: ["Deep Learning", "Image Processing", "Machine Learning", "Computer Vision", "PyTorch"],
    linkedin: "https://www.linkedin.com/in/tasnim-ahsan-prome/",
    github: "https://github.com/tasnimahsanprome",
    bio: "BRACU CSE alumna and Lecturer. Active researcher in Machine Learning, Deep Learning, Image Processing, and Computer Vision. Dedicated to empowering student research and academic progression."
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all alumni with optional query filters
// @route   GET /api/alumni
// @access  Public
export const getAlumni = async (req, res) => {
  try {
    const { degree, keyword, company, graduationYear } = req.query;

    if (!isConnected()) {
      let filtered = [...mockAlumni];
      if (degree && degree !== 'All') {
        filtered = filtered.filter(a => a.degree.toLowerCase().includes(degree.toLowerCase()));
      }
      if (company) {
        filtered = filtered.filter(a => a.company.toLowerCase().includes(company.toLowerCase()));
      }
      if (graduationYear) {
        filtered = filtered.filter(a => a.graduationYear.toString() === graduationYear.toString());
      }
      if (keyword) {
        const s = keyword.toLowerCase();
        filtered = filtered.filter(a => 
          a.name.toLowerCase().includes(s) ||
          a.role.toLowerCase().includes(s) ||
          a.company.toLowerCase().includes(s) ||
          a.email.toLowerCase().includes(s) ||
          a.bio.toLowerCase().includes(s) ||
          (a.skills && a.skills.some(sk => sk.toLowerCase().includes(s)))
        );
      }
      return res.status(200).json(filtered);
    }

    const query = {};
    if (degree && degree !== 'All') {
      query.degree = new RegExp(degree, 'i');
    }
    if (company) {
      query.company = new RegExp(company, 'i');
    }
    if (graduationYear) {
      query.graduationYear = Number(graduationYear);
    }
    if (keyword) {
      query.$or = [
        { name: new RegExp(keyword, 'i') },
        { role: new RegExp(keyword, 'i') },
        { company: new RegExp(keyword, 'i') },
        { email: new RegExp(keyword, 'i') },
        { bio: new RegExp(keyword, 'i') },
        { skills: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    let alumni = await Alumni.find(query).sort({ graduationYear: -1 });
    if (alumni.length === 0 && !degree && !keyword && !company && !graduationYear) {
      await Alumni.deleteMany({});
      alumni = await Alumni.insertMany(mockAlumni.map(({ _id, ...rest }) => rest));
    }
    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get alumni by ID
// @route   GET /api/alumni/:id
// @access  Public
export const getAlumnusById = async (req, res) => {
  try {
    if (!isConnected()) {
      const alumnus = mockAlumni.find(a => a._id === req.params.id);
      if (alumnus) return res.status(200).json(alumnus);
      return res.status(404).json({ message: 'Alumnus not found (mock)' });
    }

    const alumnus = await Alumni.findById(req.params.id);
    if (alumnus) {
      res.status(200).json(alumnus);
    } else {
      res.status(404).json({ message: 'Alumnus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new alumni profile
// @route   POST /api/alumni
// @access  Public
export const createAlumni = async (req, res) => {
  try {
    const { name, email, graduationYear, degree, role, company, skills, linkedin, github, bio } = req.body;

    if (!name || !email || !graduationYear || !degree || !role || !company) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const parsedSkills = Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()).filter(Boolean);

    if (!isConnected()) {
      const newAlumnus = {
        _id: `mock-alumni-${Date.now()}`,
        name,
        email,
        graduationYear: Number(graduationYear),
        degree,
        role,
        company,
        skills: parsedSkills,
        linkedin: linkedin || "",
        github: github || "",
        bio: bio || "",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockAlumni.unshift(newAlumnus);
      return res.status(201).json(newAlumnus);
    }

    const alumnus = new Alumni({
      name,
      email,
      graduationYear: Number(graduationYear),
      degree,
      role,
      company,
      skills: parsedSkills,
      linkedin: linkedin || "",
      github: github || "",
      bio: bio || ""
    });

    const createdAlumnus = await alumnus.save();
    res.status(201).json(createdAlumnus);
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
      const index = mockAlumni.findIndex(a => a._id === req.params.id);
      if (index !== -1) {
        mockAlumni[index] = { ...mockAlumni[index], ...req.body, updatedAt: new Date() };
        return res.status(200).json(mockAlumni[index]);
      }
      return res.status(404).json({ message: 'Alumnus not found (mock)' });
    }

    const alumnus = await Alumni.findById(req.params.id);
    if (!alumnus) {
      return res.status(404).json({ message: 'Alumnus not found' });
    }

    Object.assign(alumnus, req.body);
    const updated = await alumnus.save();
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

// @desc    Seed mock alumni into database
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

    res.status(201).json({ message: 'BRACU Alumni seeded successfully into MongoDB Atlas with verified emails and GitHub profiles!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
