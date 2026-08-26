import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Briefcase, Mail, Plus, Send, RefreshCw, Sparkles, Check, X, Copy, ExternalLink } from 'lucide-react';

// URL Sanitizer helper to guarantee all links open externally
const ensureValidUrl = (url, type = 'general') => {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  let str = url.trim();
  if (type === 'github') {
    if (!str.includes('github.com')) {
      str = `https://github.com/${str.replace(/^@/, '')}`;
    } else if (!/^https?:\/\//i.test(str)) {
      str = `https://${str}`;
    }
  } else if (type === 'linkedin') {
    if (!str.includes('linkedin.com')) {
      str = `https://linkedin.com/in/${str.replace(/^@/, '')}`;
    } else if (!/^https?:\/\//i.test(str)) {
      str = `https://${str}`;
    }
  } else if (!/^https?:\/\//i.test(str)) {
    str = `https://${str}`;
  }
  return str;
};

const AlumniNetworking = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState({ keyword: '', company: '', graduationYear: '', degree: 'All' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedEmailId, setCopiedEmailId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    degree: 'B.Sc. in Computer Science and Engineering',
    company: '',
    role: '',
    skills: '',
    email: '',
    linkedin: '',
    github: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mentorship Modal states
  const [activeAlumnus, setActiveAlumnus] = useState(null); // alumnus for whom request is being sent
  const [mentorshipData, setMentorshipData] = useState({ topic: 'Career Guidance', note: '' });
  const [sentRequests, setSentRequests] = useState([]); // Array of alumni ids to show "Request Sent" badge

  const API_URL = 'http://localhost:5000/api/alumni';

  useEffect(() => {
    fetchAlumni();
    // Load sent requests from local storage
    const savedRequests = JSON.parse(localStorage.getItem('sent_mentorship_requests') || '[]');
    setSentRequests(savedRequests);
  }, []);

  const fetchAlumni = async (filters = search) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.graduationYear) queryParams.append('graduationYear', filters.graduationYear);
      if (filters.degree && filters.degree !== 'All') queryParams.append('degree', filters.degree);

      const res = await fetch(`${API_URL}?${queryParams.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAlumni(data);
      } else {
        setAlumni([]);
      }
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const handleReset = () => {
    const emptySearch = { keyword: '', company: '', graduationYear: '', degree: 'All' };
    setSearch(emptySearch);
    fetchAlumni(emptySearch);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formattedData = {
      ...formData,
      graduationYear: Number(formData.graduationYear),
      linkedin: ensureValidUrl(formData.linkedin, 'linkedin'),
      github: ensureValidUrl(formData.github, 'github'),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      });

      if (res.ok) {
        setMessage('Alumni profile added successfully!');
        setShowAddForm(false);
        setFormData({
          name: '',
          graduationYear: '',
          degree: 'B.Sc. in Computer Science and Engineering',
          company: '',
          role: '',
          skills: '',
          email: '',
          linkedin: '',
          github: '',
          bio: ''
        });
        fetchAlumni();
      } else {
        const error = await res.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (err) {
      setMessage('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMentorship = (e) => {
    e.preventDefault();
    if (!activeAlumnus) return;

    // Save sent state in local storage
    const updated = [...sentRequests, activeAlumnus._id];
    setSentRequests(updated);
    localStorage.setItem('sent_mentorship_requests', JSON.stringify(updated));

    // Show temporary success feedback
    alert(`Mentorship request successfully sent to ${activeAlumnus.name} regarding "${mentorshipData.topic}"! They will be notified via their email: ${activeAlumnus.email}`);
    setActiveAlumnus(null);
    setMentorshipData({ topic: 'Career Guidance', note: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1>Alumni Networking & Mentorship</h1>
          <p>Connect with BRAC University faculty, researchers, and alumni for project consultations, career insights, and 1-on-1 mentorship.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
        >
          {showAddForm ? 'View Directory' : <><Plus size={16} /> Join Alumni Directory</>}
        </button>
      </div>

      {message && (
        <div className="card" style={{ 
          padding: '12px 20px', 
          backgroundColor: message.includes('Error') ? 'var(--color-danger-light)' : 'var(--color-success-light)',
          color: message.includes('Error') ? 'var(--color-danger)' : 'var(--color-success)',
          borderLeft: `4px solid ${message.includes('Error') ? 'var(--color-danger)' : 'var(--color-success)'}`,
          fontWeight: 500
        }}>
          {message}
        </div>
      )}

      {/* Add Alumni Form view */}
      {showAddForm ? (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <h2 className="card-title">Join Alumni Directory</h2>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="grid-2" style={{ gap: '15px', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. John Doe" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Graduation Year</label>
                <input 
                  type="number" 
                  value={formData.graduationYear} 
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. 2023" 
                  required 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Degree Obtained</label>
              <select 
                value={formData.degree} 
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })} 
                className="form-select"
              >
                <option value="B.Sc. in Computer Science and Engineering">B.Sc. in Computer Science and Engineering (CSE)</option>
                <option value="B.Sc. in Computer Science">B.Sc. in Computer Science (CS)</option>
                <option value="B.Sc. in Electronic and Communication Engineering">B.Sc. in Electronic & Communication Engineering (ECE)</option>
                <option value="M.Sc. in Computer Science and Engineering">M.Sc. in Computer Science and Engineering (MCSE)</option>
                <option value="M.Sc. in Data Science">M.Sc. in Data Science</option>
              </select>
            </div>

            <div className="grid-2" style={{ gap: '15px', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current Organization / University</label>
                <input 
                  type="text" 
                  value={formData.company} 
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. BRAC University / Google" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current Role / Title</label>
                <input 
                  type="text" 
                  value={formData.role} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. Lecturer / Software Engineer" 
                  required 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Skills & Focus Areas (comma separated)</label>
              <input 
                type="text" 
                value={formData.skills} 
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })} 
                className="form-input" 
                placeholder="Artificial Intelligence, Software Architecture, Machine Learning" 
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="form-input" 
                placeholder="name@bracu.ac.bd" 
                required 
              />
            </div>

            <div className="grid-2" style={{ gap: '15px', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  LinkedIn Profile URL or Username
                </label>
                <input 
                  type="text" 
                  value={formData.linkedin} 
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. linkedin.com/in/username or username" 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#24292e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub Profile URL or Username
                </label>
                <input 
                  type="text" 
                  value={formData.github} 
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. github.com/username or username" 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Short Bio / Mentorship Offerings</label>
              <textarea 
                value={formData.bio} 
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                className="form-textarea" 
                placeholder="Share about your journey or how you can assist students..." 
                required 
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Send size={16} /> Register Profile
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Directory Grid view */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filters Bar */}
          <form onSubmit={handleSearch} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', padding: '16px 24px' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '180px', marginBottom: 0 }}>
              <label className="form-label">Keyword Search</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={search.keyword} 
                  onChange={(e) => setSearch({ ...search, keyword: e.target.value })} 
                  placeholder="Search name, skills, or role..." 
                  className="form-input" 
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ width: '170px', marginBottom: 0 }}>
              <label className="form-label">Organization</label>
              <input 
                type="text" 
                value={search.company} 
                onChange={(e) => setSearch({ ...search, company: e.target.value })} 
                placeholder="e.g. BRAC University" 
                className="form-input" 
              />
            </div>

            <div className="form-group" style={{ width: '130px', marginBottom: 0 }}>
              <label className="form-label">Grad Year</label>
              <input 
                type="number" 
                value={search.graduationYear} 
                onChange={(e) => setSearch({ ...search, graduationYear: e.target.value })} 
                placeholder="e.g. 2023" 
                className="form-input" 
              />
            </div>

            <div className="form-group" style={{ width: '200px', marginBottom: 0 }}>
              <label className="form-label">Degree</label>
              <select 
                value={search.degree} 
                onChange={(e) => setSearch({ ...search, degree: e.target.value })} 
                className="form-select"
              >
                <option value="All">All Degrees</option>
                <option value="Computer Science and Engineering">B.Sc. in CSE</option>
                <option value="Computer Science">B.Sc. in CS</option>
                <option value="Electronic and Communication">B.Sc. in ECE</option>
                <option value="M.Sc.">M.Sc. Degrees</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                <Search size={16} /> Filter
              </button>
              <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ height: '42px' }} title="Reset filters">
                <RefreshCw size={16} />
              </button>
            </div>
          </form>

          {/* Directory Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing {alumni.length} BRAC University Alumni & Faculty Profiles
            </span>
          </div>

          {/* Alumni Profiles Grid */}
          {loading ? (
            <p>Loading directory...</p>
          ) : alumni.length === 0 ? (
            <p style={{ fontStyle: 'italic' }}>No alumni match your search query.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {alumni.map(alumnus => (
                <div key={alumnus._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between', position: 'relative' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '2px', paddingRight: '15px' }}>{alumnus.name}</h3>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Class of {alumnus.graduationYear}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      <GraduationCap size={15} /> <span>{alumnus.degree}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      <Briefcase size={15} /> <span>{alumnus.role} at <span style={{ color: 'var(--color-primary)' }}>{alumnus.company}</span></span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      backgroundColor: 'var(--bg-primary)', 
                      padding: '6px 10px', 
                      borderRadius: '6px', 
                      border: '1px solid var(--border-color)',
                      marginBottom: '12px',
                      fontSize: '0.82rem'
                    }}>
                      <a href={`mailto:${alumnus.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Mail size={14} /> {alumnus.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(alumnus.email);
                          setCopiedEmailId(alumnus._id);
                          setTimeout(() => setCopiedEmailId(null), 2000);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 6px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        title="Copy email address"
                      >
                        {copiedEmailId === alumnus._id ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                        {copiedEmailId === alumnus._id ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '12px' }}>
                      "{alumnus.bio}"
                    </p>
                  </div>

                  <div>
                    {/* Skills tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                      {alumnus.skills.map((skill, idx) => (
                        <span key={idx} className="badge badge-primary" style={{ fontSize: '0.65rem', textTransform: 'none' }}>{skill}</span>
                      ))}
                    </div>

                    {/* Contact & Mentorship Button details */}
                    <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', flexWrap: 'wrap' }}>
                      <a href={`mailto:${alumnus.email}`} className="btn btn-secondary btn-sm" style={{ flex: '1 1 28%', display: 'inline-flex', gap: '4px', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>
                        <Mail size={12} /> Email
                      </a>
                      {alumnus.linkedin && (
                        <a href={ensureValidUrl(alumnus.linkedin, 'linkedin')} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ flex: '1 1 28%', display: 'inline-flex', gap: '4px', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn
                        </a>
                      )}
                      {alumnus.github && (
                        <a href={ensureValidUrl(alumnus.github, 'github')} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ flex: '1 1 28%', display: 'inline-flex', gap: '4px', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#24292e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub
                        </a>
                      )}
                      
                      {sentRequests.includes(alumnus._id) ? (
                        <span className="btn btn-success btn-sm" style={{ flex: '1 1 100%', cursor: 'default', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', borderColor: 'transparent', display: 'inline-flex', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={14} /> Request Sent
                        </span>
                      ) : (
                        <button 
                          onClick={() => setActiveAlumnus(alumnus)} 
                          className="btn btn-primary btn-sm" 
                          style={{ flex: '1 1 100%', display: 'inline-flex', gap: '4px', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Sparkles size={13} /> Request Mentorship
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mentorship request popup dialog modal */}
      {activeAlumnus && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
            {/* Close button */}
            <button 
              onClick={() => setActiveAlumnus(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '10px', borderRadius: '50%', color: 'var(--color-primary)' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Request Mentorship</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>with {activeAlumnus.name} ({activeAlumnus.company})</p>
              </div>
            </div>

            <form onSubmit={handleSendMentorship} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mentorship Topic / Area</label>
                <select 
                  value={mentorshipData.topic} 
                  onChange={(e) => setMentorshipData({ ...mentorshipData, topic: e.target.value })}
                  className="form-select"
                >
                  <option value="Career Guidance">Career Guidance & Industry Transition</option>
                  <option value="Undergraduate Thesis Advice">Undergraduate Thesis / Paper Advice</option>
                  <option value="Software Architecture Consultation">Software Architecture & System Design</option>
                  <option value="Code Review & Portfolio">Code Review & Portfolio Evaluation</option>
                  <option value="Graduate Studies Abroad">Graduate Studies & Higher Education Abroad</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Introduce Yourself & Your Questions</label>
                <textarea 
                  value={mentorshipData.note}
                  onChange={(e) => setMentorshipData({ ...mentorshipData, note: e.target.value })}
                  placeholder={`Hi ${activeAlumnus.name}, I am a BRACU student interested in your work in ${activeAlumnus.skills ? activeAlumnus.skills[0] : 'tech'}. I would love 20 minutes to ask about...`}
                  className="form-textarea"
                  style={{ minHeight: '100px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'inline-flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={16} /> Send Mentorship Request
                </button>
                <button type="button" onClick={() => setActiveAlumnus(null)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniNetworking;
