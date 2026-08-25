# Academic and Research Tracker 🎓🔬

> **A Modular Full-Stack MERN Application Built for University Collaboration**  
> Powered by **MongoDB**, **Express.js**, **React (Vite)**, and **Node.js** following strict **Model-View-Controller (MVC)** design patterns.

---

## 📌 Project Overview

**Academic and Research Tracker** is a collaborative student and researcher hub. It provides a unified authentication foundation and modular feature hubs designed so multiple team members can contribute new modules without merge conflicts or architectural confusion.

### 🌟 Features Included Out-of-the-Box:
1. 🔐 **Common Authentication & User Profiles** (`/auth`)
   - Full registration, login, and profile view (Student, Researcher, Faculty roles).
   - Fast 1-click **Demo Login** for instant university testing/evaluation.
   - Built-in secure password hashing.
2. 📄 **Resume Builder** (`/resume-builder`)
   - Dynamic template switcher (**Classic Academic** serif vs. **Modern Corporate** sidebar).
   - Live PDF-ready print preview with formatted typography.
3. 🧠 **CV Match Analyzer** (`/cv-analyzer`)
   - Evaluates CV text against job descriptions.
   - Categorized fit scores (*Programming Languages*, *Frameworks & Libraries*, *Tools & Databases*).
4. 💼 **Job & Internship Finder** (`/job-finder`)
   - Opportunity directory with keyword & location search.
   - **Local Storage Bookmarking** tab to save openings across sessions.
5. 🎙️ **Interview Simulator** (`/interview-simulator`)
   - Real-time technical interview simulator.
   - **Web Speech API (TTS)** question voice-over + **60-second question countdown timer**.
   - Automated performance grading feedback cards.
6. 🎓 **Alumni Networking** (`/alumni-networking`)
   - Filterable university alumni directory.
   - Interactive **1-on-1 Mentorship Request** modal dialog.

---

## 🏗️ Architecture & Folder Structure

```
academic-and-research-tracker/
├── .gitignore
├── README.md
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection with zero-crash fallback
│   ├── models/                      # [M]ODELS: Mongoose Database Schemas
│   │   ├── User.js                  # Common Auth Model
│   │   ├── Resume.js
│   │   ├── CVAnalysis.js
│   │   ├── Job.js
│   │   ├── Interview.js
│   │   └── Alumni.js
│   ├── controllers/                 # [C]ONTROLLERS: Business Logic & Data Handlers
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── cvAnalyzerController.js
│   │   ├── jobController.js
│   │   ├── interviewController.js
│   │   └── alumniController.js
│   ├── routes/                      # ROUTES: Express REST API Endpoints
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── cvAnalyzerRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── alumniRoutes.js
│   ├── .env.example                 # Environment configuration template
│   ├── package.json
│   └── server.js                    # Backend Server Entrypoint
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global Auth & Session Provider
    │   ├── features/                # [V]IEWS: Independent Feature Modules
    │   │   ├── AuthPage.jsx          # Sign In / Sign Up View
    │   │   ├── ResumeBuilder.jsx
    │   │   ├── CVAnalyzer.jsx
    │   │   ├── JobFinder.jsx
    │   │   ├── InterviewSimulator.jsx
    │   │   └── AlumniNetworking.jsx
    │   ├── App.jsx                  # Main Navigation & Router Shell
    │   ├── main.jsx                 # React DOM Root
    │   └── index.css                # Global Design System
    ├── package.json
    └── vite.config.js
```

---

## 🗄️ Database Setup (MongoDB)

### 👥 How Group Members Connect to the Common Shared Database (Cloud Atlas)

The project includes a centralized **MongoDB Atlas Cloud Database** so all group members share the same real-time data!

1. In your `backend/` folder, create a file named `.env` (or copy `.env.example` to `.env`).
2. Add the shared connection string:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://tawsiyatc_db_user:9Xgca5GSwU40ddyW@cluster0.wpuryjm.mongodb.net/academic_tracker_db?retryWrites=true&w=majority&appName=Cluster0
   ```
3. **What this enables for the group**:
   - **Shared User Accounts**: Accounts registered by one member can immediately be logged into by all other members.
   - **Shared Data**: All resumes, CV match scores, job bookmarks, interview simulations, and alumni mentorship requests are synced across everyone's laptops in real time.
4. **Inspecting Live Data in MongoDB Compass**:
   - Download and open **MongoDB Compass** on your PC.
   - Paste the `mongodb+srv://...` connection string from above and click **Connect**.
   - You can visually view and edit all 6 collections: `users`, `alumnis`, `jobs`, `resumes`, `cvanalyses`, and `interviews`.

