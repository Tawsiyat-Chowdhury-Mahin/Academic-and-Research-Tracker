import React, { useState } from 'react';
import { 
  Clock, Calendar, BookOpen, MapPin, User, Plus, 
  Trash2, Search, Filter, AlertCircle, Sparkles, CheckCircle2, CalendarDays
} from 'lucide-react';

// Official Academic Events Extracted Directly From BRACU Year Planner 2026 PDF
const ACADEMIC_CALENDAR_2026 = [
  // Spring 2026
  { date: '2026-01-31', title: 'Classes of Spring 2026 Begin', semester: 'Spring 2026', type: 'Academic', highlight: true },
  { date: '2026-02-04', title: 'Shab-e-Barat (Holiday)', semester: 'Spring 2026', type: 'Holiday' },
  { date: '2026-02-21', title: 'International Mother Language Day', semester: 'Spring 2026', type: 'Holiday' },
  { date: '2026-03-26', title: 'Independence Day (Holiday)', semester: 'Spring 2026', type: 'Holiday' },
  { date: '2026-03-29', title: 'Mid-Term Examinations Spring 2026 Begin', semester: 'Spring 2026', type: 'Exam', highlight: true },
  { date: '2026-04-04', title: 'Mid-Term Examinations Spring 2026 End', semester: 'Spring 2026', type: 'Exam' },
  { date: '2026-04-14', title: 'Pohela Boishakh / Bangla Naba Barsha', semester: 'Spring 2026', type: 'Holiday' },
  { date: '2026-05-01', title: 'May Day & Buddha Purnima', semester: 'Spring 2026', type: 'Holiday' },
  { date: '2026-05-10', title: 'Classes of Spring 2026 End', semester: 'Spring 2026', type: 'Academic' },
  { date: '2026-05-11', title: 'Exam Preparatory Recess (Spring 2026)', semester: 'Spring 2026', type: 'Academic' },
  { date: '2026-05-16', title: 'Final Examinations Spring 2026 Begin', semester: 'Spring 2026', type: 'Exam', highlight: true },
  { date: '2026-05-24', title: 'Final Examinations Spring 2026 End', semester: 'Spring 2026', type: 'Exam' },
  { date: '2026-05-25', title: 'Last Day of Grade Submission (Spring 2026)', semester: 'Spring 2026', type: 'Academic' },
  { date: '2026-05-27', title: 'Publication of Results (Spring 2026)', semester: 'Spring 2026', type: 'Result', highlight: true },
  { date: '2026-05-28', title: 'Eid-ul-Adha Vacation Begins', semester: 'Spring 2026', type: 'Holiday' },

  // Summer 2026
  { date: '2026-06-07', title: 'Classes of Summer 2026 Begin', semester: 'Summer 2026', type: 'Academic', highlight: true },
  { date: '2026-06-26', title: 'Ashura (Holiday)', semester: 'Summer 2026', type: 'Holiday' },
  { date: '2026-07-26', title: 'Mid-Term Examinations Summer 2026 Begin', semester: 'Summer 2026', type: 'Exam', highlight: true },
  { date: '2026-08-01', title: 'Mid-Term Examinations Summer 2026 End', semester: 'Summer 2026', type: 'Exam' },
  { date: '2026-08-05', title: 'July Mass Uprising Day (Holiday)', semester: 'Summer 2026', type: 'Holiday' },
  { date: '2026-08-23', title: 'Classes of Summer 2026 End', semester: 'Summer 2026', type: 'Academic' },
  { date: '2026-08-24', title: 'Exam Preparatory Recess (Summer 2026)', semester: 'Summer 2026', type: 'Academic' },
  { date: '2026-08-29', title: 'Final Examinations Summer 2026 Begin', semester: 'Summer 2026', type: 'Exam', highlight: true },
  { date: '2026-09-06', title: 'Final Examinations Summer 2026 End', semester: 'Summer 2026', type: 'Exam' },
  { date: '2026-09-09', title: 'Publication of Results (Summer 2026)', semester: 'Summer 2026', type: 'Result', highlight: true },

  // Fall 2026
  { date: '2026-09-20', title: 'Classes of Fall 2026 Begin', semester: 'Fall 2026', type: 'Academic', highlight: true },
  { date: '2026-09-26', title: 'Eid-e-Miladun Nabi (Holiday)', semester: 'Fall 2026', type: 'Holiday' },
  { date: '2026-10-20', title: 'Durga Puja / Bijoya Dashami (Holiday)', semester: 'Fall 2026', type: 'Holiday' },
  { date: '2026-11-08', title: 'Mid-Term Examinations Fall 2026 Begin', semester: 'Fall 2026', type: 'Exam', highlight: true },
  { date: '2026-11-14', title: 'Mid-Term Examinations Fall 2026 End', semester: 'Fall 2026', type: 'Exam' },
  { date: '2026-12-16', title: 'Victory Day (Holiday)', semester: 'Fall 2026', type: 'Holiday' },
  { date: '2026-12-20', title: 'Classes of Fall 2026 End', semester: 'Fall 2026', type: 'Academic' },
  { date: '2026-12-21', title: 'Exam Preparatory Recess (Fall 2026)', semester: 'Fall 2026', type: 'Academic' },
  { date: '2026-12-25', title: 'Christmas Day (Holiday)', semester: 'Fall 2026', type: 'Holiday' },
  { date: '2026-12-26', title: 'Final Examinations Fall 2026 Begin', semester: 'Fall 2026', type: 'Exam', highlight: true }
];

