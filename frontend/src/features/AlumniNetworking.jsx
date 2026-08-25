import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Briefcase, Mail, Plus, Send, RefreshCw, Sparkles, Check, X } from 'lucide-react';

const AlumniNetworking = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState({ keyword: '', company: '', graduationYear: '', degree: 'All' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    degree: 'B.Sc. in Computer Science',
    company: '',
    role: '',
    skills: '',
    email: '',
    linkedin: '',
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

  const handleClear = () => {
    const defaultSearch = { keyword: '', company: '', graduationYear: '', degree: 'All' };
    setSearch(defaultSearch);
    fetchAlumni(defaultSearch);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = {
        ...formData,
        graduationYear: Number(formData.graduationYear),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage('Alumni profile registered successfully!');
        setFormData({
          name: '',
          graduationYear: '',
          degree: 'B.Sc. in Computer Science',
          company: '',
          role: '',
          skills: '',
          email: '',
          linkedin: '',
          bio: ''
        });
        setShowAddForm(false);
        fetchAlumni();
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.message}`);
      }
    } catch (err) {
      setMessage('Failed to register alumni profile.');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('This will seed mock alumni data. Proceed?')) return;
    try {
      const res = await fetch(`${API_URL}/seed`, { method: 'POST' });
      if (res.ok) {
        fetchAlumni();
      }
    } catch (err) {
      console.error('Error seeding data:', err);
    }
  };

  // Mentorship submission
  const handleMentorshipSubmit = (e) => {
    e.preventDefault();
    if (!activeAlumnus) return;

    // Simulate sending email request and save into local state
    const updatedRequests = [...sentRequests, activeAlumnus._id];
    setSentRequests(updatedRequests);
    localStorage.setItem('sent_mentorship_requests', JSON.stringify(updatedRequests));

    setMessage(`Mentorship invitation on "${mentorshipData.topic}" successfully sent to ${activeAlumnus.name}!`);
    setActiveAlumnus(null);
    setMentorshipData({ topic: 'Career Guidance', note: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1>Alumni Networking</h1>
          <p>Connect with university alumni, seek mentorship, and look up career journeys.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSeed} className="btn btn-secondary" title="Reset and seed default alumni">
            <RefreshCw size={16} /> Seed Alumni
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            <Plus size={16} /> {showAddForm ? 'View Directory' : 'Join Directory'}
          </button>
        </div>
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

      {showAddForm ? (
        /* Register Alumni Profile Form */
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h2 className="card-title">Join Alumni Directory</h2>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="grid-2" style={{ gap: '15px', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. Jane Doe" 
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
                  placeholder="e.g. 2024" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Degree Earned</label>
              <select 
                value={formData.degree} 
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })} 
                className="form-select"
              >
                <option value="B.Sc. in Computer Science">B.Sc. in Computer Science</option>
                <option value="B.Sc. in Software Engineering">B.Sc. in Software Engineering</option>
                <option value="M.Sc. in Computer Science">M.Sc. in Computer Science</option>
                <option value="M.Sc. in Data Science">M.Sc. in Data Science</option>
              </select>
            </div>

            <div className="grid-2" style={{ gap: '15px', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current Company</label>
                <input 
                  type="text" 
                  value={formData.company} 
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. Microsoft" 
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
                  placeholder="e.g. Software Engineer" 
                  required 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Skills (comma separated)</label>
              <input 
                type="text" 
                value={formData.skills} 
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })} 
                className="form-input" 
                placeholder="React, Azure, Python, Deep Learning" 
                required 
              />
            </div>

            <div className="grid-2" style={{ gap: '15px', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="form-input" 
                  placeholder="alumni@domain.com" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">LinkedIn URL</label>
                <input 
                  type="text" 
                  value={formData.linkedin} 
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} 
                  className="form-input" 
                  placeholder="https://linkedin.com/in/profile" 
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
              <label className="form-label">Keywords / Skills</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={search.keyword} 
                  onChange={(e) => setSearch({ ...search, keyword: e.target.value })} 
                  className="form-input" 
                  style={{ paddingLeft: '36px' }} 
                  placeholder="Name, role, skill..." 
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
              <label className="form-label">Company</label>
              <input 
                type="text" 
                value={search.company} 
                onChange={(e) => setSearch({ ...search, company: e.target.value })} 
                className="form-input" 
                placeholder="Google, stripe..." 
              />
            </div>

            <div className="form-group" style={{ width: '120px', marginBottom: 0 }}>
              <label className="form-label">Grad Year</label>
              <input 
                type="number" 
                value={search.graduationYear} 
                onChange={(e) => setSearch({ ...search, graduationYear: e.target.value })} 
                className="form-input" 
                placeholder="2024" 
              />
            </div>

            <div className="form-group" style={{ width: '180px', marginBottom: 0 }}>
              <label className="form-label">Degree Filter</label>
              <select 
                value={search.degree} 
                onChange={(e) => setSearch({ ...search, degree: e.target.value })} 
                className="form-select"
              >
                <option value="All">All Degrees</option>
                <option value="B.Sc. in Computer Science">B.Sc. in Computer Science</option>
                <option value="B.Sc. in Software Engineering">B.Sc. in Software Engineering</option>
                <option value="M.Sc. in Computer Science">M.Sc. in Computer Science</option>
                <option value="M.Sc. in Data Science">M.Sc. in Data Science</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Search</button>
              <button type="button" onClick={handleClear} className="btn btn-secondary" style={{ height: '42px' }}>Reset</button>
            </div>
          </form>

          {/* Directory Listings */}
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '10px' }}>
                      <Briefcase size={15} /> <span>{alumnus.role} at <span style={{ color: 'var(--color-primary)' }}>{alumnus.company}</span></span>
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
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', flexWrap: 'wrap' }}>
                      <a href={`mailto:${alumnus.email}`} className="btn btn-secondary btn-sm" style={{ flex: '1 1 30%', display: 'inline-flex', gap: '4px' }}>
                        <Mail size={13} /> Email
                      </a>
                      {alumnus.linkedin && (
                        <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ flex: '1 1 30%', display: 'inline-flex', gap: '4px' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn
                        </a>
                      )}
                      
                      {sentRequests.includes(alumnus._id) ? (
                        <span className="btn btn-success btn-sm" style={{ flex: '1 1 100%', cursor: 'default', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', borderColor: 'transparent', display: 'inline-flex', gap: '4px' }}>
                          <Check size={14} /> Request Sent
                        </span>
                      ) : (
                        <button 
                          onClick={() => setActiveAlumnus(alumnus)} 
                          className="btn btn-primary btn-sm" 
                          style={{ flex: '1 1 100%', display: 'inline-flex', gap: '4px' }}
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

            <h2 className="card-title">Request 1-on-1 Mentorship</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
              Connect with <strong>{activeAlumnus.name}</strong> ({activeAlumnus.role} at {activeAlumnus.company}).
            </p>

            <form onSubmit={handleMentorshipSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mentorship Subject / Topic</label>
                <select 
                  value={mentorshipData.topic} 
                  onChange={(e) => setMentorshipData({ ...mentorshipData, topic: e.target.value })} 
                  className="form-select"
                >
                  <option value="Career Guidance">Career Guidance / Path advice</option>
                  <option value="Resume Review">Resume & CV review</option>
                  <option value="Mock Interview">Mock coding interview practice</option>
                  <option value="Job Referral">Internal job referral request</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Custom Message</label>
                <textarea 
                  value={mentorshipData.note} 
                  onChange={(e) => setMentorshipData({ ...mentorshipData, note: e.target.value })} 
                  className="form-textarea" 
                  placeholder="Introduce yourself, mention your course, and detail what help you need..." 
                  style={{ minHeight: '100px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Send size={15} /> Send Invitation
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