---

### Alternative Database Options:

* **Local MongoDB Community Server**:
  If you prefer running a local database instance:
  ```env
  MONGO_URI=mongodb://127.0.0.1:27017/academic_tracker_db
  ```

* **Zero-Config In-Memory Fallback (No MongoDB Required)**:
  - If MongoDB is offline or inaccessible, the backend **will NEVER crash**.
  - All controllers automatically activate an in-memory database pre-seeded with sample student accounts, jobs, and alumni so you can test features offline!

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Tawsiyat-Chowdhury-Mahin/Academic-and-Research-Tracker.git
cd Academic-and-Research-Tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # On Windows: copy .env.example .env
npm run dev
```
*Backend will run on **http://localhost:5000***

### 3. Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run on **http://localhost:5173***

---

## 🔑 Demo Login Credentials

For quick testing or presentation grading, you can click the **Quick Demo** button on the UI or use:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Demo Student** | Student | `demo@student.edu` | `password123` |
| **Demo Faculty** | Nazmul Islam | `faculty@uni.edu` | `faculty123` |

---

## 👥 How Group Members Can Add New Features (Step-by-Step)

To add a new feature (e.g. `ResearchProjectTracker`), follow these 6 modular steps:

### Step 1: Create a Database Model
Create `backend/models/ResearchProject.js`:
```javascript
import mongoose from 'mongoose';

const researchProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  field: { type: String, required: true },
  supervisor: { type: String, required: true },
  status: { type: String, enum: ['Ongoing', 'Published'], default: 'Ongoing' }
}, { timestamps: true });

export default mongoose.model('ResearchProject', researchProjectSchema);
```

### Step 2: Create a Controller
Create `backend/controllers/researchProjectController.js`:
```javascript
import ResearchProject from '../models/ResearchProject.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;
let fallbackProjects = [];

export const getProjects = async (req, res) => {
  if (isDbConnected()) {
    const projects = await ResearchProject.find();
    return res.json(projects);
  }
  return res.json(fallbackProjects);
};

export const createProject = async (req, res) => {
  if (isDbConnected()) {
    const created = await ResearchProject.create(req.body);
    return res.status(201).json(created);
  }
  const newObj = { _id: Date.now().toString(), ...req.body };
  fallbackProjects.push(newObj);
  return res.status(201).json(newObj);
};
```

### Step 3: Create a Route
Create `backend/routes/researchProjectRoutes.js`:
```javascript
import express from 'express';
import { getProjects, createProject } from '../controllers/researchProjectController.js';

const router = express.Router();
router.get('/', getProjects);
router.post('/', createProject);

export default router;
```

### Step 4: Mount the Route in `backend/server.js`
Open `backend/server.js` and add:
```javascript
import researchProjectRoutes from './routes/researchProjectRoutes.js';

// Register endpoint
app.use('/api/research-projects', researchProjectRoutes);
```

### Step 5: Create your React Feature Component
Create `frontend/src/features/ResearchProjectTracker.jsx`:
```jsx
import React, { useState, useEffect } from 'react';

const ResearchProjectTracker = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/research-projects')
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="card">
      <h2>Research Projects</h2>
      {projects.map(p => <div key={p._id}>{p.title} - {p.status}</div>)}
    </div>
  );
};

export default ResearchProjectTracker;
```

### Step 6: Register the Feature in `frontend/src/App.jsx`
Open `frontend/src/App.jsx`:
1. Import your component:
   ```javascript
   import ResearchProjectTracker from './features/ResearchProjectTracker';
   ```
2. Add a `<NavLink>` in the `<nav>` sidebar:
   ```jsx
   <NavLink to="/research-projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
     <GraduationCap size={18} /> Research Projects
   </NavLink>
   ```
3. Add a `<Route>` inside `<Routes>`:
   ```jsx
   <Route path="/research-projects" element={<ResearchProjectTracker />} />
   ```

---

## 🌿 Git & GitHub Collaboration Guidelines

1. **Always pull latest main branch before starting work**:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a branch for your feature**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: added research project tracker module"
   ```
4. **Push your branch & open a Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Team members review the PR on GitHub and click **Merge**.

---

## 📜 License & Acknowledgments
Created for University Academic & Collaborative Course Projects. Designed with standard MERN MVC best practices.
