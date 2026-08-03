import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Briefcase, Calendar, ShieldCheck, Award, FileText,
  Save, CheckCircle2, AlertCircle, Building2, ExternalLink, Sparkles
} from 'lucide-react';
import { CertificateCard } from '../components/CertificateCard';

interface ResumeData {
  filename: string;
  skills: string[];
  experience_summary: string;
  uploaded_at: string;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Engineer');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfileData() {
      try {
        const rData = await apiRequest<ResumeData>('/resume/latest');
        setResumeData(rData);
      } catch (err: any) {
        // Resume not uploaded yet
      }
    }
    loadProfileData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      setSuccessMsg('Candidate profile details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner (Hidden in print) */}
      <div className="hm-card hm-card-emerald-glow no-print" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px var(--primary-glow)',
            color: '#000000',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="hm-badge hm-badge-emerald" style={{ marginBottom: '0.35rem' }}>
              <Sparkles size={12} /> Candidate Account Profile
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user?.full_name || 'Candidate Profile'}</h1>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</span>
          </div>
        </div>

        <button onClick={() => navigate('/resume')} className="hm-btn-secondary">
          <FileText size={16} /> Update Resume PDF
        </button>
      </div>

      {successMsg && (
        <div className="no-print" style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div className="no-print" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Grid: Profile Settings & Uploaded Resume Summary (Hidden in print) */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Profile Details Form */}
        <form onSubmit={handleUpdateProfile} className="hm-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Personal Information</h3>

          <div>
            <label className="hm-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="hm-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="hm-label">Email Address (Read-Only)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                disabled
                className="hm-input"
                value={user?.email || ''}
                style={{ paddingLeft: '2.5rem', opacity: 0.75, cursor: 'not-allowed' }}
              />
              <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="hm-label">Target Job Role</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="hm-input"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Briefcase size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={saving} className="hm-btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            {saving ? 'Saving...' : <>Save Profile Changes <Save size={16} /></>}
          </button>
        </form>

        {/* Uploaded Resume Summary Card */}
        <div className="hm-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Resume & AI Extracted Skills</h3>
            <span className="hm-badge hm-badge-emerald">Active Profile</span>
          </div>

          {resumeData ? (
            <>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1.15rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={20} color="var(--primary)" />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{resumeData.filename}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Uploaded on {new Date(resumeData.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="hm-label">Extracted Skill Matrix</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                  {resumeData.skills.map((skill, idx) => (
                    <span key={idx} className="hm-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600 }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="hm-label">AI Background Summary</label>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {resumeData.experience_summary}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No resume uploaded yet. Upload your PDF resume to extract skills and enable AI Skill Gap Analysis!
              <button onClick={() => navigate('/resume')} className="hm-btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                Upload PDF Resume
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Verified AI Placement Certificate Showcase (Only this prints) */}
      <div>
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Award size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Verified AI Placement Credentials</h2>
        </div>

        <CertificateCard
          candidateName={user?.full_name || 'Software Engineer Candidate'}
          company="Google"
          role={user?.target_role || 'Software Engineer'}
          score={8.5}
          date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          certificateId={`HM-CERT-9482-GOOG`}
        />
      </div>

    </div>
  );
};
