import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, FileText, Download, Save, Layout } from 'lucide-react';

const ResumeBuilder = () => {
  const [resumes, setResumes] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
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
      setMessage('Failed to connect to backend server.');
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
      summary: resume.summary || '',
      skills: resume.skills.join(', '),
      education: resume.education.length > 0 ? resume.education : [{ institution: '', degree: '', startDate: '', endDate: '' }],
      experience: resume.experience.length > 0 ? resume.experience : [{ company: '', position: '', startDate: '', endDate: '', description: '' }]
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
      console.error('Error deleting resume:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
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
        <p>Create and format professional resumes following industry standards.</p>
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
              <label className="form-label">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-input" required />
            </div>

            <div className="grid-2" style={{ gap: '15px', marginBottom: '0px' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Summary</label>
              <textarea name="summary" value={formData.summary} onChange={handleChange} className="form-textarea" placeholder="Brief summary of your skills and goals..."></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Skills (comma separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="form-input" placeholder="React, Node.js, Python, Project Management" />
            </div>

            {/* Education Fields */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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
                    <input type="text" value={edu.institution} onChange={(e) => handleNestedChange(index, 'education', 'institution', e.target.value)} className="form-input" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label">Degree / Field of Study</label>
                    <input type="text" value={edu.degree} onChange={(e) => handleNestedChange(index, 'education', 'degree', e.target.value)} className="form-input" required />
                  </div>
                  <div className="grid-2" style={{ gap: '10px', marginBottom: '0px' }}>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                      <label className="form-label">Start Date</label>
                      <input type="text" value={edu.startDate} placeholder="e.g. Jan 2021" onChange={(e) => handleNestedChange(index, 'education', 'startDate', e.target.value)} className="form-input" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                      <label className="form-label">End Date</label>
                      <input type="text" value={edu.endDate} placeholder="e.g. Dec 2024" onChange={(e) => handleNestedChange(index, 'education', 'endDate', e.target.value)} className="form-input" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Fields */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Experience</h3>
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
                    <label className="form-label">Company</label>
                    <input type="text" value={exp.company} onChange={(e) => handleNestedChange(index, 'experience', 'company', e.target.value)} className="form-input" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label">Position</label>
                    <input type="text" value={exp.position} onChange={(e) => handleNestedChange(index, 'experience', 'position', e.target.value)} className="form-input" required />
                  </div>
                  <div className="grid-2" style={{ gap: '10px', marginBottom: '10px' }}>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                      <label className="form-label">Start Date</label>
                      <input type="text" value={exp.startDate} placeholder="e.g. Jun 2022" onChange={(e) => handleNestedChange(index, 'experience', 'startDate', e.target.value)} className="form-input" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0px' }}>
                      <label className="form-label">End Date</label>
                      <input type="text" value={exp.endDate} placeholder="e.g. Present" onChange={(e) => handleNestedChange(index, 'experience', 'endDate', e.target.value)} className="form-input" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '0px' }}>
                    <label className="form-label">Description / Core Duties</label>
                    <textarea value={exp.description} onChange={(e) => handleNestedChange(index, 'experience', 'description', e.target.value)} className="form-textarea" style={{ minHeight: '80px' }} placeholder="Detail your accomplishments..."></textarea>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                <Save size={18} /> {loading ? 'Saving...' : 'Save Resume'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Preview Panel & Saved Resumes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Saved Resumes List */}
          <div className="card">
            <h2 className="card-title">Saved Resumes</h2>
            {resumes.length === 0 ? (
              <p style={{ fontStyle: 'italic' }}>No resumes saved yet. Build one on the left!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {resumes.map(resume => (
                  <div key={resume._id} style={{ 
                    display: 'flex', 
                    justifycontent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    backgroundColor: previewResume?._id === resume._id ? 'var(--color-primary-light)' : 'var(--bg-primary)',
                    border: `1px solid ${previewResume?._id === resume._id ? 'var(--color-primary)' : 'var(--border-color)'}`
                  }}>
                    <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => setPreviewResume(resume)}>
                      <h4 style={{ color: previewResume?._id === resume._id ? 'var(--color-primary)' : 'inherit' }}>{resume.fullName}</h4>
                      <p style={{ fontSize: '0.85rem' }}>{resume.email}</p>
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
              <div className="card" style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
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
                padding: '24px',
                fontFamily: template === 'classic' ? 'serif' : 'var(--font-sans)',
                fontSize: '0.95rem'
              }}>
                {template === 'classic' ? (
                  /* CLASSIC LAYOUT */
                  <div>
                    <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{previewResume.fullName}</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', fontStyle: 'italic' }}>{previewResume.email} | {previewResume.phone}</p>
                      </div>
                      <button onClick={printResume} className="btn btn-secondary btn-sm no-print" style={{ position: 'absolute', right: '40px', top: '135px' }}>
                        <Download size={14} /> Print
                      </button>
                    </div>

                    {previewResume.summary && (
                      <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Professional Summary</h3>
                        <p style={{ color: '#444', lineHeight: 1.5 }}>{previewResume.summary}</p>
                      </div>
                    )}

                    {previewResume.skills && previewResume.skills.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Skills</h3>
                        <p style={{ color: '#444' }}>{previewResume.skills.join(' • ')}</p>
                      </div>
                    )}

                    {previewResume.experience && previewResume.experience.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Professional Experience</h3>
                        {previewResume.experience.map((exp, idx) => (
                          <div key={idx} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifycontent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem' }}>
                              <span>{exp.position} - {exp.company}</span>
                              <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px', whiteSpace: 'pre-line' }}>{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {previewResume.education && previewResume.education.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px', fontWeight: 'bold' }}>Education</h3>
                        {previewResume.education.map((edu, idx) => (
                          <div key={idx} style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifycontent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem' }}>
                              <span>{edu.degree}</span>
                              <span>{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#555' }}>{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* MODERN LAYOUT */
                  <div style={{ display: 'flex', gap: '20px', minHeight: '500px' }}>
                    {/* Left side panel */}
                    <div style={{ width: '30%', borderRight: '1px solid #ddd', paddingRight: '15px' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '4px' }}>{previewResume.fullName}</h2>
                      <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>{previewResume.email}<br />{previewResume.phone}</p>
                      
                      {previewResume.skills && previewResume.skills.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#444', borderBottom: '1px solid #ddd', paddingBottom: '3px', marginBottom: '10px', fontWeight: 'bold' }}>Key Expertise</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {previewResume.skills.map((skill, idx) => (
                              <span key={idx} style={{ fontSize: '0.85rem', backgroundColor: '#e2e8f0', padding: '3px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button onClick={printResume} className="btn btn-primary btn-sm no-print" style={{ width: '100%', marginTop: '30px' }}>
                        <Download size={14} /> PDF
                      </button>
                    </div>

                    {/* Right core content panel */}
                    <div style={{ width: '70%', paddingLeft: '5px' }}>
                      {previewResume.summary && (
                        <div style={{ marginBottom: '24px' }}>
                          <h3 style={{ fontSize: '1.05rem', textTransform: 'uppercase', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '3px', marginBottom: '10px', fontWeight: 'bold' }}>Profile Summary</h3>
                          <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.5 }}>{previewResume.summary}</p>
                        </div>
                      )}

                      {previewResume.experience && previewResume.experience.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                          <h3 style={{ fontSize: '1.05rem', textTransform: 'uppercase', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '3px', marginBottom: '10px', fontWeight: 'bold' }}>Experience</h3>
                          {previewResume.experience.map((exp, idx) => (
                            <div key={idx} style={{ marginBottom: '15px' }}>
                              <div style={{ display: 'flex', justifycontent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                <span>{exp.position}</span>
                                <span style={{ color: '#666', fontSize: '0.8rem' }}>{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#444' }}>{exp.company}</p>
                              <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '4px', whiteSpace: 'pre-line' }}>{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {previewResume.education && previewResume.education.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: '1.05rem', textTransform: 'uppercase', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '3px', marginBottom: '10px', fontWeight: 'bold' }}>Education</h3>
                          {previewResume.education.map((edu, idx) => (
                            <div key={idx} style={{ marginBottom: '10px' }}>
                              <div style={{ display: 'flex', justifycontent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                <span>{edu.degree}</span>
                                <span style={{ color: '#666', fontSize: '0.8rem' }}>{edu.startDate} - {edu.endDate}</span>
                              </div>
                              <p style={{ fontSize: '0.85rem', color: '#555' }}>{edu.institution}</p>
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
            padding: 0 !important;
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