// Initial demo class routine schedule
const INITIAL_CLASSES = [
  { id: '1', day: 'Sunday', time: '08:00 AM - 09:20 AM', course: 'CSE327', title: 'Software Engineering', section: '02', room: 'UB07-04', instructor: 'Nazmul Islam', type: 'Lecture' },
  { id: '2', day: 'Sunday', time: '11:00 AM - 12:20 PM', course: 'CSE411', title: 'Database Systems', section: '01', room: 'UB02-12', instructor: 'Sadia Kazi', type: 'Lecture' },
  { id: '3', day: 'Tuesday', time: '08:00 AM - 09:20 AM', course: 'CSE327', title: 'Software Engineering', section: '02', room: 'UB07-04', instructor: 'Nazmul Islam', type: 'Lecture' },
  { id: '4', day: 'Tuesday', time: '11:00 AM - 12:20 PM', course: 'CSE411', title: 'Database Systems', section: '01', room: 'UB02-12', instructor: 'Sadia Kazi', type: 'Lecture' },
  { id: '5', day: 'Wednesday', time: '02:00 PM - 04:50 PM', course: 'CSE327L', title: 'Software Engineering Lab', section: '02', room: 'UB08-LAB3', instructor: 'Md. Tareq', type: 'Lab' },
  { id: '6', day: 'Thursday', time: '09:30 AM - 10:50 AM', course: 'MAT215', title: 'Complex Variables & Laplace', section: '04', room: 'UB03-08', instructor: 'Dr. Farhana', type: 'Lecture' }
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];

