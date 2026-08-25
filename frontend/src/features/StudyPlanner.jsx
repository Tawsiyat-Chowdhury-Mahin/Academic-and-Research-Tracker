import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, BookOpen, CheckCircle, Plus, Trash2, 
  Sparkles, Layers, RefreshCw, AlertCircle, Check
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/study-plans';

const DEFAULT_PLAN = {
  _id: 'default-study-plan',
  planName: 'My Academic Study Plan',
  viewMode: 'Daily',
  dailyAvailableHours: 4,
  tasks: [
    {
      _id: 'task-1',
      title: 'Midterm Preparation',
      course: 'CSE327',
      type: 'Exam',
      deadlineDate: '2026-04-10',
      estimatedHours: 6,
      priority: 'High',
      completed: false
    },
    {
      _id: 'task-2',
      title: 'Project Sprint Report',
      course: 'CSE411',
      type: 'Assignment',
      deadlineDate: '2026-04-15',
      estimatedHours: 4,
      priority: 'Medium',
      completed: false
    }
  ],
  schedule: [
    {
      timeSlot: '08:30 AM - 10:30 AM',
      activity: 'CSE327: Focus Session - Midterm Preparation',
      course: 'CSE327',
      targetGoal: 'Review core materials and lecture notes',
      isDone: false
    },
    {
      timeSlot: '11:00 AM - 01:00 PM',
      activity: 'CSE411: Focus Session - Project Sprint Report',
      course: 'CSE411',
      targetGoal: 'Draft assignment sections & prepare diagrams',
      isDone: true
    }
  ]
};

