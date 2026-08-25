import React, { useState } from 'react';
import { 
  Calculator, ExternalLink, Plus, Trash2, Award, 
  TrendingUp, BookOpen, Sparkles, CheckCircle2, RotateCcw
} from 'lucide-react';

const EXTERNAL_CGPA_URL = 'https://showmickkar.github.io/bracu-cgpa-calculator/';

const GRADE_POINTS = {
  'A (4.0)': 4.0,
  'A- (3.7)': 3.7,
  'B+ (3.3)': 3.3,
  'B (3.0)': 3.0,
  'B- (2.7)': 2.7,
  'C+ (2.3)': 2.3,
  'C (2.0)': 2.0,
  'C- (1.7)': 1.7,
  'D+ (1.3)': 1.3,
  'D (1.0)': 1.0,
  'F (0.0)': 0.0
};

const INITIAL_COURSES = [
  { id: '1', name: 'CSE327 - Software Engineering', credits: 3, grade: 'A (4.0)' },
  { id: '2', name: 'CSE411 - Database Systems', credits: 3, grade: 'A- (3.7)' },
  { id: '3', name: 'MAT215 - Complex Variables', credits: 3, grade: 'B+ (3.3)' },
  { id: '4', name: 'CSE327L - SE Lab', credits: 1, grade: 'A (4.0)' }
];

const CgpaCalculator = () => {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('user_cgpa_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [previousCgpa, setPreviousCgpa] = useState(3.65);
  const [previousCredits, setPreviousCredits] = useState(45);

  const [newCourseName, setNewCourseName] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newGrade, setNewGrade] = useState('A (4.0)');

  // Save courses
  const saveCourses = (updated) => {
    setCourses(updated);
    localStorage.setItem('user_cgpa_courses', JSON.stringify(updated));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      name: newCourseName.trim(),
      credits: Number(newCredits),
      grade: newGrade
    };

    saveCourses([...courses, newEntry]);
    setNewCourseName('');
    setNewCredits(3);
    setNewGrade('A (4.0)');
  };

  const handleDeleteCourse = (id) => {
    saveCourses(courses.filter(c => c.id !== id));
  };

  // Calculations
  const semesterTotalCredits = courses.reduce((sum, c) => sum + Number(c.credits), 0);
  const semesterTotalPoints = courses.reduce((sum, c) => sum + (Number(c.credits) * GRADE_POINTS[c.grade]), 0);
  const semesterGpa = semesterTotalCredits > 0 ? (semesterTotalPoints / semesterTotalCredits).toFixed(2) : '0.00';

  // Overall Cumulative CGPA
  const totalCombinedCredits = Number(previousCredits) + semesterTotalCredits;
  const totalCombinedPoints = (Number(previousCredits) * Number(previousCgpa)) + semesterTotalPoints;
  const cumulativeCgpa = totalCombinedCredits > 0 ? (totalCombinedPoints / totalCombinedCredits).toFixed(2) : '0.00';

  const handleOpenExternal = () => {
    window.open(EXTERNAL_CGPA_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Banner with One-Click External Portal Link */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '32px 36px',
        marginBottom: '28px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#38bdf8', marginBottom: '12px' }}>
            <Sparkles size={14} /> BRACU Official Scale (4.0)
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0' }}>
            CGPA Calculator & Performance Tracker 🎓📊
          </h1>
          <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 20px 0' }}>
            Calculate your semester GPA, project overall cumulative CGPA, and launch the dedicated online BRACU CGPA web calculator.
          </p>

          <button
            onClick={handleOpenExternal}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 22px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
          >
            Launch BRACU CGPA Tool <ExternalLink size={17} />
          </button>
        </div>

        {/* Live GPA Displays */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '18px 24px', textAlign: 'center', minWidth: '130px' }}>
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase' }}>Semester GPA</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>{semesterGpa}</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{semesterTotalCredits} Credits</div>
          </div>

          <div style={{ background: 'rgba(37, 99, 235, 0.25)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '12px', padding: '18px 24px', textAlign: 'center', minWidth: '130px' }}>
            <div style={{ fontSize: '11px', color: '#bfdbfe', fontWeight: 700, textTransform: 'uppercase' }}>Overall CGPA</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>{cumulativeCgpa}</div>
            <div style={{ fontSize: '11px', color: '#bfdbfe' }}>{totalCombinedCredits} Total Cr</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Course Grade Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Add Course Form */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 14px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="#2563eb" /> Add Semester Course
            </h3>

            <form onSubmit={handleAddCourse} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr auto', gap: '10px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. CSE327 Software Eng"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Credits</label>
                <select
                  value={newCredits}
                  onChange={(e) => setNewCredits(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                >
                  <option value={1}>1.0 Cr</option>
                  <option value={1.5}>1.5 Cr</option>
                  <option value={2}>2.0 Cr</option>
                  <option value={3}>3.0 Cr</option>
                  <option value={4}>4.0 Cr</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Grade</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                >
                  {Object.keys(GRADE_POINTS).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '9px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                + Add
              </button>
            </form>
          </div>

          {/* Current Semester Course List */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>
                Current Semester Courses ({courses.length})
              </h3>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
                GPA: {semesterGpa}
              </span>
            </div>

            {courses.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '30px 0' }}>
                No courses added yet. Add your courses above to calculate GPA!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {courses.map(course => (
                  <div
                    key={course.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #edf2f7'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{course.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{course.credits} Credits</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '3px 10px', borderRadius: '6px' }}>
                        {course.grade}
                      </span>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Delete course"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Previous History & Official Grading Scale */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Previous Academic Standing */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#2563eb" /> Previous Academic History
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0' }}>
              Enter your completed credit count and CGPA to compute your updated cumulative CGPA:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Previous CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={previousCgpa}
                  onChange={(e) => setPreviousCgpa(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Credits Completed</label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={previousCredits}
                  onChange={(e) => setPreviousCredits(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* BRACU Grading Scale Reference */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#334155' }}>
              Official BRACU Grading Scale:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px', color: '#475569' }}>
              <div><strong style={{ color: '#16a34a' }}>A (4.0)</strong> : 90% - 100%</div>
              <div><strong style={{ color: '#16a34a' }}>A- (3.7)</strong> : 85% - 89%</div>
              <div><strong style={{ color: '#2563eb' }}>B+ (3.3)</strong> : 80% - 84%</div>
              <div><strong style={{ color: '#2563eb' }}>B (3.0)</strong> : 75% - 79%</div>
              <div><strong style={{ color: '#2563eb' }}>B- (2.7)</strong> : 70% - 74%</div>
              <div><strong style={{ color: '#d97706' }}>C+ (2.3)</strong> : 65% - 69%</div>
              <div><strong style={{ color: '#d97706' }}>C (2.0)</strong> : 60% - 64%</div>
              <div><strong style={{ color: '#dc2626' }}>F (0.0)</strong> : &lt; 50%</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CgpaCalculator;