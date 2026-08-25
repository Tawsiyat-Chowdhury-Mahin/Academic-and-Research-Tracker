import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2, Cpu, AlertTriangle, Layers } from 'lucide-react';

const CVAnalyzer = () => {
  const [analyses, setAnalyses] = useState([]);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/cv-analyses';

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAnalyses(data);
        if (data.length > 0 && !activeAnalysis) {
          setActiveAnalysis(data[0]);
        }
      } else {
        setAnalyses([]);
      }
    } catch (err) {
      console.error('Error fetching CV analyses:', err);
      setAnalyses([]);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescription.trim()) {
      setMessage('Please fill in both the resume text and the job description.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalyses(prev => [data, ...prev]);
        setActiveAnalysis(data);
        setResumeText('');
        setJobDescription('');
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.message}`);
      }
    } catch (err) {
      setMessage('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis record?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnalyses(analyses.filter(a => a._id !== id));
        if (activeAnalysis?._id === id) {
          setActiveAnalysis(null);
        }
      }
    } catch (err) {
      console.error('Error deleting analysis:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>CV / Resume Match Analyzer</h1>
        <p>Paste your CV and a target Job Description to analyze match percentage, identify gaps, and get instant recommendations.</p>
      </div>

      {message && (
        <div className="card" style={{ 
          padding: '12px 20px', 
          backgroundColor: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
          borderLeft: '4px solid var(--color-danger)',
          fontWeight: 500
        }}>
          {message}
        </div>
      )}

      <div className="grid-2">
        {/* Input Form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h2 className="card-title">Run Analysis</h2>
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Paste Resume / CV Content</label>
              <textarea 
                value={resumeText} 
                onChange={(e) => setResumeText(e.target.value)} 
                className="form-textarea" 
                placeholder="Paste the raw text of your CV here..." 
                style={{ height: '180px' }}
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Paste Job Description</label>
              <textarea 
                value={jobDescription} 
                onChange={(e) => setJobDescription(e.target.value)} 
                className="form-textarea" 
                placeholder="Paste the full job requirements and description here..." 
                style={{ height: '180px' }}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              <Cpu size={18} /> {loading ? 'Analyzing Keywords...' : 'Start Matching Analysis'}
            </button>
          </form>
        </div>

        {/* Results / History Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Analysis Dashboard */}
          {activeAnalysis ? (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 className="card-title" style={{ margin: 0, paddingBottom: 0, border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Match Diagnostics</span>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>AI Powered</span>
              </h2>

              {/* Radial score indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px', backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '12px' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ transform: 'rotate(-90deg)', width: '90px', height: '90px' }}>
                    <circle cx="45" cy="45" r="38" stroke="var(--border-color)" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="45" 
                      cy="45" 
                      r="38" 
                      stroke={activeAnalysis.score >= 70 ? 'var(--color-success)' : activeAnalysis.score >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'} 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={2 * Math.PI * 38 * (1 - activeAnalysis.score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span style={{ position: 'absolute', fontSize: '1.4rem', fontWeight: 700 }}>{activeAnalysis.score}%</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                    {activeAnalysis.score >= 70 ? 'Strong Candidate Fit' : activeAnalysis.score >= 40 ? 'Moderate Match Gaps' : 'Low Keyword Match'}
                  </h3>
                  <p style={{ fontSize: '0.875rem' }}>Based on keyword integration density against job details.</p>
                </div>
              </div>

              {/* Category-based Skill Breakdown */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} style={{ color: 'var(--color-primary)' }} /> Skill-Category Match Breakdown
                </h3>
                
                {/* Languages Score Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 500 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Programming Languages Fit</span>
                    <span>{activeAnalysis.categoryScores?.languages ?? 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div style={{ 
                      width: `${activeAnalysis.categoryScores?.languages ?? 0}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--color-primary)', 
                      borderRadius: '4px',
                      transition: 'width 0.5s ease-in-out'
                    }}></div>
                  </div>
                </div>

                {/* Frameworks Score Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 500 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Frameworks & Libraries Fit</span>
                    <span>{activeAnalysis.categoryScores?.frameworks ?? 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div style={{ 
                      width: `${activeAnalysis.categoryScores?.frameworks ?? 0}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--color-success)', 
                      borderRadius: '4px',
                      transition: 'width 0.5s ease-in-out'
                    }}></div>
                  </div>
                </div>

                {/* Tools & Databases Score Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 500 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tools, Clouds & Databases Fit</span>
                    <span>{activeAnalysis.categoryScores?.tools ?? 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div style={{ 
                      width: `${activeAnalysis.categoryScores?.tools ?? 0}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--color-warning)', 
                      borderRadius: '4px',
                      transition: 'width 0.5s ease-in-out'
                    }}></div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} style={{ color: 'var(--color-warning)' }} /> Optimization Action Plan
                </h3>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                  {activeAnalysis.suggestions.map((sug, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)' }}>{sug}</li>
                  ))}
                </ul>
              </div>

              {/* Missing Keywords */}
              {activeAnalysis.missingKeywords && activeAnalysis.missingKeywords.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} style={{ color: 'var(--color-danger)' }} /> Missing Industry Keywords
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeAnalysis.missingKeywords.map((kw, idx) => (
                      <span key={idx} style={{ 
                        fontSize: '0.8rem', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        backgroundColor: 'var(--color-danger-light)', 
                        color: 'var(--color-danger)',
                        fontWeight: 500,
                        border: '1px dashed var(--color-danger)'
                      }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontStyle: 'italic' }}>Submit CV details on the left to see matching metrics.</p>
            </div>
          )}

          {/* Analysis History */}
          <div className="card">
            <h2 className="card-title">Analysis History</h2>
            {analyses.length === 0 ? (
              <p style={{ fontStyle: 'italic' }}>No matches processed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {analyses.map(item => (
                  <div key={item._id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    backgroundColor: activeAnalysis?._id === item._id ? 'var(--color-primary-light)' : 'var(--bg-primary)',
                    border: `1px solid ${activeAnalysis?._id === item._id ? 'var(--color-primary)' : 'var(--border-color)'}`
                  }}>
                    <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => setActiveAnalysis(item)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: item.score >= 70 ? 'var(--color-success)' : item.score >= 40 ? 'var(--color-warning)' : 'var(--color-danger)' 
                        }}>{item.score}% Match</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                        JD: {item.jobDescription.substring(0, 60)}...
                      </p>
                    </div>
                    <button onClick={() => handleDelete(item._id)} className="btn btn-secondary btn-sm" style={{ padding: '4px', color: 'var(--color-danger)' }} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVAnalyzer;
