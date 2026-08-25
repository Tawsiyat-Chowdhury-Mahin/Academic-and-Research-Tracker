import React, { useState, useEffect } from 'react';
import { 
  BookMarked, CheckCircle2, Lock, AlertCircle, Sparkles, 
  Layers, ChevronRight, Info, Plus, Trash2, Check, ArrowRight
} from 'lucide-react';

// Official Department Course Database with Prerequisites & Syllabi
const COURSE_CATALOG = [
  { code: 'CSE110', title: 'Programming Language I', credits: 3, prereqs: [], category: 'Core Foundation', desc: 'Foundations of computation, problem analysis, flowcharts, variables, loops, recursion, and file handling.', books: 'Appropriate language text' },
  { code: 'CSE111', title: 'Programming Language II', credits: 3, prereqs: ['CSE110'], category: 'Core Foundation', desc: 'Introduction to data structures, formal syntax, structured OOP programming, and modular application design.', books: 'Appropriate OOP text' },
  { code: 'CSE220', title: 'Data Structures', credits: 3, prereqs: ['CSE111'], category: 'Core Computer Science', desc: 'Arrays, linked lists, stacks, queues, trees, graphs, hashing, recursion, and algorithm performance.', books: 'Aho, Hopcroft, Ullman - Data Structures' },
  { code: 'CSE221', title: 'Algorithms', credits: 3, prereqs: ['CSE220'], category: 'Core Computer Science', desc: 'Divide & Conquer, Greedy method, Dynamic Programming, Graph algorithms, shortest paths, and NP-completeness.', books: 'Donald E. Knuth - Art of Computer Programming' },
  { code: 'CSE230', title: 'Discrete Mathematics', credits: 3, prereqs: [], category: 'Mathematical Foundation', desc: 'Set theory, graph theory, boolean algebra, discrete probability, predicate calculus, and logic.', books: 'Kenneth H. Rosen - Discrete Mathematics' },
  { code: 'CSE250', title: 'Circuits and Electronics', credits: 3, prereqs: [], category: 'Hardware & Circuits', desc: 'Direct/alternating current, Ohm’s law, Kirchhoff’s laws, magnetic circuits, and RLC network analysis.', books: 'Robert L. Boylestad - Introductory Circuit Analysis' },
  { code: 'CSE251', title: 'Electronic Devices and Circuits', credits: 3, prereqs: ['CSE250'], category: 'Hardware & Circuits', desc: 'Semiconductors, diodes, BJT transistors, biasing, FETs, and Operational Amplifiers.', books: 'David A. Bell - Electronic Devices and Circuits' },
  { code: 'CSE260', title: 'Digital Logic Design', credits: 3, prereqs: [], category: 'Hardware & Architecture', desc: 'Boolean algebra, logic gates, combinational circuits, multiplexers, sequential flip-flops, and counters.', books: 'Ronald J. Tocci - Digital Systems' },
  { code: 'CSE310', title: 'Object Oriented Programming', credits: 3, prereqs: ['CSE111'], category: 'Core Software', desc: 'Advanced Java OOP concepts, inheritance, polymorphism, design patterns, and database persistence.', books: 'Grady Booch - Object Oriented Analysis' },
  { code: 'CSE320', title: 'Data Communications', credits: 3, prereqs: [], category: 'Networking', desc: 'Signal encoding, modulation, multiplexing, transmission media, and OSI reference model.', books: 'B. A. Forouzan - Data Communication & Networking' },
  { code: 'CSE321', title: 'Operating Systems', credits: 3, prereqs: ['CSE221'], category: 'Systems & Core', desc: 'Process synchronization, CPU scheduling, concurrency, deadlocks, virtual memory, and file systems.', books: 'Silberschatz & Galvin - Operating System Concepts' },
  { code: 'CSE330', title: 'Numerical Methods', credits: 3, prereqs: [], category: 'Applied Math', desc: 'Floating-point arithmetic, root finding, Gauss elimination, numerical integration, and differential equations.', books: 'S. B. Rao - Numerical Methods' },
  { code: 'CSE331', title: 'Automata and Computability', credits: 3, prereqs: ['CSE221'], category: 'Theoretical CS', desc: 'Finite automata, regular languages, context-free grammars, Turing machines, and undecidability.', books: 'Lewis & Papadimitriou - Elements of Computation' },
  { code: 'CSE340', title: 'Computer Architecture', credits: 3, prereqs: ['CSE260'], category: 'Hardware & Architecture', desc: 'RISC architecture, instruction set design, pipelining, memory hierarchy, and cache optimization.', books: 'Patterson & Hennessy - Computer Organization' },
  { code: 'CSE341', title: 'Microprocessors', credits: 3, prereqs: ['CSE260'], category: 'Hardware & Architecture', desc: '8086 microprocessor architecture, assembly programming, interrupt handling, and bus interfacing.', books: 'Y. Liu & G. A. Gibson - Microcomputer Systems' },
  { code: 'CSE350', title: 'Digital Electronics & Pulse', credits: 3, prereqs: ['CSE251', 'CSE260'], category: 'Hardware & Circuits', desc: 'Logic families (TTL, CMOS), propagation delay, multivibrators, wave shaping, and timing circuits.', books: 'Jacob Millman - Microelectronics' },
  { code: 'CSE360', title: 'Computer Interfacing', credits: 3, prereqs: ['CSE341'], category: 'Hardware & Architecture', desc: 'I/O ports, transducers, stepper motors, sensor data acquisition, and peripheral interfacing.', books: 'Alan Clements - Microprocessor Interfacing' },
  { code: 'CSE370', title: 'Database Systems', credits: 3, prereqs: ['CSE221'], category: 'Core Software', desc: 'Relational database design, ER modeling, SQL querying, transactions, normalization, and ACID properties.', books: 'Elmasri & Navathe - Fundamentals of Database Systems' },
  { code: 'CSE391', title: 'Programming for the Internet', credits: 3, prereqs: ['CSE220'], category: 'Software & Web', desc: 'Full-stack client-server architecture, modern web technologies, DOM, APIs, and frameworks.', books: 'Web Technologies & Internet Architecture' },
  { code: 'CSE420', title: 'Compiler Design', credits: 3, prereqs: ['CSE221', 'CSE331'], category: 'Advanced Systems', desc: 'Lexical analysis, parsing algorithms, syntax trees, symbol tables, code generation, and optimization.', books: 'Aho, Lam, Sethi, Ullman - Compilers (Dragon Book)' },
  { code: 'CSE421', title: 'Computer Networks', credits: 3, prereqs: ['CSE320'], category: 'Networking', desc: 'TCP/IP architecture, routing algorithms (OSPF, BGP), congestion control, and network security.', books: 'U. D. Black - Computer Networks Protocols' },
  { code: 'CSE422', title: 'Artificial Intelligence', credits: 3, prereqs: ['CSE221'], category: 'Intelligent Systems', desc: 'Heuristic search, knowledge representation, game playing, rule chaining, inference, and machine learning.', books: 'Stuart Russell & Peter Norvig - AI: A Modern Approach' },
  { code: 'CSE427', title: 'Machine Learning', credits: 3, prereqs: ['CSE221'], category: 'Intelligent Systems', desc: 'Supervised/unsupervised learning, neural networks, decision trees, reinforcement learning, and SVMs.', books: 'Tom Mitchell - Machine Learning' },
  { code: 'CSE470', title: 'Software Engineering', credits: 3, prereqs: ['CSE220'], category: 'Software Design', desc: 'Software development lifecycle, Agile/Scrum, requirements engineering, UML modeling, and testing.', books: 'Ian Sommerville - Software Engineering' },
  { code: 'CSE471', title: 'System Analysis and Design', credits: 3, prereqs: ['CSE370'], category: 'Software Design', desc: 'Data flow diagrams, ER modeling, enterprise workflow analysis, and real-time project design.', books: 'V. Rajaraman - Analysis and Design of Info Systems' }
];

