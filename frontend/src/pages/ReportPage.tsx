import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { Award, Download, CheckCircle, AlertTriangle, ArrowLeft, Building2, ChevronDown, ChevronUp, Printer } from 'lucide-react';

interface CategoryScore {
  name: string;
  score: number;
}

interface QNAReportItem {
  question_number: number;
  question: string;
  user_answer: string;
  overall_score: number;
  feedback_good: string;
  feedback_missing: string;
  feedback_improvement: string;
}

interface FinalReport {
  interview_id: number;
  company: string;
  role: string;
  experience_level: string;
  difficulty: string;
  overall_score: number;
  hiring_recommendation: string;
  summary: string;
  category_scores: CategoryScore[];
  strengths: string[];
  weaknesses: string[];
  suggested_improvements: string[];
  qnas: QNAReportItem[];
  created_at: string;
}

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<FinalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState<number | null>(1);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await apiRequest<FinalReport>(`/interviews/${id}/report`);
        setReport(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching report');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Generating Final Interview Evaluation Report...
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
        <h2>Report Not Available</h2>
        <button onClick={() => navigate('/dashboard')} className="hm-btn-primary" style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getRecommendationBadgeClass = (rec: string) => {
    if (rec === 'Strong Hire' || rec === 'Hire') return 'hm-badge-success';
    if (rec === 'Lean Hire') return 'hm-badge-warning';
    return 'hm-badge-error';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Printable CSS Media Query */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .hm-card {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      {/* Top Header Controls (Hidden during print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard')} className="hm-btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Dashboard
        </button>

        <button onClick={handleDownloadPDF} className="hm-btn-primary" style={{ padding: '0.45rem 1.15rem', fontSize: '0.95rem', borderRadius: '10px' }}>
          <Printer size={18} /> Download Official PDF Report
        </button>
      </div>

      {/* Main Score Banner */}
      <div className="hm-card hm-card-emerald-glow" style={{ padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <Building2 size={22} color="var(--primary)" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{report.company} — {report.role}</h1>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Difficulty: {report.difficulty} | Experience: {report.experience_level}
          </div>
          <p style={{ marginTop: '0.85rem', maxWidth: '600px', fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            {report.summary}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Overall Score
          </span>
          <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
            {report.overall_score}
          </span>
          <span className={`hm-badge ${getRecommendationBadgeClass(report.hiring_recommendation)}`} style={{ marginTop: '0.2rem' }}>
            {report.hiring_recommendation}
          </span>
        </div>
      </div>

      {/* Category Breakdown Grid */}
      <div className="hm-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Category Evaluation Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {report.category_scores.map((cat) => (
            <div key={cat.name} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{cat.name}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{cat.score} / 10</div>
              <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(cat.score / 10) * 100}%`, background: 'var(--primary)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="hm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle size={20} color="var(--success)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Demonstrated Strengths</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {report.strengths.map((str, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--success)' }}>✓</span> {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="hm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={20} color="var(--warning)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Areas for Growth</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {report.weaknesses.map((weak, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--warning)' }}>!</span> {weak}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Q&A Accordion */}
      <div className="hm-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Detailed Question & Answer Analysis</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {report.qnas.map((qna) => (
            <div key={qna.question_number} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => setExpandedQ(expandedQ === qna.question_number ? null : qna.question_number)}
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="hm-badge hm-badge-emerald">Q{qna.question_number}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{qna.question}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{qna.overall_score}/10</span>
                  {expandedQ === qna.question_number ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {expandedQ === qna.question_number && (
                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.0rem' }}>
                  <div>
                    <label className="hm-label">Your Submitted Answer</label>
                    <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: '6px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {qna.user_answer || "No answer provided"}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '0.2rem' }}>What Was Good</strong>
                      {qna.feedback_good}
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--error)', display: 'block', marginBottom: '0.2rem' }}>What Was Missing</strong>
                      {qna.feedback_missing}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.2rem' }}>Actionable Tip to Improve</strong>
                    {qna.feedback_improvement}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
