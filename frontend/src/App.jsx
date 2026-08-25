import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  FileText, 
  Cpu, 
  Briefcase, 
  PlayCircle, 
  Users, 
  GraduationCap, 
  Home, 
  LogIn, 
  LogOut, 
  User, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  Compass,
  Calendar,
  Star,
  CalendarDays,
  BookMarked
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './features/AuthPage';
import ResumeBuilder from './features/ResumeBuilder';
import CVAnalyzer from './features/CVAnalyzer';
import JobFinder from './features/JobFinder';
import InterviewSimulator from './features/InterviewSimulator';
import AlumniNetworking from './features/AlumniNetworking';
import StudyPlanner from './features/StudyPlanner';
import FacultyReviews from './features/FacultyReviews';
import ClassRoutine from './features/ClassRoutine';
import CoursePlanner from './features/CoursePlanner';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)', 
        padding: '32px 36px', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid #dbeafe',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={16} /> Academic Portal
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Welcome, {user?.name ? user.name.split(' ')[0] : 'Student'}! 👋
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.5 }}>
            Explore your integrated research tracking, career preparation tools, and university networking features below.
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Featured Modules</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>9 Core Features Active</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          
          {/* Card 1: Resume Builder */}
          <Link to="/resume-builder" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)' }}>
                <FileText size={24} />
              </div>
              <span className="badge badge-primary">Templates & PDF</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Resume Builder</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Compile professional academic & industry resumes with live Classic Academic and Modern Corporate templates.
            </p>
            <div className="card-footer-link">
              <span>Open Builder</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 2: CV Analyzer */}
          <Link to="/cv-analyzer" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)' }}>
                <Cpu size={24} />
              </div>
              <span className="badge badge-success">Match Scoring</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>CV Match Analyzer</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Scan your CV against job descriptions to compute categorized fit percentages across Languages, Frameworks, and Tools.
            </p>
            <div className="card-footer-link">
              <span>Analyze CV</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 3: Job Finder */}
          <Link to="/job-finder" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)' }}>
                <Briefcase size={24} />
              </div>
              <span className="badge badge-warning">Internships</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Job & Intern Finder</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Search open software and research internships, filter by tags, and save postings in your local bookmarks tab.
            </p>
            <div className="card-footer-link">
              <span>Browse Jobs</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 4: Course Planning & Prereq Optimizer (NEW) */}
          <Link to="/course-planner" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)' }}>
                <BookMarked size={24} />
              </div>
              <span className="badge badge-primary">Advising & Prereqs</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Course Planning</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Suggests an optimized semester plan based on completed courses, prerequisites, and balanced credit workload.
            </p>
            <div className="card-footer-link">
              <span>Plan Courses</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 5: Class Routine & Academic Calendar */}
          <Link to="/class-routine" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)' }}>
                <CalendarDays size={24} />
              </div>
              <span className="badge badge-primary">2026 Planner</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Class Schedule & Calendar</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Organize your weekly class slots and track official BRACU 2026 exam dates, holidays, and semester milestones.
            </p>
            <div className="card-footer-link">
              <span>View Schedule</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 6: Study Planner */}
          <Link to="/study-planner" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)' }}>
                <Calendar size={24} />
              </div>
              <span className="badge badge-primary">Daily & Monthly</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Study Planner</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Generate personalized daily study timelines and monthly roadmaps aligned with course exams and assignment deadlines.
            </p>
            <div className="card-footer-link">
              <span>Open Planner</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 7: Faculty Reviews */}
          <Link to="/faculty-reviews" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(217, 119, 6, 0.15)' }}>
                <Star size={24} />
              </div>
              <span className="badge badge-warning">G-Suite Reviews</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Faculty Reviews</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Explore transparent student evaluations, course advising ratings, and faculty feedback using G-Suite single sign-on.
            </p>
            <div className="card-footer-link">
              <span>View Reviews</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 8: Alumni Networking */}
          <Link to="/alumni-networking" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)' }}>
                <Users size={24} />
              </div>
              <span className="badge badge-success">Mentorship</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Alumni Directory</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Connect with alumni from top tech companies, request 1-on-1 career guidance, and review graduation journeys.
            </p>
            <div className="card-footer-link">
              <span>View Alumni</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 9: Interview Simulator */}
          <Link to="/interview-simulator" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)' }}>
                <PlayCircle size={24} />
              </div>
              <span className="badge badge-primary">Voice & Timer</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Interview Simulator</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Practice technical interviews with automated Web Speech TTS audio read-aloud and a 60-second pressure countdown timer.
            </p>
            <div className="card-footer-link">
              <span>Start Simulator</span> <ChevronRight size={16} />
            </div>
          </Link>

          {/* Card 10: Profile & Settings */}
          <Link to="/profile" className="card feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} />
              </div>
              <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>User Profile</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>My Account</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Manage your registered university credentials, student ID, department info, and profile bio.
            </p>
            <div className="card-footer-link">
              <span>View Profile</span> <ChevronRight size={16} />
            </div>
          </Link>

        </div>
      </div>

      <style>{`
        .feature-card {
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          border: 1px solid var(--border-color);
          background-color: #ffffff;
          padding: 26px;
          border-radius: var(--radius-lg);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
          border-color: #bfdbfe;
        }
        .feature-card:hover .card-footer-link {
          color: var(--color-primary-hover);
          gap: 8px;
        }
        .card-footer-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-primary);
          transition: all var(--transition-fast);
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};

const NavigationSidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside style={{
      width: '280px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 20px',
      position: 'sticky',
      top: 0,
      height: '100vh',
      flexShrink: 0,
      boxShadow: 'var(--shadow-xs)'
    }} className="app-sidebar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Logo area */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit', padding: '0 6px' }}>
          <div style={{ 
            background: 'var(--color-primary-gradient)', 
            color: '#fff', 
            width: '40px',
            height: '40px',
            borderRadius: '12px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
          }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Research Tracker</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Academic & Career Hub</p>
          </div>
        </Link>

        {/* User Mini Profile */}
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '12px 14px', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{ 
              width: '34px', 
              height: '34px', 
              borderRadius: '50%', 
              background: 'var(--color-primary-gradient)', 
              color: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              flexShrink: 0 
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'User'}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, textTransform: 'capitalize', fontWeight: 500 }}>{user?.role || 'Student'}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            title="Sign Out" 
            style={{ 
              background: '#ffffff', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px',
              cursor: 'pointer', 
              color: 'var(--color-danger)', 
              padding: '6px', 
              display: 'flex', 
              alignItems: 'center',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <LogOut size={15} />
          </button>
        </div>

        {/* Navigation links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Home size={18} /> Home Dashboard
          </NavLink>

          <NavLink 
            to="/course-planner" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <BookMarked size={18} /> Course Planning
          </NavLink>

          <NavLink 
            to="/class-routine" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <CalendarDays size={18} /> Class Schedule
          </NavLink>

          <NavLink 
            to="/study-planner" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Calendar size={18} /> Study Planner
          </NavLink>

          <NavLink 
            to="/faculty-reviews" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Star size={18} /> Faculty Reviews
          </NavLink>

          <NavLink 
            to="/resume-builder" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <FileText size={18} /> Resume Builder
          </NavLink>

          <NavLink 
            to="/cv-analyzer" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Cpu size={18} /> CV Match Analyzer
          </NavLink>

          <NavLink 
            to="/job-finder" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Briefcase size={18} /> Job/Intern Finder
          </NavLink>

          <NavLink 
            to="/interview-simulator" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <PlayCircle size={18} /> Interview Simulator
          </NavLink>

          <NavLink 
            to="/alumni-networking" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={18} /> Alumni Networking
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <User size={18} /> Account Profile
          </NavLink>
        </nav>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        CSE Project © 2026
      </div>
    </aside>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Loading portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="app-container">
      <NavigationSidebar />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/course-planner" element={<CoursePlanner />} />
          <Route path="/class-routine" element={<ClassRoutine />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
          <Route path="/faculty-reviews" element={<FacultyReviews />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/cv-analyzer" element={<CVAnalyzer />} />
          <Route path="/job-finder" element={<JobFinder />} />
          <Route path="/interview-simulator" element={<InterviewSimulator />} />
          <Route path="/alumni-networking" element={<AlumniNetworking />} />
          <Route path="/profile" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />

        <style>{`
          .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 11px 16px;
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.92rem;
            transition: all var(--transition-fast);
          }
          .nav-item:hover {
            background-color: #f1f5f9;
            color: var(--text-primary);
          }
          .nav-item.active {
            background: #eff6ff;
            color: var(--color-primary);
            font-weight: 700;
          }
          @media (max-width: 768px) {
            .app-sidebar {
              width: 100% !important;
              height: auto !important;
              border-right: none !important;
              border-bottom: 1px solid var(--border-color);
              position: relative !important;
              padding: 15px !important;
            }
            .app-sidebar nav {
              flex-direction: row !important;
              flex-wrap: wrap !important;
              gap: 4px !important;
              margin-top: 10px !important;
            }
            .nav-item {
              padding: 6px 12px !important;
              font-size: 0.85rem !important;
            }
          }
        `}</style>
      </Router>
    </AuthProvider>
  );
}

export default App;