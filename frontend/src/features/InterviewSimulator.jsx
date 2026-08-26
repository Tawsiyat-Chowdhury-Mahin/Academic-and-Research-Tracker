import React, { useState, useEffect, useRef } from 'react';
import { Play, ArrowRight, Award, CheckCircle, Trash2, Volume2, Timer } from 'lucide-react';

const InterviewSimulator = () => {
  const [history, setHistory] = useState([]);
  const [stage, setStage] = useState('config'); // config, active, results
  const [config, setConfig] = useState({ role: 'Architecture', difficulty: 'Medium' });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  const API_URL = 'http://localhost:5000/api/interviews';

  useEffect(() => {
    fetchHistory();
    return () => {
      stopTimer();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Trigger TTS voiceover and timer reset whenever question index changes
  useEffect(() => {
    if (stage === 'active' && questions.length > 0) {
      speakQuestion(questions[currentIndex].question);
      resetTimer();
    }
  }, [currentIndex, stage, questions]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setHistory([]);
    }
  };

  // Timer logic
  const startTimer = () => {
    stopTimer();
    setTimeLeft(60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          // Auto move to next or auto submit
          handleAutoAdvance();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    startTimer();
  };

  const handleAutoAdvance = () => {
    // Save current answer as "Timeout" if empty
    const currentQuestionId = questions[currentIndex].id;
    if (!answers[currentQuestionId]?.trim()) {
      setAnswers(prev => ({ ...prev, [currentQuestionId]: "(No response submitted within time limit)" }));
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Auto submit if last question times out
      handleSubmit();
    }
  };

  // Text-To-Speech function
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
        setCurrentIndex(0);
        setAnswers({});
        setStage('active');
      } else {
        setMessage('Failed to load questions.');
      }
    } catch (err) {
      setMessage('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (text) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: text });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    stopTimer();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setLoading(true);
    
    const formattedAnswers = questions.map(q => ({
      questionId: q.id,
      question: q.question,
      userAnswer: answers[q.id] || '(No response submitted)'
    }));

    try {
      const res = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: config.role,
          difficulty: config.difficulty,
          answers: formattedAnswers
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setStage('results');
        fetchHistory();
      } else {
        setMessage('Failed to submit evaluation.');
      }
    } catch (err) {
      setMessage('Connection error submitting answers.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    if (!window.confirm('Delete simulation record?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(history.filter(h => h._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>Interview Simulator</h1>
        <p>Hone your verbal or written interview explanations. Choose your path, answer key technology questions, and get grading feedback.</p>
      </div>

      {message && (
        <div className="card" style={{ 
          padding: '12px 20px', 
          backgroundColor: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
          borderLeft: '4px solid var(--color-danger)'
        }}>
          {message}
        </div>
      )}

      {stage === 'config' && (
        <div className="grid-2">
          {/* Configuration Card */}
          <div className="card">
            <h2 className="card-title">Configure Interview Session</h2>
            <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Interview Track / Specialization</label>
                <select 
                  value={config.role} 
                  onChange={(e) => setConfig({ ...config, role: e.target.value })} 
                  className="form-select"
                >
                  <option value="Architecture">🏗️ Software Engineering Models & Architecture (MVC, Clean Arch, SOLID)</option>
                  <option value="Database">🗄️ Database Systems & Data Modeling (Normalization, Indexing, ACID vs BASE)</option>
                  <option value="Backend">⚙️ Backend & Distributed Systems (Node, Express, JWT, Microservices)</option>
                  <option value="Frontend">💻 Frontend Web Development (React 19, Virtual DOM, Redux)</option>
                  <option value="Tutor">👨‍🏫 Undergraduate Student Tutor & TA (OOP, Recursion, Debugging)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Easy', 'Medium', 'Hard'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setConfig({ ...config, difficulty: level })}
                      className="btn"
                      style={{ 
                        flex: 1, 
                        backgroundColor: config.difficulty === level ? 'var(--color-primary)' : 'var(--bg-secondary)',
                        color: config.difficulty === level ? '#fff' : 'var(--text-primary)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                <Play size={16} /> {loading ? 'Loading Pool...' : 'Start Simulator'}
              </button>
            </form>
          </div>

          {/* Previous attempts */}
          <div className="card">
            <h2 className="card-title">Past Evaluations</h2>
            {history.length === 0 ? (
              <p style={{ fontStyle: 'italic' }}>No completed sessions found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {history.map(item => (
                  <div key={item._id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>{item.role}</span>
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{item.difficulty}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', marginTop: '3px' }}>Score: <span style={{ fontWeight: 'bold', color: item.overallScore >= 70 ? 'var(--color-success)' : 'var(--color-warning)' }}>{item.overallScore}%</span></p>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => { setResults(item); setStage('results'); }} 
                        className="btn btn-secondary btn-sm"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => handleDeleteHistory(item._id)} 
                        className="btn btn-secondary btn-sm" 
                        style={{ color: 'var(--color-danger)', padding: '5px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {stage === 'active' && questions.length > 0 && (
        /* Simulation Window */
        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', width: '100%', position: 'relative' }}>
          
          {/* Header Progress panel */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginRight: '10px' }}>{config.role} • {config.difficulty}</span>
            </div>
            
            {/* Timer Display */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.95rem', 
              fontWeight: 'bold',
              color: timeLeft <= 15 ? 'var(--color-danger)' : 'var(--text-primary)',
              transition: 'color 0.3s'
            }}>
              <Timer size={16} className={timeLeft <= 15 ? 'pulse-animation' : ''} />
              <span>{timeLeft}s remaining</span>
            </div>
            
            <span style={{ fontWeight: 'bold' }}>Question {currentIndex + 1} of {questions.length}</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '1.25rem', lineHeight: 1.4, flex: 1 }}>{questions[currentIndex].question}</h3>
              <button 
                onClick={() => speakQuestion(questions[currentIndex].question)} 
                className="btn btn-secondary btn-sm" 
                style={{ padding: '6px', borderRadius: '50%' }}
                title="Speak Question"
              >
                <Volume2 size={16} />
              </button>
            </div>
            <textarea
              value={answers[questions[currentIndex].id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="form-textarea"
              placeholder="Write your explanation or code details here..."
              style={{ minHeight: '180px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handlePrev} className="btn btn-secondary" disabled={currentIndex === 0}>
              Back
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              {currentIndex < questions.length - 1 ? (
                <button onClick={handleNext} className="btn btn-primary" disabled={!(answers[questions[currentIndex].id]?.trim())}>
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn btn-success" style={{ backgroundColor: 'var(--color-success)', color: '#fff' }} disabled={loading || !(answers[questions[currentIndex].id]?.trim())}>
                  {loading ? 'Evaluating...' : 'Submit Interview'}
                </button>
              )}
            </div>
          </div>
          
          <style>{`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            .pulse-animation {
              animation: pulse 1s infinite;
              color: var(--color-danger);
            }
          `}</style>
        </div>
      )}

      {stage === 'results' && results && (
        /* Evaluation Feedback Page */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)' }}>
            <Award size={48} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h2 style={{ color: 'var(--color-primary)', fontSize: '1.6rem' }}>Evaluation Complete!</h2>
              <p style={{ fontWeight: 600 }}>Overall Score: {results.overallScore}% ({results.role} - {results.difficulty})</p>
            </div>
          </div>

          {results.questionsAndAnswers.map((item, idx) => (
            <div key={idx} className="card" style={{ borderLeft: `5px solid ${item.score >= 75 ? 'var(--color-success)' : item.score >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', width: '85%' }}>Q{idx + 1}: {item.question}</h3>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: item.score >= 75 ? 'var(--color-success)' : item.score >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'
                }}>{item.score}/100</span>
              </div>
              
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Your Answer:</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginTop: '4px' }}>{item.userAnswer}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-success)', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Feedback:</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.feedback}</p>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={() => { setStage('config'); setResults(null); }} 
            className="btn btn-primary" 
            style={{ width: '200px', alignSelf: 'center' }}
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewSimulator;
