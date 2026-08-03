import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { Building2, Briefcase, Cpu, PlayCircle, Sliders, AlertCircle, Code2, Globe } from 'lucide-react';

export const CreateInterviewPage: React.FC = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState('Google');
  const [customCompany, setCustomCompany] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Fresher (0-1 yrs)');
  const [difficulty, setDifficulty] = useState('Medium');
  const [interviewType, setInterviewType] = useState('Technical');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const companies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Meta',
    'Apple',
    'Netflix',
    'TCS',
    'Infosys',
    'Accenture',
    'Wipro',
    'Custom'
  ];

  const roles = [
    'Software Engineer',
    'AI Engineer',
    'Data Scientist',
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Data Analyst'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetCompany = company === 'Custom' ? customCompany : company;

    try {
      const res = await apiRequest<{ interview_id: number }>('/interviews/create', {
        method: 'POST',
        body: JSON.stringify({
          company: targetCompany,
          role,
          experience_level: experienceLevel,
          difficulty,
          interview_type: interviewType,
          total_questions: totalQuestions
        }),
      });

      navigate(`/interview/${res.interview_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div className="hm-badge hm-badge-emerald" style={{ marginBottom: '0.5rem' }}>Session Configuration</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Create Mock Interview</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Tailor your AI interview parameters to match target company standards.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="hm-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem' }}>
        {/* Company Selection */}
        <div>
          <label className="hm-label">Target Company Persona</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
            {companies.map((comp) => (
              <button
                key={comp}
                type="button"
                onClick={() => setCompany(comp)}
                style={{
                  background: company === comp ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
                  border: `1px solid ${company === comp ? 'var(--primary)' : 'var(--border-color)'}`,
                  color: company === comp ? 'var(--primary)' : 'var(--text-main)',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <Building2 size={14} /> {comp}
              </button>
            ))}
          </div>
          {company === 'Custom' && (
            <input
              type="text"
              required
              className="hm-input"
              placeholder="Enter Custom Company Name (e.g. OpenAI, Uber, Stripe)..."
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              style={{ marginTop: '0.75rem' }}
            />
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="hm-label">Job Role</label>
          <div style={{ position: 'relative' }}>
            <select
              className="hm-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <Briefcase size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Grid for Experience, Difficulty, and Type */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="hm-label">Experience Level</label>
            <select
              className="hm-input"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
              <option value="Mid-Level (2-4 yrs)">Mid-Level (2-4 yrs)</option>
              <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="hm-label">Difficulty</label>
            <select
              className="hm-input"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="hm-label">Interview Type</label>
            <select
              className="hm-input"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
            >
              <option value="Technical">Technical</option>
              <option value="Coding Round">Coding Round (Live Code Editor)</option>
              <option value="HR">HR</option>
              <option value="Mixed">Mixed (Technical + HR)</option>
            </select>
          </div>
        </div>

        {/* Questions slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className="hm-label" style={{ marginBottom: 0 }}>Number of Questions</label>
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{totalQuestions} Questions</span>
          </div>
          <input
            type="range"
            min="3"
            max="10"
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>

        <button type="submit" disabled={loading} className="hm-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}>
          {loading ? 'Initializing AI Session...' : <>Launch AI Interview <PlayCircle size={18} /></>}
        </button>
      </form>
    </div>
  );
};
