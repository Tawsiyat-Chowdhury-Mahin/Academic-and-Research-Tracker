import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, BookOpen, CheckCircle, Plus, Trash2, 
  Sparkles, AlertCircle, RefreshCw, Layers
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/study-plans';

const StudyPlanner = () => {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [viewMode, setViewMode] = useState('Daily'); // 'Daily' or 'Monthly'

  // New task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    course: '',
    type: 'Revision',
    deadlineDate: '',
    estimatedHours: 2,
    priority: 'Medium'
  });

  const [availableHours, setAvailableHours] = useState(4);
  const [planTitle, setPlanTitle] = useState('My Semester Study Plan');

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPlans(data);
        setActivePlan(data[0]);
        setViewMode(data[0].viewMode || 'Daily');
        setAvailableHours(data[0].dailyAvailableHours || 4);
      }
    } catch (err) {
      console.error('Error loading study plans:', err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle adding a course/exam/assignment task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.course || !taskForm.deadlineDate) return;

    const newTask = {
      ...taskForm,
      _id: Date.now().toString(),
      completed: false
    };

    const updatedTasks = activePlan ? [...(activePlan.tasks || []), newTask] : [newTask];
    
    if (activePlan) {
      const updatedPlan = { ...activePlan, tasks: updatedTasks };
      setActivePlan(updatedPlan);
      savePlanToBackend(updatedPlan);
    } else {
      const newPlan = {
        planName: planTitle,
        viewMode: viewMode,
        dailyAvailableHours: availableHours,
        tasks: [newTask],
        schedule: []
      };
      savePlanToBackend(newPlan);
    }

    setTaskForm({
      title: '',
      course: '',
      type: 'Revision',
      deadlineDate: '',
      estimatedHours: 2,
      priority: 'Medium'
    });
  };

  // Automated Schedule Generator algorithm
  const generateSchedule = () => {
    if (!activePlan || !activePlan.tasks || activePlan.tasks.length === 0) return;

    const sortedTasks = [...activePlan.tasks].sort((a, b) => {
      // Prioritize High priority and earlier deadlines
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
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
        '09:30 PM - 11:00 PM'
      ];
      
      const maxSlots = Math.min(Math.ceil(availableHours / 2), timeSlots.length);
      for (let i = 0; i < maxSlots; i++) {
        const task = sortedTasks[i % sortedTasks.length];
        newSchedule.push({
          timeSlot: timeSlots[i],
          activity: `Focus Session: ${task.title}`,
          course: task.course,
          targetGoal: `Review core materials & practice problem sets for ${task.type}`,
          isDone: false
        });
      }
    } else {
      // Monthly roadmap breakdown
      newSchedule = sortedTasks.map((task, idx) => ({
        timeSlot: `Milestone Week ${(idx % 4) + 1} (${task.deadlineDate})`,
        activity: `${task.course}: ${task.title}`,
        course: task.course,
        targetGoal: `Complete ${task.estimatedHours} study hours before ${task.deadlineDate}`,
        isDone: task.completed || false
      }));
    }

    const updatedPlan = { ...activePlan, schedule: newSchedule, viewMode, dailyAvailableHours: availableHours };
    setActivePlan(updatedPlan);
    savePlanToBackend(updatedPlan);
  };

  // Toggle task / slot completion status
  const toggleScheduleSlot = (slotIdx) => {
    if (!activePlan) return;
    const updatedSchedule = [...activePlan.schedule];
    updatedSchedule[slotIdx].isDone = !updatedSchedule[slotIdx].isDone;
    const updatedPlan = { ...activePlan, schedule: updatedSchedule };
    setActivePlan(updatedPlan);
    savePlanToBackend(updatedPlan);
  };

  const toggleTaskCompletion = (taskId) => {
    if (!activePlan) return;
    const updatedTasks = activePlan.tasks.map(t => 
      t._id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedPlan = { ...activePlan, tasks: updatedTasks };
    setActivePlan(updatedPlan);
    savePlanToBackend(updatedPlan);
  };

  const deleteTask = (taskId) => {
    if (!activePlan) return;
    const updatedTasks = activePlan.tasks.filter(t => t._id !== taskId);
    const updatedPlan = { ...activePlan, tasks: updatedTasks };
    setActivePlan(updatedPlan);
    savePlanToBackend(updatedPlan);
  };

  // Sync to Backend
  const savePlanToBackend = async (planToSave) => {
    try {
      if (planToSave._id && !planToSave._id.startsWith('sample')) {
        await fetch(`${API_BASE}/${planToSave._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(planToSave)
        });
      } else {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(planToSave)
        });
        const saved = await res.json();
        setActivePlan(saved);
        fetchPlans();
      }
    } catch (err) {
      console.error('Error saving plan:', err);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={28} color="#2563eb" /> Study Planner & Schedule Generator
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>
            Organize daily study hours and align exam & assignment deadlines automatically.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Column: Add Deadlines & Study Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card 1: Add New Deadline / Exam */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color="#2563eb" /> Add Exam or Assignment
            </h3>
            
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Task / Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. Final Exam Prep, Lab Report 2"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CSE327"
                    value={taskForm.course}
                    onChange={(e) => setTaskForm({ ...taskForm, course: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={taskForm.type}
                    onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
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
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Deadline Date</label>
                  <input
                    type="date"
                    value={taskForm.deadlineDate}
                    onChange={(e) => setTaskForm({ ...taskForm, deadlineDate: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
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
                  marginTop: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: '600',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + Add to Deadline Queue
              </button>
            </form>
          </div>

          {/* Card 2: Daily Study Goal & Generator Trigger */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#2563eb" /> Daily Study Capacity
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <input
                type="range"
                min="1"
                max="10"
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#2563eb' }}>{availableHours} hrs/day</span>
            </div>

            <button
              onClick={generateSchedule}
              style={{
                width: '100%',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: '600',
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
              <Sparkles size={18} color="#38bdf8" /> Auto-Generate Schedule
            </button>
          </div>

          {/* Card 3: Active Deadlines List */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#334155' }}>
              Pending Deadlines ({activePlan?.tasks?.length || 0})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
              {(!activePlan?.tasks || activePlan.tasks.length === 0) && (
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>No exams or assignments added yet.</p>
              )}
              {activePlan?.tasks?.map(task => (
                <div key={task._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #edf2f7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task._id)}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {task.course} • Due: {task.deadlineDate}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTask(task._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Generated Personalized Schedule */}
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                {viewMode === 'Daily' ? 'Today’s Personalized Study Timeline' : 'Monthly Academic Roadmap'}
              </h2>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {activePlan?.schedule?.filter(s => s.isDone).length || 0} of {activePlan?.schedule?.length || 0} sessions completed
              </span>
            </div>
            <button
              onClick={generateSchedule}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              <RefreshCw size={14} /> Recalculate
            </button>
          </div>

          {/* Schedule slots list */}
          {(!activePlan?.schedule || activePlan.schedule.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <Layers size={48} style={{ margin: '0 auto 12px auto', strokeWidth: 1.5 }} />
              <p style={{ fontSize: '16px', fontWeight: 600 }}>No schedule generated yet</p>
              <p style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto' }}>
                Add your upcoming courses and exams on the left, then click <b>Auto-Generate Schedule</b>.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activePlan.schedule.map((slot, index) => (
                <div
                  key={index}
                  onClick={() => toggleScheduleSlot(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: slot.isDone ? '#bbf7d0' : '#e2e8f0',
                    background: slot.isDone ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ marginTop: '2px' }}>
                    <CheckCircle
                      size={22}
                      color={slot.isDone ? '#16a34a' : '#cbd5e1'}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                        {slot.timeSlot}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                        {slot.course}
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: slot.isDone ? '#15803d' : '#1e293b', textDecoration: slot.isDone ? 'line-through' : 'none' }}>
                      {slot.activity}
                    </div>
                    {slot.targetGoal && (
                      <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
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