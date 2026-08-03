import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { UploadCloud, FileText, CheckCircle2, Cpu, AlertCircle, ArrowRight, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResumeData {
  id: number;
  filename: string;
  skills: string[];
  experience_summary: string;
  uploaded_at: string;
}

interface SkillGapData {
  matching_skills: string[];
  missing_skills: string[];
  readiness_percentage: number;
  recommendations: string[];
}

export const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [gapData, setGapData] = useState<SkillGapData | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [loadingGap, setLoadingGap] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadResumeAndGap() {
      try {
        const data = await apiRequest<ResumeData>('/resume/latest');
        setResumeData(data);
        fetchSkillGap('Software Engineer', 'Google');
      } catch {
        // No resume uploaded yet
      }
    }
    loadResumeAndGap();
  }, []);

  const fetchSkillGap = async (role: string, comp: string) => {
    setLoadingGap(true);
    try {
      const data = await apiRequest<SkillGapData>(`/resume/skill-gap?target_role=${encodeURIComponent(role)}&company=${encodeURIComponent(comp)}`);
      setGapData(data);
    } catch (err) {
      console.error('Failed to load gap analysis', err);
    } finally {
      setLoadingGap(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('hiremind_token');
      const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

      const response = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.detail || 'Upload failed');
      }

      const data: ResumeData = await response.json();
      setResumeData(data);
      setSuccessMsg('Resume parsed successfully with Gemini AI!');
      setFile(null);
      fetchSkillGap(targetRole, targetCompany);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div className="hm-badge hm-badge-emerald" style={{ marginBottom: '0.5rem' }}>AI Skill Extraction & Alignment</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Resume Profile & Gap Analysis</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Upload your PDF resume to extract skills and evaluate your readiness score against your target company & role.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* File Upload Box */}
      <div className="hm-card hm-card-emerald-glow" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <UploadCloud size={48} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upload your Resume (PDF / DOCX)</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Extracts technical skills, experience, and project highlights automatically.
        </p>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <input
            type="file"
            id="resume-file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="resume-file" className="hm-btn-secondary" style={{ cursor: 'pointer' }}>
            <FileText size={16} /> {file ? file.name : 'Choose Resume File'}
          </label>

          <button type="submit" disabled={!file || uploading} className="hm-btn-primary" style={{ marginTop: '0.5rem' }}>
            {uploading ? 'Parsing with Gemini...' : <>Extract Profile Skills <Cpu size={16} /></>}
          </button>
        </form>
      </div>

      {/* Extracted Profile Display */}
      {resumeData && (
        <div className="hm-card" style={{ border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Parsed Profile Skills ({resumeData.filename})</h3>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="hm-label">Extracted Technical Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {resumeData.skills.map((skill, idx) => (
                <span key={idx} className="hm-badge hm-badge-emerald">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="hm-label">Experience Summary</label>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {resumeData.experience_summary}
            </p>
          </div>
        </div>
      )}

      {/* Skill Gap Analysis Card */}
      <div className="hm-card" style={{ border: '1px solid var(--primary-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Skill Gap Analysis</h3>
          </div>

          {/* Role & Company Selectors for Gap Analysis */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="hm-input"
              value={targetCompany}
              onChange={(e) => {
                setTargetCompany(e.target.value);
                fetchSkillGap(targetRole, e.target.value);
              }}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option>
              <option value="TCS">TCS</option>
              <option value="Infosys">Infosys</option>
            </select>

            <select
              className="hm-input"
              value={targetRole}
              onChange={(e) => {
                setTargetRole(e.target.value);
                fetchSkillGap(e.target.value, targetCompany);
              }}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="AI Engineer">AI Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
            </select>
          </div>
        </div>

        {loadingGap ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Calculating role readiness alignment...
          </div>
        ) : gapData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Readiness Score Bar */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Role Readiness Alignment ({targetCompany} — {targetRole})
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {gapData.readiness_percentage}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${gapData.readiness_percentage}%`, background: 'var(--primary)', transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* Matching vs Missing Skills Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700, marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={16} /> Matching Strengths
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {gapData.matching_skills.map((s, idx) => (
                    <span key={idx} className="hm-badge hm-badge-success">{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warning)', fontWeight: 700, marginBottom: '0.75rem' }}>
                  <AlertTriangle size={16} /> Missing Critical Skills
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {gapData.missing_skills.map((s, idx) => (
                    <span key={idx} className="hm-badge hm-badge-warning">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                <Lightbulb size={16} /> Actionable Learning Recommendations
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {gapData.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--primary)' }}>•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button onClick={() => navigate('/create-interview')} className="hm-btn-primary">
                Proceed to Interview Setup <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
