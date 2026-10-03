import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Lock, Mail, User as UserIcon, Briefcase, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(fullName, email, password, targetRole);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 160px)',
      padding: '2rem 1.5rem'
    }} className="bg-grid-pattern">
      <div className="hm-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Brain size={28} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Start practicing AI interviews personalized for your role
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label className="hm-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="hm-input"
                placeholder="Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <UserIcon size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="hm-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="hm-input"
                placeholder="candidate@devsprint.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="hm-label">Target Role</label>
            <div style={{ position: 'relative' }}>
              <select
                className="hm-input"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={{ paddingLeft: '2.5rem', appearance: 'none' }}
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
              <Briefcase size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="hm-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="hm-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="hm-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            {loading ? 'Creating Account...' : <>Register Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
