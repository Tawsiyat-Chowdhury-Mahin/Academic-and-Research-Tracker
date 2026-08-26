# Academic and Research Tracker 🎓🔬

> **A Comprehensive Full-Stack MERN Platform for University Academic Management & Career Readiness**  
> Built with **MongoDB Atlas**, **Express.js**, **React (Vite)**, and **Node.js** following clean **Model-View-Controller (MVC)** software architecture.

---

## 📌 Project Overview

**Academic and Research Tracker** is an all-in-one collaborative academic portal designed for university students, researchers, and faculty. It integrates course management, semester planning, and academic scheduling with cutting-edge career tools including ATS resume optimization, live tech job feeds, AI-driven interview simulation, and university alumni mentorship.

---

## 🌟 Core Features & Modules

### 🎓 Academic Hub
1. **📊 CGPA Calculator (`/cgpa-calculator`)**
   * Computes semester GPA and cumulative CGPA using the official **BRACU 4.0 grading scale**.
   * Includes target CGPA projection and direct integration with online academic calculators.

2. **🗺️ Course Planning & Roadmaps (`/course-planner`)**
   * Advising assistant that maps completed courses, flags prerequisite chains, and balances credit workloads.

3. **📅 Class Schedule & Academic Calendar (`/class-routine`)**
   * Visual weekly slot routine manager combined with official **BRACU 2026 Academic Calendar** milestones, holidays, and exam dates.

4. **⏱️ Study Planner (`/study-planner`)**
   * Personalized daily study timeline and monthly exam milestone planner.

5. **⭐ Faculty Reviews (`/faculty-reviews`)**
   * Transparent faculty evaluations, course advising ratings, and student feedback using G-Suite single sign-on.

---

### 💼 Career & Networking Hub
6. **👥 Alumni Networking & Mentorship (`/alumni-networking`)**
   * Exclusive directory of authentic **BRAC University Alumni and Faculty** (e.g., Nazmul Islam Pranto, Md. Tawhid Anwar, Partha Bhoumik, Umme Jannat Taposhi, Tasnim Ahsan Prome).
   * Direct LinkedIn profile links and interactive **1-on-1 Mentorship Request** modals.

