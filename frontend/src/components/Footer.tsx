import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Lock, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 1.5rem 1.5rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Top 3-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Column 1: Brand & Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                padding: '0.35rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Terminal size={18} color="#000000" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Dev<span style={{ color: 'var(--primary)' }}>Sprint</span></span>
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem', background: 'rgba(16, 185, 129, 0.18)', color: 'var(--primary)', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.35)', fontWeight: 700 }}>AI</span>
              </span>
            </Link>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              AI-Powered Mock Technical & HR Interview Simulator. Designed for real company readiness, skill gap analysis, and live coding practice.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              <span className="hm-badge hm-badge-emerald" style={{ fontSize: '0.72rem' }}>
                <Cpu size={12} /> Powered by AI
              </span>
              <span className="hm-badge hm-badge-emerald" style={{ fontSize: '0.72rem' }}>
                <ShieldCheck size={12} /> Privacy First
              </span>
            </div>
          </div>

          {/* Column 2: Platform Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Features
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Candidate Dashboard</Link></li>
              <li><Link to="/resume" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Resume Skill Gap Analysis</Link></li>
              <li><Link to="/create-interview" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Company Mock Interviews</Link></li>
              <li><Link to="/create-interview" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Live Code Workspace</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Privacy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Legal & Privacy
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/privacy" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy & Data Handling</Link></li>
              <li><Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</Link></li>
              <li><Link to="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Data Collection Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Data Privacy Disclosure Banner */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
            <Lock size={20} color="var(--primary)" />
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Data Protection & Privacy Notice</span>
              <span className="hm-badge hm-badge-emerald" style={{ fontSize: '0.7rem' }}>Zero Data Monetization</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.5 }}>
              DevSprint strictly respects candidate privacy. Passwords are stored encrypted using bcrypt. Uploaded resumes and interview responses are processed securely via Google Gemini API solely for real-time question generation & scoring. We <strong>never sell or share</strong> candidate data with third parties.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            © {new Date().getFullYear()} DevSprint AI. Built for real interview readiness & technical excellence.
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <Link to="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