const StudyPlanner = () => {
  const [activePlan, setActivePlan] = useState(() => {
    const saved = localStorage.getItem('study_planner_state');
    return saved ? JSON.parse(saved) : DEFAULT_PLAN;
  });

  const [viewMode, setViewMode] = useState(activePlan?.viewMode || 'Daily');
  const [availableHours, setAvailableHours] = useState(activePlan?.dailyAvailableHours || 4);

  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [category, setCategory] = useState('Revision');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch from backend on load (optional sync)
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setActivePlan(data[0]);
          setViewMode(data[0].viewMode || 'Daily');
          setAvailableHours(data[0].dailyAvailableHours || 4);
          localStorage.setItem('study_planner_state', JSON.stringify(data[0]));
        }
      } catch (err) {
        // Backend offline or route not loaded yet — working smoothly with local state
      }
    };
    fetchBackendData();
  }, []);

  // Save changes helper (Local + Backend sync)
  const persistPlan = (updatedPlan) => {
    setActivePlan(updatedPlan);
    localStorage.setItem('study_planner_state', JSON.stringify(updatedPlan));

    fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlan)
    }).catch(() => {
      // Gracefully handles if backend is offline
    });
  };

  // Add Task to Queue
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !courseCode.trim() || !deadlineDate) {
      alert('Please fill in Title, Course Code, and Deadline Date.');
      return;
    }

    const newTask = {
      _id: 'task_' + Date.now(),
      title: taskTitle.trim(),
      course: courseCode.trim(),
      type: category,
      deadlineDate: deadlineDate,
      estimatedHours: 2,
      priority: priority,
      completed: false
    };

    const currentTasks = activePlan?.tasks || [];
    const updatedPlan = {
      ...activePlan,
      tasks: [newTask, ...currentTasks]
    };

    persistPlan(updatedPlan);

    // Reset Form
    setTaskTitle('');
    setCourseCode('');
    setDeadlineDate('');
    setCategory('Revision');
    setPriority('Medium');

    setSuccessMessage('Added to Queue!');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  // Generate Personalized Schedule
  const generateSchedule = () => {
    const tasks = activePlan?.tasks || [];
    if (tasks.length === 0) {
      alert('Please add at least one exam or assignment to generate a schedule.');
      return;
    }

    // Sort by priority and deadline
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    const sortedTasks = [...tasks].sort((a, b) => {
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(a.deadlineDate) - new Date(b.deadlineDate);
    });

    let newSchedule = [];
    if (viewMode === 'Daily') {
      const timeSlots = [
        '08:30 AM - 10:30 AM',
        '11:00 AM - 01:00 PM',
        '03:00 PM - 05:00 PM',
        '07:00 PM - 09:00 PM',
        '09:30 PM - 11:30 PM'
      ];

      const maxSlots = Math.min(Math.ceil(availableHours / 2), timeSlots.length);
      for (let i = 0; i < maxSlots; i++) {
        const currentTask = sortedTasks[i % sortedTasks.length];
        newSchedule.push({
          timeSlot: timeSlots[i],
          activity: `${currentTask.course}: Focus Session - ${currentTask.title}`,
          course: currentTask.course,
          targetGoal: `Prepare ${currentTask.type} notes & solve practice sets`,
          isDone: false
        });
      }
    } else {
      newSchedule = sortedTasks.map((t, idx) => ({
        timeSlot: `Milestone Week ${(idx % 4) + 1} (Due: ${t.deadlineDate})`,
        activity: `${t.course}: Complete ${t.title}`,
        course: t.course,
        targetGoal: `Dedicate ${availableHours * 3} hours before ${t.deadlineDate}`,
        isDone: t.completed || false
      }));
    }

    const updatedPlan = {
      ...activePlan,
      viewMode,
      dailyAvailableHours: availableHours,
      schedule: newSchedule
    };

    persistPlan(updatedPlan);
  };

  // Toggle Schedule Slot
  const toggleSlot = (index) => {
    const updatedSchedule = [...(activePlan?.schedule || [])];
    if (!updatedSchedule[index]) return;
    updatedSchedule[index].isDone = !updatedSchedule[index].isDone;

    persistPlan({
      ...activePlan,
      schedule: updatedSchedule
    });
  };

  // Toggle Task Completion
  const toggleTask = (taskId) => {
    const updatedTasks = (activePlan?.tasks || []).map(t => 
      t._id === taskId ? { ...t, completed: !t.completed } : t
    );
    persistPlan({
      ...activePlan,
      tasks: updatedTasks
    });
  };

  // Delete Task
  const deleteTask = (taskId) => {
    const updatedTasks = (activePlan?.tasks || []).filter(t => t._id !== taskId);
    persistPlan({
      ...activePlan,
      tasks: updatedTasks
    });
  };

  const tasksList = activePlan?.tasks || [];
  const scheduleList = activePlan?.schedule || [];
  const completedSlots = scheduleList.filter(s => s.isDone).length;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={26} color="#2563eb" /> Study Planner & Schedule Generator
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
            Create personalized study schedules based on courses, exams, and assignment deadlines.
          </p>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => { setViewMode('Daily'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background: viewMode === 'Daily' ? '#ffffff' : 'transparent',
              color: viewMode === 'Daily' ? '#2563eb' : '#64748b',
              boxShadow: viewMode === 'Daily' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Daily View
          </button>
          <button
            type="button"
            onClick={() => { setViewMode('Monthly'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background: viewMode === 'Monthly' ? '#ffffff' : 'transparent',
              color: viewMode === 'Monthly' ? '#2563eb' : '#64748b',
              boxShadow: viewMode === 'Monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Monthly Roadmap
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Form Card */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="#2563eb" /> Add Exam / Assignment
            </h3>

            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Midterm Exam Prep, Lab Report 2"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CSE327"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="Exam">Exam</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Revision">Revision</option>
                    <option value="Lecture Prep">Lecture Prep</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Deadline Date</label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '11px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {successMessage ? <><Check size={16} /> {successMessage}</> : '+ Add to Queue'}
              </button>
            </form>
          </div>

          {/* Daily Study Capacity & Auto-Generate */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#2563eb" /> Daily Study Target
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <input
                type="range"
                min="1"
                max="10"
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                style={{ flex: 1, cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#2563eb', minWidth: '70px', textAlign: 'right' }}>
                {availableHours} hrs/day
              </span>
            </div>

            <button
              type="button"
              onClick={generateSchedule}
              style={{
                width: '100%',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} color="#38bdf8" /> Auto-Generate Schedule
            </button>
          </div>

          {/* Added Deadlines Queue List */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#334155' }}>
              Added Deadlines ({tasksList.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {tasksList.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>No deadlines added yet.</p>
              ) : (
                tasksList.map(task => (
                  <div 
                    key={task._id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px 12px', 
                      background: '#f8fafc', 
                      borderRadius: '6px', 
                      border: '1px solid #edf2f7' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        onChange={() => toggleTask(task._id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: task.completed ? '#94a3b8' : '#1e293b', textDecoration: task.completed ? 'line-through' : 'none' }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          <span style={{ fontWeight: 600, color: '#2563eb' }}>{task.course}</span> • Due: {task.deadlineDate} • <span style={{ color: task.priority === 'High' ? '#dc2626' : '#d97706' }}>{task.priority} Priority</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => deleteTask(task._id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      title="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Schedule */}
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                {viewMode === 'Daily' ? 'Today’s Study Timeline' : 'Monthly Academic Roadmap'}
              </h2>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {completedSlots} of {scheduleList.length} sessions completed
              </span>
            </div>
            <button
              type="button"
              onClick={generateSchedule}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '7px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#334155' }}
            >
              <RefreshCw size={14} /> Recalculate
            </button>
          </div>

          {scheduleList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <Layers size={48} style={{ margin: '0 auto 12px auto', strokeWidth: 1.5, color: '#cbd5e1' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#475569', margin: '0 0 6px 0' }}>No schedule generated yet</p>
              <p style={{ fontSize: '13px', maxWidth: '340px', margin: '0 auto', color: '#64748b' }}>
                Add your upcoming courses and exams on the left, then click <b>Auto-Generate Schedule</b>.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scheduleList.map((slot, index) => (
                <div
                  key={index}
                  onClick={() => toggleSlot(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: slot.isDone ? '#86efac' : '#e2e8f0',
                    background: slot.isDone ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ marginTop: '2px' }}>
                    <CheckCircle
                      size={20}
                      color={slot.isDone ? '#16a34a' : '#cbd5e1'}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                        {slot.timeSlot}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                        {slot.course}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: slot.isDone ? '#15803d' : '#1e293b', textDecoration: slot.isDone ? 'line-through' : 'none' }}>
                      {slot.activity}
                    </div>
                    {slot.targetGoal && (
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                        🎯 {slot.targetGoal}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;