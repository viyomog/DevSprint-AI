import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Brain, Plus, Trophy, Award, TrendingUp, AlertCircle, FileText, CheckCircle2,
  Building2, ArrowRight, Activity, Zap, Target, BarChart3, Clock, Sparkles
} from 'lucide-react';

interface ScoreTrend {
  interview_id: number;
  company: string;
  date: string;
  score: number;
}

interface CompanyReadiness {
  company: string;
  readiness_percentage: number;
  total_sessions: number;
  avg_score: number;
}

interface CategoryScore {
  name: string;
  score: number;
}

interface AnalyticsOverview {
  total_interviews: number;
  overall_avg_score: number;
  category_scores: CategoryScore[];
  score_trends: ScoreTrend[];
  company_readiness: CompanyReadiness[];
  top_strengths: string[];
  weak_areas: string[];
}

interface InterviewSummary {
  id: number;
  company: string;
  role: string;
  difficulty: string;
  status: string;
  overall_score: number;
  hiring_recommendation: string;
  created_at: string;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [recentInterviews, setRecentInterviews] = useState<InterviewSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [anaData, statsData] = await Promise.all([
          apiRequest<AnalyticsOverview>('/interviews/analytics/overview'),
          apiRequest<any>('/interviews/dashboard/stats')
        ]);
        setAnalytics(anaData);
        setRecentInterviews(statsData.recent_interviews || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load candidate analytics');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'var(--primary)';
    if (score >= 6.0) return 'var(--warning)';
    return 'var(--error)';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Activity size={36} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
        <span style={{ color: 'var(--text-secondary)' }}>Calculating Performance Analytics Hub...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Welcome Banner */}
      <div className="hm-card hm-card-emerald-glow" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div className="hm-badge hm-badge-emerald" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={12} /> Candidate Performance Hub
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Welcome back, {user?.full_name || 'Candidate'}!</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Target Role: <strong style={{ color: 'var(--text-main)' }}>{user?.target_role || 'Software Engineer'}</strong> | Overall Readiness Score: <strong style={{ color: 'var(--primary)' }}>{analytics?.overall_avg_score || 0} / 10</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button onClick={() => navigate('/resume')} className="hm-btn-secondary">
            <FileText size={16} /> Skill Gap Profile
          </button>

          <button onClick={() => navigate('/create-interview')} className="hm-btn-primary">
            Launch Mock Interview <Plus size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Top Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="hm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Trophy size={18} color="var(--primary)" /> Total Mock Interviews
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{analytics?.total_interviews || 0} Sessions</div>
        </div>

        <div className="hm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <TrendingUp size={18} color="var(--primary)" /> Average Assessment Score
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: getScoreColor(analytics?.overall_avg_score || 0) }}>
            {analytics?.overall_avg_score || 0} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 10</span>
          </div>
        </div>

        <div className="hm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Target size={18} color="#38BDF8" /> Company Readiness
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#38BDF8' }}>
            {analytics?.company_readiness?.[0]?.readiness_percentage || 78}%
          </div>
        </div>
      </div>

      {/* Category Performance Radar & Company Readiness Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Category Strength Breakdown */}
        <div className="hm-card" style={{ border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Category Performance Breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {analytics?.category_scores.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-main)' }}>{cat.name}</span>
                  <span style={{ color: getScoreColor(cat.score), fontWeight: 700 }}>{cat.score} / 10</span>
                </div>

                <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <div style={{
                    height: '100%',
                    width: `${(cat.score / 10) * 100}%`,
                    background: getScoreColor(cat.score),
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Readiness Target Grid */}
        <div className="hm-card" style={{ border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Building2 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Company Target Readiness</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {analytics?.company_readiness.map((cr, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1.15rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{cr.company}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {cr.total_sessions} completed sessions
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="hm-badge hm-badge-emerald" style={{ fontWeight: 800 }}>
                    {cr.readiness_percentage}% Ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Recent Interviews Table */}
      <div className="hm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Interview Sessions</h3>
          </div>

          <button onClick={() => navigate('/create-interview')} className="hm-btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>
            New Session <Plus size={14} />
          </button>
        </div>

        {recentInterviews.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No interview sessions completed yet. Launch your first AI mock interview to build your performance profile!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Company</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Difficulty</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Overall Score</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInterviews.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{inv.company}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{inv.role}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="hm-badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.75rem' }}>
                        {inv.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: getScoreColor(inv.overall_score) }}>
                      {inv.overall_score > 0 ? `${inv.overall_score} / 10` : 'In Progress'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`hm-badge ${inv.status === 'completed' ? 'hm-badge-emerald' : 'hm-badge-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(inv.status === 'completed' ? `/report/${inv.id}` : `/interview/${inv.id}`)}
                        className="hm-btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                      >
                        {inv.status === 'completed' ? 'View Report' : 'Resume Session'} <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
