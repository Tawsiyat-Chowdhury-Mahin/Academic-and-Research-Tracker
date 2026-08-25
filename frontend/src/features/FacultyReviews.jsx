import React from 'react';
import { 
  Star, ExternalLink, ShieldCheck, Search, Award, 
  GraduationCap, CheckCircle, Users, Sparkles 
} from 'lucide-react';

const EXTERNAL_URL = 'https://bracu-faculty-reviews.vercel.app/';

const FacultyReviews = () => {
  const handleOpenPortal = () => {
    window.open(EXTERNAL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '36px 40px',
        marginBottom: '28px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#38bdf8', marginBottom: '12px' }}>
            <Sparkles size={14} /> Official University Feedback Integration
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px 0' }}>
            BRACU Faculty Reviews & Ratings 🎓⭐
          </h1>
          <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0' }}>
            Explore transparent student evaluations, teaching effectiveness, course grading patterns, and verified faculty feedback using your university G-Suite account.
          </p>

          <button
            onClick={handleOpenPortal}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
          >
            Launch Review Portal <ExternalLink size={18} />
          </button>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          minWidth: '200px'
        }}>
          <Star size={36} color="#facc15" style={{ margin: '0 auto 8px auto' }} fill="#facc15" />
          <div style={{ fontSize: '20px', fontWeight: 800 }}>Verified Reviews</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>G-Suite Authenticated</div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Search size={22} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: '#1e293b' }}>Search Any Instructor</h3>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
            Quickly search faculty members across departments by name, initial, or course code to read past student feedback.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: '#1e293b' }}>Secure G-Suite Login</h3>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
            Sign in with your official university G-Suite account to guarantee genuine student reviews while protecting anonymity.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Award size={22} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: '#1e293b' }}>Course Advising Insights</h3>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
            Make informed course pre-advising decisions based on teaching pace, helpfulness, and grading clarity.
          </p>
        </div>

      </div>

      {/* How to Use Section */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#1e293b' }}>
          How to Access & Submit Reviews:
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <CheckCircle size={20} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#1e293b', fontSize: '14px' }}>Step 1: Launch the External Portal</strong>
              <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '13px' }}>Click the "Launch Review Portal" button above or open <a href={EXTERNAL_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600 }}>bracu-faculty-reviews.vercel.app</a>.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <CheckCircle size={20} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#1e293b', fontSize: '14px' }}>Step 2: Sign In with University G-Suite</strong>
              <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '13px' }}>Use your official student email (<code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>@g.bracu.ac.bd</code>) to authenticate.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <CheckCircle size={20} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#1e293b', fontSize: '14px' }}>Step 3: Search & Contribute</strong>
              <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '13px' }}>Search for your course professors and leave constructive ratings to help fellow students.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FacultyReviews;