const ClassRoutine = () => {
  const [activeTab, setActiveTab] = useState('routine'); // 'routine' or 'calendar'
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('user_class_routine');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  // Calendar search & filter state
  const [calendarSearch, setCalendarSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');

  // Form state for adding new class
  const [classForm, setClassForm] = useState({
    day: 'Sunday',
    time: '08:00 AM - 09:20 AM',
    course: '',
    title: '',
    section: '01',
    room: '',
    instructor: '',
    type: 'Lecture'
  });

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!classForm.course || !classForm.room) return;

    const newClass = {
      id: Date.now().toString(),
      ...classForm
    };

    const updated = [...classes, newClass];
    setClasses(updated);
    localStorage.setItem('user_class_routine', JSON.stringify(updated));

    setClassForm({
      day: selectedDay,
      time: '08:00 AM - 09:20 AM',
      course: '',
      title: '',
      section: '01',
      room: '',
      instructor: '',
      type: 'Lecture'
    });
  };

  const handleDeleteClass = (id) => {
    const updated = classes.filter(c => c.id !== id);
    setClasses(updated);
    localStorage.setItem('user_class_routine', JSON.stringify(updated));
  };

  const filteredClasses = classes.filter(c => c.day === selectedDay);

  const filteredCalendar = ACADEMIC_CALENDAR_2026.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(calendarSearch.toLowerCase()) || item.date.includes(calendarSearch);
    const matchesSemester = selectedSemester === 'All' || item.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarDays size={28} color="#2563eb" /> Class Routine & Year Planner 2026
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
            Organize your weekly class timetable and track official BRACU 2026 academic events in one unified hub.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('routine')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'routine' ? '#ffffff' : 'transparent',
              color: activeTab === 'routine' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'routine' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Weekly Routine
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'calendar' ? '#ffffff' : 'transparent',
              color: activeTab === 'calendar' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Year Planner 2026 (PDF)
          </button>
        </div>
      </div>

      {activeTab === 'routine' ? (
        /* --- TAB 1: WEEKLY CLASS ROUTINE --- */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          
          {/* Left Form: Add Class */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="#2563eb" /> Add Class Slot
              </h3>

              <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Day</label>
                    <select
                      value={classForm.day}
                      onChange={(e) => setClassForm({ ...classForm, day: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    >
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Type</label>
                    <select
                      value={classForm.type}
                      onChange={(e) => setClassForm({ ...classForm, type: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    >
                      <option value="Lecture">Lecture</option>
                      <option value="Lab">Lab Session</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Time Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM - 09:20 AM"
                    value={classForm.time}
                    onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Course Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE327"
                      value={classForm.course}
                      onChange={(e) => setClassForm({ ...classForm, course: e.target.value })}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Section</label>
                    <input
                      type="text"
                      placeholder="e.g. 02"
                      value={classForm.section}
                      onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Room No.</label>
                    <input
                      type="text"
                      placeholder="e.g. UB07-04"
                      value={classForm.room}
                      onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Instructor Initial</label>
                    <input
                      type="text"
                      placeholder="e.g. NMI / Nazmul"
                      value={classForm.instructor}
                      onChange={(e) => setClassForm({ ...classForm, instructor: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '8px',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    padding: '10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  + Add to Routine
                </button>
              </form>
            </div>
          </div>

          {/* Right Area: Day Filter & Classes Schedule List */}
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            
            {/* Days Pill Bar */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '20px' }}>
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedDay === day ? '#2563eb' : '#cbd5e1',
                    background: selectedDay === day ? '#eff6ff' : '#ffffff',
                    color: selectedDay === day ? '#2563eb' : '#64748b',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {day} ({classes.filter(c => c.day === day).length})
                </button>
              ))}
            </div>

            {/* Schedule Cards for Selected Day */}
            <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 16px 0' }}>
              Classes for {selectedDay}
            </h3>

            {filteredClasses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                <Clock size={40} style={{ margin: '0 auto 10px auto', color: '#cbd5e1' }} />
                <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px 0', color: '#475569' }}>No classes scheduled for {selectedDay}</p>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Enjoy your free day or add a class on the left.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredClasses.map(c => (
                  <div
                    key={c.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        background: c.type === 'Lab' ? '#ecfdf5' : '#eff6ff',
                        color: c.type === 'Lab' ? '#10b981' : '#2563eb',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        minWidth: '70px'
                      }}>
                        {c.course}
                        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Sec {c.section}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                          {c.title || c.course}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px', fontSize: '12px', color: '#64748b' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} color="#2563eb" /> {c.time}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} color="#f59e0b" /> {c.room}
                          </span>
                          {c.instructor && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <User size={13} color="#64748b" /> {c.instructor}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteClass(c.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      title="Remove class"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      ) : (
        /* --- TAB 2: OFFICIAL BRACU YEAR PLANNER 2026 (PDF EXTRACTED) --- */
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder="Search exams, holidays, results (e.g. Mid-Term, Eid, Result)..."
                value={calendarSearch}
                onChange={(e) => setCalendarSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'Spring 2026', 'Summer 2026', 'Fall 2026'].map(sem => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: selectedSemester === sem ? '#2563eb' : '#cbd5e1',
                    background: selectedSemester === sem ? '#2563eb' : '#ffffff',
                    color: selectedSemester === sem ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Event Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {filteredCalendar.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: item.highlight ? '#eff6ff' : '#f8fafc',
                  border: '1px solid',
                  borderColor: item.highlight ? '#bfdbfe' : '#e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: item.type === 'Exam' ? '#fef2f2' : item.type === 'Holiday' ? '#fffbeb' : '#f0fdf4',
                      color: item.type === 'Exam' ? '#dc2626' : item.type === 'Holiday' ? '#d97706' : '#16a34a'
                    }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      {item.semester}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    {item.title}
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  textAlign: 'center',
                  minWidth: '70px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>
                    {new Date(item.date).toLocaleString('default', { month: 'short' })}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                    {new Date(item.date).getDate()}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default ClassRoutine;