7. **💼 Job & Internship Finder (`/job-finder`)**
   * Live software engineering jobs and student tutoring/internship openings scraped from **[Bdjobs.com](https://bdjobs.com/h/)** and university departments.
   * Multi-filter search (location, keyword, role type) and persistent bookmarking.

8. **📄 Resume Builder (`/resume-builder`)**
   * Full-featured CV builder with dynamic template switching (**Classic Academic** serif vs. **Modern Corporate** sidebar) and one-click PDF printing.

9. **🤖 CV Match Analyzer & ATS Optimizer (`/cv-analyzer`)**
   * Cross-references CV text against job descriptions to calculate categorized fit percentages.
   * **Actionable CV Improvement Suite**:
     * ✍️ **Before vs. After Bullet Point Rewrites** (transforming passive statements into quantified action bullets).
     * 🎯 **Keyword Placement Strategy Matrix** (recommends exact sections to insert missing keywords).
     * 🛡️ **ATS Compliance Audit Checklist** (word count, action verb density, metrics presence).
     * 📝 **Tailored Elevator Pitch Generator** with 1-click clipboard copy.

10. **🎙️ Interactive Interview Simulator (`/interview-simulator`)**
    * Voiceover question read-aloud via **Web Speech API (TTS)** and **60-second pressure countdown timer**.
    * Automated keyword-based scoring rubrics and instant feedback.
    * **5 Specialized Tracks**:
      * 🏗️ **Software Engineering Models & Architecture** *(MVC, Clean Architecture, SOLID, Microservices, CAP Theorem)*
      * 🗄️ **Database Systems & Data Modeling** *(Normalization 1NF-BCNF, Indexing, ACID vs. BASE, Sharding)*
      * ⚙️ **Backend & Distributed Systems** *(Node, Express, JWT, Microservices)*
      * 💻 **Frontend Web Development** *(React 19, Virtual DOM, Redux Toolkit)*
      * 👨‍🏫 **Undergraduate Student Tutor & TA** *(OOP, Recursion, Pointer Debugging)*

---

### 🔐 Authentication & User Accounts
11. **User Profile & Authentication (`/profile` / `/auth`)**
    * Role-based access control (**Student**, **Researcher**, **Faculty / Advisor**).
    * Customized for BRAC University with **G-Suite emails** (`@g.bracu.ac.bd`), **8-digit Student ID format** (`22101456`), and official **Department IDs** (CSE-01, CS-01, EEE-02, ECE-03, MNS-04, BBS-05, etc.).
    * 1-Click **Demo Student / Demo Faculty** login for instant testing.

---

## 🏗️ Architecture & Technology Stack

```
Academic and Research Tracker/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection with zero-crash fallback
│   ├── models/                      # [M]ODELS: 11 Mongoose Database Schemas
│   │   ├── User.js                  # User Accounts & Roles
│   │   ├── Resume.js                # CV / Resume Builder
│   │   ├── CVAnalysis.js            # Match Analyses & ATS Reports
│   │   ├── Job.js                   # Bdjobs & Tech Listings
│   │   ├── Interview.js             # Simulation Attempts & Grading
│   │   ├── Alumni.js                # BRACU Alumni Profiles
│   │   ├── StudyPlan.js             # Daily & Monthly Study Schedules
│   │   ├── CgpaRecord.js            # Semester CGPA Records
│   │   ├── CoursePlan.js            # Prerequisite Roadmaps
│   │   ├── ClassRoutine.js          # Weekly Schedules & Calendar
│   │   └── FacultyReview.js         # Faculty Ratings & Feedback
│   ├── controllers/                 # [C]ONTROLLERS: Business Logic & Data Seeders
│   ├── routes/                      # ROUTES: Express REST API Endpoints
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Backend Server Entrypoint
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global Auth State & Session Management
    │   ├── features/                # [V]IEWS: 11 Feature Components
    │   │   ├── AuthPage.jsx
    │   │   ├── CgpaCalculator.jsx
    │   │   ├── CoursePlanner.jsx
    │   │   ├── ClassRoutine.jsx
    │   │   ├── StudyPlanner.jsx
    │   │   ├── FacultyReviews.jsx
    │   │   ├── ResumeBuilder.jsx
    │   │   ├── CVAnalyzer.jsx
    │   │   ├── JobFinder.jsx
    │   │   ├── InterviewSimulator.jsx
    │   │   └── AlumniNetworking.jsx
    │   ├── App.jsx                  # Main Navigation Layout & React Router
    │   ├── main.jsx                 # Vite Entrypoint
    │   └── index.css                # Global Design System
    ├── package.json
    └── vite.config.js
```

---

## 🗄️ Database Setup (MongoDB Atlas)

The platform is connected to a shared **MongoDB Atlas Cloud Cluster** so all team members and evaluators share the exact same live database:

1. In your `backend/` directory, create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://tawsiyatc_db_user:9Xgca5GSwU40ddyW@cluster0.wpuryjm.mongodb.net/academic_tracker_db?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=academic_tracker_super_secret_jwt_key_2026
   ```

2. **MongoDB Compass Inspection**:
   * Open **MongoDB Compass**.
   * Paste the `MONGO_URI` connection string above and connect.
   * Database Name: **`academic_tracker_db`**
   * Active Collections:
     * `users`
     * `alumnis`
     * `jobs`
     * `resumes`
     * `cvanalyses`
     * `interviews`
     * `studyplans`
     * `cgparecords`
     * `courseplans`
     * `classroutines`
     * `facultyreviews`

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Tawsiyat-Chowdhury-Mahin/Academic-and-Research-Tracker.git
cd Academic-and-Research-Tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
* Backend runs on **`http://localhost:5000`**

### 3. Frontend Setup (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
```
* Frontend runs on **`http://localhost:5173`**

---

## 🔑 Demo Login Credentials

You can use the **1-Click Demo Login** buttons on the login page or enter:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `demo@student.edu` | `password123` | Student |
| **Demo Faculty** | `faculty@uni.edu` | `faculty123` | Faculty / Advisor |

---

## 🌿 Git Workflow for Collaborators

1. **Pull Latest Changes**:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create Feature Branch**:
   ```bash
   git checkout -b feature/module-name
   ```
3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: your feature summary"
   git push origin feature/module-name
   ```

---

## 📜 License
Developed for University Academic & Collaborative Course Evaluation © 2026.
