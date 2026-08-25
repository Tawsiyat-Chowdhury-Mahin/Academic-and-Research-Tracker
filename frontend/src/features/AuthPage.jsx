import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  GraduationCap, 
  Building, 
  Award,
  ArrowRight,
  BookOpen,
  Briefcase
} from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: '',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState('');

  const { login, register, quickDemoLogin, user, logout, authError } = useAuth();
  const navigate = useNavigate();

  // Reset form inputs whenever user logs out or returns to login page
  useEffect(() => {
    if (!user) {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: 'Computer Science & Engineering',
        studentId: '',
        bio: ''
      });
      setLocalMessage('');
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      department: 'Computer Science & Engineering',
      studentId: '',
      bio: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalMessage('');

    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        resetForm();
        setLocalMessage('Logged in successfully! Entering portal...');
        setTimeout(() => {
          navigate('/');
        }, 600);
      }
    } else {
      const res = await register(formData);
      if (res.success) {
        resetForm();
        setLocalMessage('Account registered successfully! Entering portal...');
        setTimeout(() => {
          navigate('/');
        }, 600);
      }
    }
    setSubmitting(false);
  };

  const handleQuickLogin = async (role) => {
    setSubmitting(true);
    setLocalMessage('');
    resetForm();
    const res = await quickDemoLogin(role);
    if (res.success) {
      setLocalMessage(`Signed in as Demo ${role === 'student' ? 'Student' : 'Faculty'}! Entering portal...`);
      setTimeout(() => {
        navigate('/');
      }, 600);
    }
    setSubmitting(false);
  };

  // If user is already authenticated and visits Profile page
  if (user) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', width: '100%' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'var(--color-primary-gradient)', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 20px',
            fontSize: '2rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-glow)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <h2 style={{ fontSize: '1.9rem', marginBottom: '6px' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem' }}>{user.email}</p>
          
          <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '28px' }}>
            <span className="badge badge-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <GraduationCap size={14} /> {user.role}
            </span>
            <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '6px 14px', fontSize: '0.8rem' }}>
              {user.department || 'CSE Dept'}
            </span>
          </div>

          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '28px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>DEPARTMENT</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user.department || 'Computer Science'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>STUDENT / ID</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user.studentId || 'N/A'}</p>
              </div>
            </div>
            {user.bio && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACADEMIC BIO</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{user.bio}</p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{ flex: 1 }}>
              Go to Dashboard <ArrowRight size={16} />
            </button>
            <button onClick={logout} className="btn btn-secondary" style={{ color: 'var(--color-danger)' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 20%, #eff6ff 0%, #f8fafc 60%, #e2e8f0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient background shapes */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(37, 99, 235, 0.08)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '15%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.08)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      {/* Main Centered Login Box */}
      <div style={{ 
        maxWidth: '520px', 
        width: '100%', 
        position: 'relative', 
        zIndex: 10 
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '16px', 
            background: 'var(--color-primary-gradient)', 
            color: '#ffffff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 14px',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Academic & Research Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Sign in to access your research, resumes, and career tools.
          </p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '18px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              1-Click Demo Login (Instant Access):
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('student')} 
              className="btn btn-secondary btn-sm" 
              style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600 }}
              disabled={submitting}
            >
              <User size={14} style={{ color: 'var(--color-primary)' }} /> Demo Student
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('faculty')} 
              className="btn btn-secondary btn-sm" 
              style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600 }}
              disabled={submitting}
            >
              <Award size={14} style={{ color: '#6366f1' }} /> Demo Faculty
            </button>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="card" style={{ 
          padding: '32px 30px', 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)'
        }}>
          {/* Segmented Pill Tabs */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: 'var(--bg-tertiary)', 
            padding: '5px', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '24px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={() => { setIsLogin(true); setLocalMessage(''); resetForm(); }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isLogin ? '#ffffff' : 'transparent',
                color: isLogin ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isLogin ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setLocalMessage(''); resetForm(); }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: !isLogin ? '#ffffff' : 'transparent',
                color: !isLogin ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <UserPlus size={16} /> Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {(authError || localMessage) && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: localMessage ? 'var(--color-success-light)' : 'var(--color-danger-light)',
              color: localMessage ? 'var(--color-success)' : 'var(--color-danger)',
              border: `1px solid ${localMessage ? '#a7f3d0' : '#fecaca'}`
            }}>
              {localMessage ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{localMessage || authError}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {!isLogin && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="e.g. Jane Doe"
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">University Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  autoComplete="new-password"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="student@university.edu"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="grid-2" style={{ gap: '14px', marginBottom: 0 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="form-select"
                    >
                      <option value="student">Student</option>
                      <option value="researcher">Researcher</option>
                      <option value="faculty">Faculty / Advisor</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Student ID</label>
                    <input
                      type="text"
                      autoComplete="off"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="form-input"
                      placeholder="e.g. 2026-CSE-01"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    autoComplete="off"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px', height: '48px', fontSize: '1rem', fontWeight: 700 }}
              disabled={submitting}
            >
              {submitting ? 'Please wait...' : isLogin ? 'Sign In to Portal' : 'Create Your Account'}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Academic & Research Tracker • CSE Project © 2026
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
