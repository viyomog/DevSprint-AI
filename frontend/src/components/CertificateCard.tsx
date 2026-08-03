import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Download, Share2, Sparkles, Building2 } from 'lucide-react';

interface CertificateProps {
  candidateName: string;
  company: string;
  role: string;
  score: number;
  date: string;
  certificateId: string;
}

export const CertificateCard: React.FC<CertificateProps> = ({
  candidateName,
  company,
  role,
  score,
  date,
  certificateId
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://hiremind.ai/verify/${certificateId}`);
    alert(`Certificate Verification Link copied!\nhttps://hiremind.ai/verify/${certificateId}`);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.95) 0%, rgba(13, 13, 13, 0.98) 100%)',
      border: '2px solid var(--primary-glow)',
      borderRadius: '20px',
      padding: '2.5rem',
      boxShadow: '0 20px 50px rgba(16, 185, 129, 0.2), 0 0 30px rgba(0, 0, 0, 0.8)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '0.6rem', borderRadius: '12px', boxShadow: '0 0 15px var(--primary-glow)' }}>
            <Award size={26} color="#000000" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', fontWeight: 800 }}>
              Official Verified Credential
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>HireMind AI Placement Certificate</h2>
          </div>
        </div>

        <div className="hm-badge hm-badge-emerald" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', gap: '0.4rem' }}>
          <ShieldCheck size={14} /> ID: {certificateId}
        </div>
      </div>

      {/* Main Body */}
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          This is to certify that
        </span>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 900,
          margin: '0.4rem 0 1rem 0',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #10B981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {candidateName}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Has successfully demonstrated technical proficiency, structured problem solving, and role readiness for{' '}
          <strong style={{ color: 'var(--text-main)' }}>{role}</strong> under{' '}
          <strong style={{ color: 'var(--primary)' }}>{company} Interview Standards</strong>.
        </p>
      </div>

      {/* Score & Stamp Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)', margin: '2rem 0', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>VERIFIED SCORE</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>{score} / 10</span>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-color)', height: '40px' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>COMPANY PERSONA</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={16} color="var(--primary)" /> {company} Standard
          </span>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-color)', height: '40px' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>ISSUE DATE</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{date}</span>
        </div>
      </div>

      {/* Footer Controls (Hidden when printing) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--success)' }}>
          <CheckCircle2 size={16} /> Cryptographically Signed & Verified by HireMind AI Engine
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCopyLink} className="hm-btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            <Share2 size={15} /> Share Credential
          </button>
          <button onClick={handlePrintCertificate} className="hm-btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            <Download size={15} /> Download Certificate PDF
          </button>
        </div>
      </div>
    </div>
  );
};
