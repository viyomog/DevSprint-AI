import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { PlayCircle, FileText, Award, BarChart2, CheckCircle, TrendingUp, AlertTriangle, ArrowRight, Building2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface InterviewItem {
  id: number;
  company: string;
  role: string;
  difficulty: string;
  status: string;
  overall_score: number;
  hiring_recommendation: string;
  created_at: string;
}

interface DashboardStats {
  total_interviews: number;
  avg_score: number;
  top_strengths: string[];
  weak_areas: string[];
  recent_interviews: InterviewItem[];
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiRequest<DashboardStats>('/interviews/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const chartData = (stats?.recent_interviews || []).slice().reverse().map((item, idx) => ({
    name: `Session ${idx + 1}`,
    score: item.overall_score || 0
  }));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner */}
      <div className="hm-card" style={{
        background: 'linear-gradient(135deg, rgba(23, 23, 23, 0.95) 0%, rgba(17, 17, 17, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div className="hm-badge hm-badge-emerald" style={{ marginBottom: '0.5rem' }}>
            Target: {user?.target_role || 'Software Engineer'}
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Welcome back, {user?.full_name}! 👋</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
            Track your interview performance, refine your answers, and achieve job readiness.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/create-interview" className="hm-btn-primary" style={{ textDecoration: 'none' }}>
            <PlayCircle size={18} /> New Mock Interview
          </Link>
          <Link to="/resume" className="hm-btn-secondary" style={{ textDecoration: 'none' }}>
            <FileText size={18} /> Upload Resume
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="hm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Interviews</span>
            <BarChart2 size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {loading ? '...' : stats?.total_interviews || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Completed mock sessions
          </div>
        </div>

        <div className="hm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Average Score</span>
            <Award size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
            {loading ? '...' : `${stats?.avg_score || 0.0} / 10`}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Across evaluated criteria
          </div>
        </div>

        <div className="hm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Key Strength</span>
            <CheckCircle size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {stats?.top_strengths?.[0] || 'Technical Clarity'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Consistently rated high
          </div>
        </div>

        <div className="hm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Focus Area</span>
            <AlertTriangle size={20} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {stats?.weak_areas?.[0] || 'System Design Trade-offs'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Recommended to review
          </div>
        </div>
      </div>

      {/* Chart & Recent Sessions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Performance Trend Chart */}
        <div className="hm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Performance Improvement Trend</h3>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#A1A1AA" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#A1A1AA" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#FAFAFA' }} />
                  <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Complete your first interview to see score trends!
              </div>
            )}
          </div>
        </div>

        {/* Recent Interviews List */}
        <div className="hm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Interview Sessions</h3>
            <Link to="/create-interview" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              + New
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats?.recent_interviews && stats.recent_interviews.length > 0 ? (
              stats.recent_interviews.map((item) => (
                <div key={item.id} style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={14} color="var(--primary)" />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.company}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• {item.role}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Difficulty: {item.difficulty} | Status: <span style={{ color: item.status === 'completed' ? 'var(--success)' : 'var(--warning)' }}>{item.status}</span>
                    </div>
                  </div>

                  <Link to={item.status === 'completed' ? `/report/${item.id}` : `/interview/${item.id}`} className="hm-btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    {item.status === 'completed' ? 'Report' : 'Continue'} <ArrowRight size={12} />
                  </Link>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                No past interview sessions found. Start your first session now!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
