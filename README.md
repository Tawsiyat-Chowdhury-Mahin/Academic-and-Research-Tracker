# Academic and Research Tracker 🎓🔬

> **A Comprehensive Full-Stack MERN Platform for University Academic Management & Career Readiness**  
> Built with **MongoDB Atlas**, **Express.js**, **React (Vite)**, and **Node.js** following clean **Model-View-Controller (MVC)** software architecture.

---

## 📌 Project Overview

**Academic and Research Tracker** is an all-in-one collaborative academic portal designed for university students, researchers, and faculty. It integrates course management, semester planning, academic scheduling, and flashcard learning with cutting-edge career tools including ATS resume optimization, live tech job feeds, AI-driven interview simulation, student polling, and university alumni mentorship.

---

## 🌟 Core Features & Modules (14 Active Modules)

### 🎓 Academic Hub
1. **📊 CGPA Calculator (`/cgpa-calculator`)**
   * Computes semester GPA and cumulative CGPA using the official **BRACU 4.0 grading scale**.
   * Includes target CGPA projection and direct integration with online academic calculators.

2. **🗺️ Course Planning & Roadmaps (`/course-planner`)**
   * Advising assistant that maps completed courses, flags prerequisite chains, and balances credit workloads.

3. **📚 Course Resources (`/course-resources`)**
   * Central repository for sharing course lecture notes, slides, previous exam questions, and lab code links organized by course codes.

4. **📇 Flash Card Maker (`/flash-card-maker`)**
   * Interactive active recall system with flip animations for memorizing definitions, formulas, and technical terminology.

5. **📅 Class Schedule & Academic Calendar (`/class-routine`)**
   * Visual weekly slot routine manager combined with official **BRACU 2026 Academic Calendar** milestones, holidays, and exam dates.

6. **⏱️ Study Planner (`/study-planner`)**
   * Personalized daily study timeline and monthly exam milestone planner.

7. **⭐ Faculty Reviews (`/faculty-reviews`)**
   * Transparent faculty evaluations, course advising ratings, and student feedback using G-Suite single sign-on.

8. **🗳️ Polls & Surveys (`/poll-survey`)**
   * Create student polls, vote on class topics, and view real-time percentage results and community opinions.

---

### 💼 Career & Networking Hub
9. **👥 Alumni Networking & Mentorship (`/alumni-networking`)**
   * Exclusive directory of authentic **BRAC University Alumni and Faculty** (e.g., Nazmul Islam Pranto, Md. Tawhid Anwar, Partha Bhoumik, Umme Jannat Taposhi, Tasnim Ahsan Prome).
   * Verified `@bracu.ac.bd` email addresses with 1-click copy & mailto, direct LinkedIn profiles, and **1-on-1 Mentorship Request** modals.

10. **💼 Job & Internship Finder (`/job-finder`)**
    * Live software engineering jobs and student tutoring/internship openings scraped from **[Bdjobs.com](https://bdjobs.com/h/)** and university departments.
    * Multi-filter search (location, keyword, role type) and persistent bookmarking.

11. **📄 Resume Builder (`/resume-builder`)**
    * Full-featured CV builder with dynamic template switching (**Classic Academic** serif vs. **Modern Corporate** sidebar), LinkedIn/GitHub profile URLs with smart external links, and one-click PDF printing.

12. **🤖 CV Match Analyzer & ATS Optimizer (`/cv-analyzer`)**
    * Cross-references CV text against job descriptions to calculate categorized fit percentages across Languages, Frameworks, and Tools.
    * **Actionable CV Improvement Suite**:
      * ✍️ **Before vs. After Bullet Point Rewrites** (transforming passive statements into quantified action bullets).
      * 🎯 **Keyword Placement Strategy Matrix** (recommends exact sections to insert missing keywords).
      * 🛡️ **ATS Compliance Audit Checklist** (word count, action verb density, metrics presence).
      * 📝 **Tailored Elevator Pitch Generator** with 1-click clipboard copy.

13. **🎙️ Interactive Interview Simulator (`/interview-simulator`)**
    * Focused text simulator with a **60-second pressure countdown timer**.
    * Automated keyword-based scoring rubrics and instant feedback.
    * **🌟 100% Benchmark Model Answers** with a 1-click **Copy Answer** button for every question across all 5 specialized tracks:
      * 🏗️ **Software Engineering Models & Architecture** *(MVC, Clean Architecture, SOLID, Microservices, CAP Theorem)*
      * 🗄️ **Database Systems & Data Modeling** *(Normalization 1NF-BCNF, Indexing, ACID vs. BASE, Sharding)*
      * ⚙️ **Backend & Distributed Systems** *(Node, Express, JWT, Microservices)*
      * 💻 **Frontend Web Development** *(React 19, Virtual DOM, Redux Toolkit)*
      * 👨‍🏫 **Undergraduate Student Tutor & TA** *(OOP, Recursion, Pointer Debugging)*

---

### 🔐 Authentication & User Accounts
14. **User Profile & Authentication (`/profile` / `/auth`)**
    * Role-based access control (**Student**, **Researcher**, **Faculty / Advisor**).
    * Customized for BRAC University with **G-Suite emails** (`@g.bracu.ac.bd`), **8-digit Student ID format** (`22101456`), and official **Department IDs** (CSE-01, CS-01, EEE-02, ECE-03, MNS-04, BBS-05, etc.).
    * 1-Click **Demo Student / Demo Faculty** login for instant testing.

---

## 🏗️ Architecture & Technology Stack

```
Academic and Research Tracker/
├── backend/
│   ├── config/             # MongoDB Atlas connection & fallback
│   ├── controllers/        # MVC Business logic controllers (14 modules)
│   ├── models/             # Mongoose Schemas (User, Resume, Job, Alumni, FlashCard, Poll, Resource, etc.)
│   ├── routes/             # RESTful API routing endpoints
│   └── server.js           # Express application entrypoint (Port 5000)
├── frontend/
│   ├── src/
│   │   ├── context/        # React AuthContext (JWT & session persistence)
│   │   ├── features/       # 14 UI Feature components & styles
│   │   ├── App.jsx         # Sidebar navigation & Declarative React Router
│   │   └── main.jsx        # Root entrypoint
│   ├── package.json
│   └── vite.config.js      # Vite build configuration (Port 5173)
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** (v18 or newer)
* **npm** (v9 or newer)

### 1. Clone & Setup
```bash
git clone https://github.com/Tawsiyat-Chowdhury-Mahin/Academic-and-Research-Tracker.git
cd "Academic and Research Tracker"
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Backend starts on http://localhost:5000 (connected to MongoDB Atlas)
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 👥 Contributors
Developed collaboratively for CSE Academic and Research Readiness © 2026.
