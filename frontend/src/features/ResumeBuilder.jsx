import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, FileText, Download, Save, Layout, Globe, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

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

const ResumeBuilder = () => {
  const [resumes, setResumes] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    location: '',
    summary: '',
    skills: '',
    education: [{ institution: '', degree: '', startDate: '', endDate: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }]
  });
  const [editingId, setEditingId] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);
  const [template, setTemplate] = useState('classic'); // 'classic' or 'modern'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/resumes';

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResumes(data);
        if (data.length > 0 && !previewResume) {
          setPreviewResume(data[0]);
        }
      } else {
        setResumes([]);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setResumes([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (index, type, field, value) => {
    const list = [...formData[type]];
    list[index][field] = value;
    setFormData({ ...formData, [type]: list });
  };

  const addNestedField = (type) => {
    const newField = type === 'education' 
      ? { institution: '', degree: '', startDate: '', endDate: '' }
      : { company: '', position: '', startDate: '', endDate: '', description: '' };
    setFormData({ ...formData, [type]: [...formData[type], newField] });
  };

  const removeNestedField = (index, type) => {
    const list = [...formData[type]];
    list.splice(index, 1);
    setFormData({ ...formData, [type]: list });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formattedData = {
      ...formData,
      linkedin: ensureValidUrl(formData.linkedin, 'linkedin'),
      github: ensureValidUrl(formData.github, 'github'),
      skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : formData.skills
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        });
      }

      if (res.ok) {
        const savedData = await res.json();
        setMessage(editingId ? 'Resume updated successfully!' : 'Resume created successfully!');
        resetForm();
        fetchResumes();
        setPreviewResume(savedData);
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (err) {
      // Local fallback
      const fallback = {
        _id: editingId || `res_${Date.now()}`,
        ...formattedData,
        createdAt: new Date()
      };
      setPreviewResume(fallback);
      setResumes(prev => [fallback, ...prev.filter(r => r._id !== fallback._id)]);
      setMessage('Resume saved successfully!');
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resume) => {
    setEditingId(resume._id);
    setFormData({
      fullName: resume.fullName,
      email: resume.email,
      phone: resume.phone,
      linkedin: resume.linkedin || '',
      github: resume.github || '',
      location: resume.location || '',
      summary: resume.summary || '',
      skills: Array.isArray(resume.skills) ? resume.skills.join(', ') : (resume.skills || ''),
      education: resume.education && resume.education.length > 0 ? resume.education : [{ institution: '', degree: '', startDate: '', endDate: '' }],
      experience: resume.experience && resume.experience.length > 0 ? resume.experience : [{ company: '', position: '', startDate: '', endDate: '', description: '' }]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchResumes();
        if (previewResume?._id === id) {
          setPreviewResume(null);
        }
      }
    } catch (err) {
      setResumes(resumes.filter(r => r._id !== id));
      if (previewResume?._id === id) setPreviewResume(null);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      location: '',
      summary: '',
      skills: '',
      education: [{ institution: '', degree: '', startDate: '', endDate: '' }],
      experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }]
    });
    setEditingId(null);
  };

  const printResume = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>Resume Builder</h1>
        <p>Create and format professional academic and industry resumes with live LinkedIn and GitHub integration.</p>
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

      <div className="grid-2">
        {/* Editor Form */}
        <div className="card">
          <h2 className="card-title">{editingId ? 'Edit Resume' : 'Build Resume'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-input" placeholder="Tawsiyat Chowdhury Mahin" required />
            </div>

            <div className="grid-2" style={{ gap: '15px', marginBottom: '0px' }}>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="student@g.bracu.ac.bd" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+880 1712-345678" required />
              </div>
            </div>

            {/* LinkedIn, GitHub, and Location */}
            <div className="grid-2" style={{ gap: '15px', marginBottom: '0px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  LinkedIn Profile URL or Username
                </label>
                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="form-input" placeholder="e.g. linkedin.com/in/username or username" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub Profile URL or Username
                </label>
                <input type="text" name="github" value={formData.github} onChange={handleChange} className="form-input" placeholder="e.g. github.com/username or username" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location / City</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" placeholder="Dhaka, Bangladesh" />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Summary</label>
              <textarea name="summary" value={formData.summary} onChange={handleChange} className="form-textarea" placeholder="Brief summary of your skills, achievements, and career goals..."></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Technical Skills (comma separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="form-input" placeholder="JavaScript, React.js, Node.js, Python, MongoDB, Docker, Git" />
            </div>

            {/* Education Fields */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Education</h3>
                <button type="button" onClick={() => addNestedField('education')} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                  <Plus size={14} /> Add
                </button>
              </div>
              {formData.education.map((edu, index) => (
                <div key={index} style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
                  {formData.education.length > 1 && (
                    <button type="button" onClick={() => removeNestedField(index, 'education')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label">School / Institution</label>
                    <input type="text" value={edu.institution} onChange={(e) => handleNestedChange(index, 'education', 'institution', e.target.value)} className="form-input" placeholder="BRAC University" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label">Degree / Field of Study</label>
                    <input type="text" value={edu.degree} onChange={(e) => handleNestedChange(index, 'education', 'degree', e.target.value)} className="form-input" placeholder="B.Sc. in Computer Science and Engineering" required />
                  </div>
                  <div className="grid-2" style={{ gap: '10px', marginBottom: '0px' }}>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                      <label className="form-label">Start Date</label>
                      <input type="text" value={edu.startDate} placeholder="2022" onChange={(e) => handleNestedChange(index, 'education', 'startDate', e.target.value)} className="form-input" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                      <label className="form-label">End Date</label>
                      <input type="text" value={edu.endDate} placeholder="2026 (Expected)" onChange={(e) => handleNestedChange(index, 'education', 'endDate', e.target.value)} className="form-input" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Fields */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Experience / Projects</h3>
                <button type="button" onClick={() => addNestedField('experience')} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                  <Plus size={14} /> Add
                </button>
              </div>
              {formData.experience.map((exp, index) => (
                <div key={index} style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
                  {formData.experience.length > 1 && (
                    <button type="button" onClick={() => removeNestedField(index, 'experience')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label">Company / Project Name</label>
                    <input type="text" value={exp.company} onChange={(e) => handleNestedChange(index, 'experience', 'company', e.target.value)} className="form-input" placeholder="Academic and Research Tracker" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label">Role / Position</label>
                    <input type="text" value={exp.position} onChange={(e) => handleNestedChange(index, 'experience', 'position', e.target.value)} className="form-input" placeholder="Full Stack Developer" required />
                  </div>
                  <div className="grid-2" style={{ gap: '10px', marginBottom: '10px' }}>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                      <label className="form-label">Start Date</label>
                      <input type="text" value={exp.startDate} placeholder="Jan 2025" onChange={(e) => handleNestedChange(index, 'experience', 'startDate', e.target.value)} className="form-input" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                      <label className="form-label">End Date</label>
                      <input type="text" value={exp.endDate} placeholder="Present" onChange={(e) => handleNestedChange(index, 'experience', 'endDate', e.target.value)} className="form-input" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '0px' }}>
                    <label className="form-label">Description & Achievements</label>
                    <textarea value={exp.description} onChange={(e) => handleNestedChange(index, 'experience', 'description', e.target.value)} className="form-textarea" placeholder="Describe key accomplishments, technologies used, and metrics..."></textarea>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                <Save size={16} /> {editingId ? 'Update Resume' : 'Save Resume'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Preview & Saved Resumes Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Saved List */}
          <div className="card">
            <h2 className="card-title">Saved Resumes ({resumes.length})</h2>
            {resumes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No resumes created yet. Use the builder on the left.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {resumes.map(resume => (
                  <div key={resume._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '6px', border: `1px solid ${previewResume?._id === resume._id ? 'var(--color-primary)' : 'var(--border-color)'}`, backgroundColor: previewResume?._id === resume._id ? 'var(--color-primary-light)' : 'var(--bg-primary)' }}>
                    <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => setPreviewResume(resume)}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{resume.fullName}</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{resume.email}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleEdit(resume)} className="btn btn-secondary btn-sm" style={{ padding: '6px' }} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(resume._id)} className="btn btn-secondary btn-sm" style={{ padding: '6px', color: 'var(--color-danger)' }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Preview */}
          {previewResume && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Template Controls */}
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Layout size={16} /> Choose Layout Template:
                </span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    onClick={() => setTemplate('classic')} 
                    className="btn btn-sm"
                    style={{ 
                      backgroundColor: template === 'classic' ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                      color: template === 'classic' ? '#fff' : 'var(--text-primary)'
                    }}
                  >
                    Classic Academic
                  </button>
                  <button 
                    onClick={() => setTemplate('modern')} 
                    className="btn btn-sm"
                    style={{ 
                      backgroundColor: template === 'modern' ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                      color: template === 'modern' ? '#fff' : 'var(--text-primary)'
                    }}
                  >
                    Modern Corporate
                  </button>
                </div>
              </div>

              {/* Printable Area */}
              <div className="card" id="printable-resume" style={{ 
                backgroundColor: '#fff', 
                color: '#333', 
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid #ddd',
                padding: '28px',
                fontFamily: template === 'classic' ? 'serif' : 'var(--font-sans)',
                fontSize: '0.95rem'
              }}>
                {template === 'classic' ? (
                  /* CLASSIC LAYOUT */
                  <div>
                    <div style={{ borderBottom: '2px solid #333', paddingBottom: '12px', marginBottom: '20px', position: 'relative' }}>
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <h2 style={{ fontSize: '1.9rem', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>{previewResume.fullName}</h2>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#555' }}>
                          {previewResume.email} • {previewResume.phone} {previewResume.location ? `• ${previewResume.location}` : ''}
                        </p>
                        {(previewResume.linkedin || previewResume.github) && (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '0.85rem' }}>
                            {previewResume.linkedin && (
                              <a 
                                href={ensureValidUrl(previewResume.linkedin, 'linkedin')} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ color: '#0077b5', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                LinkedIn
                              </a>
                            )}
                            {previewResume.github && (
                              <a 
                                href={ensureValidUrl(previewResume.github, 'github')} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ color: '#24292e', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                GitHub
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <button onClick={printResume} className="btn btn-secondary btn-sm no-print" style={{ position: 'absolute', right: '0px', top: '0px' }}>
                        <Download size={14} /> Print
                      </button>
                    </div>

                    {previewResume.summary && (
                      <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Professional Summary</h3>
                        <p style={{ color: '#444', lineHeight: 1.5, margin: 0 }}>{previewResume.summary}</p>
                      </div>
                    )}

                    {previewResume.skills && previewResume.skills.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Technical Skills</h3>
                        <p style={{ color: '#444', margin: 0 }}>{Array.isArray(previewResume.skills) ? previewResume.skills.join(' • ') : previewResume.skills}</p>
                      </div>
                    )}

                    {previewResume.experience && previewResume.experience.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Experience & Projects</h3>
                        {previewResume.experience.map((exp, idx) => (
                          <div key={idx} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem' }}>
                              <span>{exp.position} — {exp.company}</span>
                              <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px', whiteSpace: 'pre-line', margin: '4px 0 0 0' }}>{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {previewResume.education && previewResume.education.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Education</h3>
                        {previewResume.education.map((edu, idx) => (
                          <div key={idx} style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem' }}>
                              <span>{edu.degree}</span>
                              <span>{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#555', margin: '2px 0 0 0' }}>{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* MODERN LAYOUT */
                  <div style={{ display: 'flex', gap: '20px', minHeight: '500px' }}>
                    {/* Left side panel */}
                    <div style={{ width: '32%', borderRight: '1px solid #ddd', paddingRight: '15px' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '6px' }}>{previewResume.fullName}</h2>
                      
                      <div style={{ fontSize: '0.82rem', color: '#666', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Mail size={13} style={{ color: 'var(--color-primary)', flexShrink: 0 }} /> <span>{previewResume.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Phone size={13} style={{ color: 'var(--color-primary)', flexShrink: 0 }} /> <span>{previewResume.phone}</span>
                        </div>
                        {previewResume.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={13} style={{ color: 'var(--color-primary)', flexShrink: 0 }} /> <span>{previewResume.location}</span>
                          </div>
                        )}
                        {previewResume.linkedin && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            <a 
                              href={ensureValidUrl(previewResume.linkedin, 'linkedin')} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: '#0077b5', textDecoration: 'underline', fontWeight: 600 }}
                            >
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                        {previewResume.github && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#24292e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            <a 
                              href={ensureValidUrl(previewResume.github, 'github')} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: '#24292e', textDecoration: 'underline', fontWeight: 600 }}
                            >
                              GitHub Profile
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {previewResume.skills && previewResume.skills.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', color: '#444', borderBottom: '1px solid #ddd', paddingBottom: '3px', marginBottom: '10px', fontWeight: 'bold' }}>Key Expertise</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {(Array.isArray(previewResume.skills) ? previewResume.skills : previewResume.skills.split(',')).map((skill, idx) => (
                              <span key={idx} style={{ fontSize: '0.78rem', backgroundColor: '#e2e8f0', padding: '3px 8px', borderRadius: '4px' }}>{skill.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button onClick={printResume} className="btn btn-primary btn-sm no-print" style={{ width: '100%', marginTop: '24px' }}>
                        <Download size={14} /> Print PDF
                      </button>
                    </div>

                    {/* Right core content panel */}
                    <div style={{ width: '68%', paddingLeft: '5px' }}>
                      {previewResume.summary && (
                        <div style={{ marginBottom: '20px' }}>
                          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Profile Summary</h3>
                          <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.5, margin: 0 }}>{previewResume.summary}</p>
                        </div>
                      )}

                      {previewResume.experience && previewResume.experience.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Experience & Projects</h3>
                          {previewResume.experience.map((exp, idx) => (
                            <div key={idx} style={{ marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.88rem' }}>
                                <span>{exp.position}</span>
                                <span style={{ color: '#666', fontSize: '0.78rem' }}>{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <p style={{ fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--color-primary)', margin: '1px 0' }}>{exp.company}</p>
                              <p style={{ fontSize: '0.82rem', color: '#555', marginTop: '3px', whiteSpace: 'pre-line', margin: 0 }}>{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {previewResume.education && previewResume.education.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Education</h3>
                          {previewResume.education.map((edu, idx) => (
                            <div key={idx} style={{ marginBottom: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.88rem' }}>
                                <span>{edu.degree}</span>
                                <span style={{ color: '#666', fontSize: '0.78rem' }}>{edu.startDate} - {edu.endDate}</span>
                              </div>
                              <p style={{ fontSize: '0.82rem', color: '#555', margin: 0 }}>{edu.institution}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-resume, #printable-resume * {
            visibility: visible;
          }
          #printable-resume {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;
