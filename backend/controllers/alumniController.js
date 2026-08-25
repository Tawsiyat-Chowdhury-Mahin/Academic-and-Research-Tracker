import Alumni from '../models/Alumni.js';
import mongoose from 'mongoose';

// Demo database for Alumni Directory (in-memory fallback)
let mockAlumni = [
  {
    _id: "mock-alum-pranto",
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
    _id: "mock-alum-tawhid",
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
    _id: "mock-alum-1",
    name: "Jane Doe",
    graduationYear: 2024,
    degree: "B.Sc. in Computer Science",
    company: "Microsoft",
    role: "Software Engineer",
    skills: ["React", "C#", "Azure", "SQL"],
    email: "jane.doe@microsoft.com",
    linkedin: "https://linkedin.com/in/janedoe",
    bio: "Graduated with honors in CS. Passionate about cloud architectures and frontend technologies. Feel free to reach out for mentorship!"
  },
  {
    _id: "mock-alum-2",
    name: "John Smith",
    graduationYear: 2022,
    degree: "M.Sc. in Data Science",
    company: "NVIDIA",
    role: "Machine Learning Researcher",
    skills: ["Python", "PyTorch", "CUDA", "C++"],
    email: "jsmith@nvidia.com",
    linkedin: "https://linkedin.com/in/johnsmith",
    bio: "Specializing in deep learning and GPU computing. Active researcher in computer vision."
  },
  {
    _id: "mock-alum-3",
    name: "Alice Johnson",
    graduationYear: 2023,
    degree: "B.Sc. in Software Engineering",
    company: "Stripe",
    role: "Fullstack Engineer",
    skills: ["Node.js", "React", "Ruby", "TypeScript"],
    email: "alice.j@stripe.com",
    linkedin: "https://linkedin.com/in/alicejohnson",
    bio: "Love building fintech tools and API products. Happy to review resumes or talk about coding interviews."
  }
];

const isConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all alumni (with query filters)
// @route   GET /api/alumni
// @access  Public
export const getAlumni = async (req, res) => {
  try {
    const { keyword, company, graduationYear, degree } = req.query;

    if (!isConnected()) {
      let filtered = [...mockAlumni];
      if (keyword) {
        filtered = filtered.filter(a => 
          a.name.toLowerCase().includes(keyword.toLowerCase()) ||
          a.role.toLowerCase().includes(keyword.toLowerCase()) ||
          a.bio.toLowerCase().includes(keyword.toLowerCase()) ||
          a.skills.some(s => s.toLowerCase().includes(keyword.toLowerCase()))
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
    
    let query = {};
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { role: { $regex: keyword, $options: 'i' } },
        { bio: { $regex: keyword, $options: 'i' } },
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

    const alumniList = await Alumni.find(query).sort({ graduationYear: -1 });
    res.status(200).json(alumniList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single alumnus profile
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

// @desc    Create/Register alumnus profile
// @route   POST /api/alumni
// @access  Public
export const createAlumni = async (req, res) => {
  try {
    const { name, graduationYear, degree, company, role, skills, email, linkedin, bio } = req.body;
    
    if (!isConnected()) {
      const newAlumnus = {
        _id: `mock-alum-${Date.now()}`,
        name,
        graduationYear,
        degree,
        company,
        role,
        skills,
        email,
        linkedin,
        bio
      };
      mockAlumni.unshift(newAlumnus);
      return res.status(201).json(newAlumnus);
    }

    const alumnus = new Alumni({
      name,
      graduationYear,
      degree,
      company,
      role,
      skills,
      email,
      linkedin,
      bio,
    });
    const createdAlumnus = await alumnus.save();
    res.status(201).json(createdAlumnus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update alumnus profile
// @route   PUT /api/alumni/:id
// @access  Public
export const updateAlumni = async (req, res) => {
  try {
    const { name, graduationYear, degree, company, role, skills, email, linkedin, bio } = req.body;
    
    if (!isConnected()) {
      const idx = mockAlumni.findIndex(a => a._id === req.params.id);
      if (idx !== -1) {
        mockAlumni[idx] = {
          ...mockAlumni[idx],
          name: name || mockAlumni[idx].name,
          graduationYear: graduationYear || mockAlumni[idx].graduationYear,
          degree: degree || mockAlumni[idx].degree,
          company: company || mockAlumni[idx].company,
          role: role || mockAlumni[idx].role,
          skills: skills || mockAlumni[idx].skills,
          email: email || mockAlumni[idx].email,
          linkedin: linkedin || mockAlumni[idx].linkedin,
          bio: bio || mockAlumni[idx].bio
        };
        return res.status(200).json(mockAlumni[idx]);
      }
      return res.status(404).json({ message: 'Alumnus not found (mock)' });
    }

    const alumnus = await Alumni.findById(req.params.id);
    if (alumnus) {
      alumnus.name = name || alumnus.name;
      alumnus.graduationYear = graduationYear || alumnus.graduationYear;
      alumnus.degree = degree || alumnus.degree;
      alumnus.company = company || alumnus.company;
      alumnus.role = role || alumnus.role;
      alumnus.skills = skills || alumnus.skills;
      alumnus.email = email || alumnus.email;
      alumnus.linkedin = linkedin || alumnus.linkedin;
      alumnus.bio = bio || alumnus.bio;

      const updatedAlumnus = await alumnus.save();
      res.status(200).json(updatedAlumnus);
    } else {
      res.status(404).json({ message: 'Alumnus profile not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete alumnus profile
// @route   DELETE /api/alumni/:id
// @access  Public
export const deleteAlumni = async (req, res) => {
  try {
    if (!isConnected()) {
      mockAlumni = mockAlumni.filter(a => a._id !== req.params.id);
      return res.status(200).json({ message: 'Alumni profile deleted (mock)' });
    }
    const alumnus = await Alumni.findById(req.params.id);
    if (alumnus) {
      await Alumni.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Alumni profile deleted' });
    } else {
      res.status(404).json({ message: 'Alumnus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed mock alumni list
// @route   POST /api/alumni/seed
// @access  Public
export const seedAlumni = async (req, res) => {
  try {
    const seedArray = [
      {
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
        name: "Jane Doe",
        graduationYear: 2024,
        degree: "B.Sc. in Computer Science",
        company: "Microsoft",
        role: "Software Engineer",
        skills: ["React", "C#", "Azure", "SQL"],
        email: "jane.doe@microsoft.com",
        linkedin: "https://linkedin.com/in/janedoe",
        bio: "Graduated with honors in CS. Passionate about cloud architectures and frontend technologies. Feel free to reach out for mentorship!"
      },
      {
        name: "John Smith",
        graduationYear: 2022,
        degree: "M.Sc. in Data Science",
        company: "NVIDIA",
        role: "Machine Learning Researcher",
        skills: ["Python", "PyTorch", "CUDA", "C++"],
        email: "jsmith@nvidia.com",
        linkedin: "https://linkedin.com/in/johnsmith",
        bio: "Specializing in deep learning and GPU computing. Active researcher in computer vision."
      },
      {
        name: "Alice Johnson",
        graduationYear: 2023,
        degree: "B.Sc. in Software Engineering",
        company: "Stripe",
        role: "Fullstack Engineer",
        skills: ["Node.js", "React", "Ruby", "TypeScript"],
        email: "alice.j@stripe.com",
        linkedin: "https://linkedin.com/in/alicejohnson",
        bio: "Love building fintech tools and API products. Happy to review resumes or talk about coding interviews."
      }
    ];

    if (!isConnected()) {
      mockAlumni = seedArray.map((a, idx) => ({ ...a, _id: `mock-alum-seed-${idx}` }));
      return res.status(201).json({ message: "Mock alumni profiles seeded successfully! (mock)" });
    }

    await Alumni.deleteMany({});
    await Alumni.insertMany(seedArray);
    res.status(201).json({ message: "Mock alumni profiles seeded successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
