import React from 'react';
import { ShieldCheck, Lock, Database, Eye, Server, Cpu, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div className="hm-badge hm-badge-emerald" style={{ marginBottom: '0.5rem', gap: '0.3rem' }}>
          <ShieldCheck size={14} /> Transparency & Compliance
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Privacy Policy & Data Handling</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
          DevSprint AI is built with strict privacy-first principles. We are fully transparent about what data is processed, how it is stored, and how AI services interact with your information.
        </p>
      </div>

      {/* Main Privacy Guarantee Card */}
      <div className="hm-card hm-card-emerald-glow" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Lock size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Our Privacy Promise</h2>
        </div>
        <p style={{ color: 'var(--text-main)', lineHeight: 1.65, fontSize: '0.98rem' }}>
          We <strong>DO NOT sell, rent, or monetize</strong> your personal data. Your account credentials, uploaded resumes, and interview responses are handled exclusively to power your personal AI interview practice sessions.
        </p>
      </div>

      {/* Detailed Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* What We Collect */}
        <div className="hm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Database size={20} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>What Data We Collect & Store</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <div><strong style={{ color: 'var(--text-main)' }}>Account Credentials:</strong> Your full name, email address, and passwords hashed securely with bcrypt. Raw passwords are never stored.</div>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <div><strong style={{ color: 'var(--text-main)' }}>Uploaded Resume Content:</strong> Extracted technical skill tags and experience text used solely to personalize interview questions.</div>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <div><strong style={{ color: 'var(--text-main)' }}>Interview History & Scores:</strong> Your questions, submitted text/code answers, AI micro-evaluations, and generated report cards.</div>
            </li>
          </ul>
        </div>

        {/* AI & Third Party Processing */}
        <div className="hm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Cpu size={20} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>AI & Third-Party Processing</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <div><strong style={{ color: 'var(--text-main)' }}>Google Gemini API:</strong> Prompts containing resume text or candidate answers are transmitted via encrypted HTTPS to Google Gemini API for evaluation.</div>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <div><strong style={{ color: 'var(--text-main)' }}>No Audio / Video Storage:</strong> Voice and webcam features operate in client-side real-time mode only. No candidate video or audio files are recorded or uploaded.</div>
            </li>
            <li style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <div><strong style={{ color: 'var(--text-main)' }}>Local Database:</strong> Data is stored in your configured SQLite database instance.</div>
            </li>
          </ul>
        </div>
      </div>

      {/* Security & Control */}
      <div className="hm-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>Your Data Controls</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          As a user, you have complete control over your data. You may update your target role preferences, re-upload resumes to overwrite extracted skill profiles, or request local database resets at any time.
        </p>
      </div>
    </div>
  );
};