const CoursePlanner = () => {
  // Completed courses state (pre-seeded with freshman starter)
  const [completedCourses, setCompletedCourses] = useState(() => {
    const saved = localStorage.getItem('user_completed_courses');
    return saved ? JSON.parse(saved) : ['CSE110', 'CSE230', 'CSE260'];
  });

  // Planned for next semester state
  const [plannedCourses, setPlannedCourses] = useState(() => {
    const saved = localStorage.getItem('user_planned_courses');
    return saved ? JSON.parse(saved) : ['CSE111', 'CSE250', 'CSE340'];
  });

  const [selectedCourseInfo, setSelectedCourseInfo] = useState(COURSE_CATALOG[0]);
  const [filterCategory, setFilterCategory] = useState('All');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('user_completed_courses', JSON.stringify(completedCourses));
  }, [completedCourses]);

  useEffect(() => {
    localStorage.setItem('user_planned_courses', JSON.stringify(plannedCourses));
  }, [plannedCourses]);

  // Toggle completed status
  const toggleCompleted = (code) => {
    if (completedCourses.includes(code)) {
      setCompletedCourses(completedCourses.filter(c => c !== code));
      // Remove from planned if uncompleted
      setPlannedCourses(plannedCourses.filter(c => c !== code));
    } else {
      setCompletedCourses([...completedCourses, code]);
      setPlannedCourses(plannedCourses.filter(c => c !== code));
    }
  };

  // Add/Remove from Next Semester plan
  const togglePlanned = (code) => {
    if (plannedCourses.includes(code)) {
      setPlannedCourses(plannedCourses.filter(c => c !== code));
    } else {
      if (plannedCourses.length >= 4) {
        alert('Recommended maximum is 4 courses (12 credits) per semester for a balanced workload!');
      }
      setPlannedCourses([...plannedCourses, code]);
    }
  };

  // Helper: Check if course prerequisites are satisfied
  const isPrereqMet = (course) => {
    if (!course.prereqs || course.prereqs.length === 0) return true;
    return course.prereqs.every(req => completedCourses.includes(req));
  };

  // Categorize courses
  const eligibleCourses = COURSE_CATALOG.filter(c => 
    !completedCourses.includes(c.code) && isPrereqMet(c)
  );

  const lockedCourses = COURSE_CATALOG.filter(c => 
    !completedCourses.includes(c.code) && !isPrereqMet(c)
  );

  const totalCreditsPlanned = plannedCourses.reduce((sum, code) => {
    const cr = COURSE_CATALOG.find(c => c.code === code);
    return sum + (cr?.credits || 3);
  }, 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookMarked size={28} color="#2563eb" /> Course Planning & Prerequisite Optimizer
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
            Avoid registration blocks by tracking prerequisites, unlocking eligible courses, and balancing semester workload.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>COMPLETED</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d' }}>{completedCourses.length * 3} Cr ({completedCourses.length})</div>
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>PLANNED NEXT</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1d4ed8' }}>{totalCreditsPlanned} Cr ({plannedCourses.length})</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Eligible & Recommended for Next Semester */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card 1: Next Semester Workload Builder */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#2563eb" /> Next Semester Recommended Schedule
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Balanced Target: 9 to 12 Credits (3–4 Courses)
                </span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: totalCreditsPlanned > 12 ? '#fef2f2' : '#f0fdf4', color: totalCreditsPlanned > 12 ? '#dc2626' : '#16a34a' }}>
                {totalCreditsPlanned} Credits {totalCreditsPlanned > 12 ? '(Overload)' : '(Balanced)'}
              </span>
            </div>

            {plannedCourses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                Click <b>"+ Add to Semester"</b> on any eligible course below to build your schedule!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plannedCourses.map(code => {
                  const cr = COURSE_CATALOG.find(c => c.code === code);
                  return (
                    <div key={code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '13px', color: '#2563eb' }}>{code}</span>
                        <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>{cr?.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>3 Cr</span>
                        <button
                          onClick={() => togglePlanned(code)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Remove from plan"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 2: Eligible Courses to Take (Prereqs Met) */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 14px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#16a34a" /> Eligible Courses ({eligibleCourses.length})
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px 0' }}>
              All prerequisites for these courses are satisfied. Ready to take next semester:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {eligibleCourses.map(course => (
                <div
                  key={course.code}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ cursor: 'pointer' }} onClick={() => setSelectedCourseInfo(course)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>{course.code}</span>
                      <span style={{ fontSize: '11px', color: '#16a34a', background: '#f0fdf4', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Prereq Met ✅</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#334155', marginTop: '2px' }}>{course.title}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => togglePlanned(course.code)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: plannedCourses.includes(course.code) ? '#1e293b' : '#2563eb',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {plannedCourses.includes(course.code) ? 'Added' : '+ Add to Semester'}
                    </button>
                    <button
                      onClick={() => toggleCompleted(course.code)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      title="Mark as Completed"
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Prerequisite Checker & Course Syllabus Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Course Details & Syllabus Card */}
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                  {selectedCourseInfo.category}
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  {selectedCourseInfo.code}: {selectedCourseInfo.title}
                </h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Credits: {selectedCourseInfo.credits}.0</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>Prerequisites:</h4>
              {selectedCourseInfo.prereqs.length === 0 ? (
                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>None (Open to all students)</span>
              ) : (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedCourseInfo.prereqs.map(req => {
                    const isMet = completedCourses.includes(req);
                    return (
                      <span
                        key={req}
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: isMet ? '#f0fdf4' : '#fef2f2',
                          color: isMet ? '#15803d' : '#b91c1c',
                          border: `1px solid ${isMet ? '#bbf7d0' : '#fecaca'}`
                        }}
                      >
                        {req} {isMet ? '✓ Passed' : '✗ Incomplete'}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>Course Syllabus:</h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                {selectedCourseInfo.desc}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>Suggested Books & Assessment:</h4>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                📚 {selectedCourseInfo.books}
              </p>
            </div>
          </div>

          {/* Locked Courses (Missing Prerequisites) */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#dc2626" /> Locked Courses ({lockedCourses.length})
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>
              These courses require completing earlier prerequisites first:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {lockedCourses.map(c => (
                <div
                  key={c.code}
                  onClick={() => setSelectedCourseInfo(c)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: '#fdf2f2',
                    borderRadius: '6px',
                    border: '1px solid #fee2e2',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#991b1b' }}>{c.code}</span>
                    <span style={{ fontSize: '12px', color: '#7f1d1d', marginLeft: '8px' }}>{c.title}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 600 }}>
                    Needs: {c.prereqs.filter(p => !completedCourses.includes(p)).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CoursePlanner;