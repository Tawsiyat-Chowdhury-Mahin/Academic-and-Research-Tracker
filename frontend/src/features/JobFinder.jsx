import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Plus, Send, RefreshCw, ExternalLink, Star } from 'lucide-react';

const JobFinder = () => {
  const [jobs, setJobs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'bookmarks'
  const [search, setSearch] = useState({ keyword: '', location: '', type: 'All' });
  const [activeJob, setActiveJob] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Internship',
    description: '',
    requirements: '',
    link: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/jobs';

  useEffect(() => {
    fetchJobs();
    // Load bookmarks from local storage
    const savedBookmarks = JSON.parse(localStorage.getItem('job_bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  const fetchJobs = async (filters = search) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.type && filters.type !== 'All') queryParams.append('type', filters.type);

      const res = await fetch(`${API_URL}?${queryParams.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
        if (data.length > 0) {
          setActiveJob(data[0]);
        } else {
          setActiveJob(null);
        }
      } else {
        setJobs([]);
        setActiveJob(null);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs([]);
      setActiveJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClear = () => {
    const defaultSearch = { keyword: '', location: '', type: 'All' };
    setSearch(defaultSearch);
    fetchJobs(defaultSearch);
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').map(r => r.trim()).filter(r => r.length > 0)
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage('Job posting created successfully!');
        setFormData({ title: '', company: '', location: '', type: 'Internship', description: '', requirements: '', link: '' });
        setShowAddForm(false);
        fetchJobs();
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.message}`);
      }
    } catch (err) {
      setMessage('Failed to create job posting.');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('This will seed default database jobs. Proceed?')) return;
    try {
      const res = await fetch(`${API_URL}/seed`, { method: 'POST' });
      if (res.ok) {
        fetchJobs();
      }
    } catch (err) {
      console.error('Error seeding data:', err);
    }
  };

  const toggleBookmark = (jobId) => {
    let updatedBookmarks;
    if (bookmarks.includes(jobId)) {
      updatedBookmarks = bookmarks.filter(id => id !== jobId);
    } else {
      updatedBookmarks = [...bookmarks, jobId];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem('job_bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Filter listings based on tab (all vs bookmarks)
  const displayedJobs = activeTab === 'all' 
    ? jobs 
    : jobs.filter(j => bookmarks.includes(j._id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1>Internship & Job Finder</h1>
          <p>Browse current internships and job postings or post openings from your company.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSeed} className="btn btn-secondary" title="Reset and seed default jobs">
            <RefreshCw size={16} /> Seed Jobs
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            <Plus size={16} /> {showAddForm ? 'View Listings' : 'Post an Opening'}
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
        /* Create Job Form */
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h2 className="card-title">Post a Job / Internship</h2>
          <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="grid-2" style={{ gap: '15px', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. Frontend Intern" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company Name</label>
                <input 
                  type="text" 
                  value={formData.company} 
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. Google" 
                  required 
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '15px', marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. London / Remote" 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Employment Type</label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                  className="form-select"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                className="form-textarea" 
                placeholder="Give a clear overview of the role..." 
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Requirements (one per line)</label>
              <textarea 
                value={formData.requirements} 
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} 
                className="form-textarea" 
                placeholder="React proficiency&#10;Currently studying CS&#10;Git understanding" 
                style={{ height: '80px' }}
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Application Link / Email</label>
              <input 
                type="text" 
                value={formData.link} 
                onChange={(e) => setFormData({ ...formData, link: e.target.value })} 
                className="form-input" 
                placeholder="https://company.com/apply" 
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Send size={16} /> Submit Posting
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Listings Dashboard */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tab Selection */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '20px' }}>
            <button 
              onClick={() => setActiveTab('all')} 
              style={{
                background: 'none',
                border: 'none',
                padding: '10px 5px',
                fontSize: '1rem',
                fontWeight: 600,
                color: activeTab === 'all' ? 'var(--color-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'all' ? '2px solid var(--color-primary)' : 'none',
                cursor: 'pointer'
              }}
            >
              All Openings ({jobs.length})
            </button>
            <button 
              onClick={() => setActiveTab('bookmarks')} 
              style={{
                background: 'none',
                border: 'none',
                padding: '10px 5px',
                fontSize: '1rem',
                fontWeight: 600,
                color: activeTab === 'bookmarks' ? 'var(--color-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'bookmarks' ? '2px solid var(--color-primary)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Star size={16} fill={activeTab === 'bookmarks' ? 'var(--color-primary)' : 'none'} /> Bookmarked ({bookmarks.length})
            </button>
          </div>

          {/* Filters Bar */}
          {activeTab === 'all' && (
            <form onSubmit={handleSearch} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', padding: '16px 24px' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                <label className="form-label">Keywords</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    value={search.keyword} 
                    onChange={(e) => setSearch({ ...search, keyword: e.target.value })} 
                    className="form-input" 
                    style={{ paddingLeft: '36px' }} 
                    placeholder="Engineer, Developer, React..." 
                  />
                </div>
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '180px', marginBottom: 0 }}>
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    value={search.location} 
                    onChange={(e) => setSearch({ ...search, location: e.target.value })} 
                    className="form-input" 
                    style={{ paddingLeft: '36px' }} 
                    placeholder="Remote, London..." 
                  />
                </div>
              </div>

              <div className="form-group" style={{ width: '150px', marginBottom: 0 }}>
                <label className="form-label">Job Type</label>
                <select 
                  value={search.type} 
                  onChange={(e) => setSearch({ ...search, type: e.target.value })} 
                  className="form-select"
                >
                  <option value="All">All Types</option>
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Search</button>
                <button type="button" onClick={handleClear} className="btn btn-secondary" style={{ height: '42px' }}>Reset</button>
              </div>
            </form>
          )}

          {/* Results Grid */}
          <div className="grid-2">
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
              {loading ? (
                <p>Loading listings...</p>
              ) : displayedJobs.length === 0 ? (
                <p style={{ fontStyle: 'italic' }}>
                  {activeTab === 'bookmarks' ? 'No bookmarked jobs yet. Tap the star icon on any opening.' : 'No job listings match your filters.'}
                </p>
              ) : (
                displayedJobs.map(job => (
                  <div 
                    key={job._id} 
                    onClick={() => setActiveJob(job)}
                    style={{ 
                      cursor: 'pointer',
                      padding: '16px', 
                      borderRadius: '12px', 
                      backgroundColor: activeJob?._id === job._id ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                      border: `1px solid ${activeJob?._id === job._id ? 'var(--color-primary)' : 'var(--border-color)'}`,
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform var(--transition-fast)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.05rem', paddingRight: '25px', color: activeJob?._id === job._id ? 'var(--color-primary)' : 'inherit' }}>{job.title}</h3>
                      <span className={`badge ${job.type === 'Internship' ? 'badge-primary' : 'badge-success'}`}>{job.type}</span>
                    </div>
                    <p style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '8px' }}>{job.company}</p>
                    <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {job.location}
                      </span>
                    </div>

                    {/* Bookmark Toggle Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent clicking the card to load activeJob
                        toggleBookmark(job._id);
                      }}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        bottom: '16px',
                        background: 'none',
                        border: 'none',
                        color: bookmarks.includes(job._id) ? 'var(--color-warning)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      <Star size={18} fill={bookmarks.includes(job._id) ? 'var(--color-warning)' : 'none'} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Detailed View Pane */}
            {activeJob ? (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', position: 'sticky', top: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className={`badge ${activeJob.type === 'Internship' ? 'badge-primary' : 'badge-success'}`} style={{ marginBottom: '8px' }}>{activeJob.type}</span>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{activeJob.title}</h2>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>{activeJob.company}</h3>
                    <p style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                      <MapPin size={16} /> {activeJob.location}
                    </p>
                  </div>
                  <button 
                    onClick={() => toggleBookmark(activeJob._id)} 
                    style={{
                      background: 'none',
                      border: 'none',
                      color: bookmarks.includes(activeJob._id) ? 'var(--color-warning)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-primary)'
                    }}
                  >
                    <Star size={22} fill={bookmarks.includes(activeJob._id) ? 'var(--color-warning)' : 'none'} />
                  </button>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Description</h4>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                    {activeJob.description}
                  </p>
                </div>

                {activeJob.requirements && activeJob.requirements.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Requirements</h4>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      {activeJob.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeJob.link && (
                  <div style={{ marginTop: '10px' }}>
                    <a 
                      href={activeJob.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', gap: '6px' }}
                    >
                      Apply Now <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <p style={{ fontStyle: 'italic' }}>Select a job to view specifications.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFinder;
