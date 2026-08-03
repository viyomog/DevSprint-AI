import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Brain, Code2, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Building2,
  Terminal, Cpu, Zap, Target, Award, Play, ChevronDown, ChevronUp, Lock,
  FileText, Lightbulb, Activity, Layers, Check, X
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [demoTab, setDemoTab] = useState<'coding' | 'behavioral'>('coding');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const companies = [
    { name: 'Google', role: 'Principal Engineer', tag: 'Algorithmic Depth & O(N)', color: '#4285F4' },
    { name: 'Amazon', role: 'Bar Raiser', tag: '16 Leadership Principles', color: '#FF9900' },
    { name: 'Microsoft', role: 'System Architect', tag: 'OOP & System Design', color: '#00A4EF' },
    { name: 'Meta', role: 'Prod Eng Lead', tag: 'High-Concurrency & Scaling', color: '#0668E1' },
    { name: 'TCS / Infosys', role: 'Tech Lead', tag: 'DBMS, OS & CS Basics', color: '#10B981' },
  ];

  const faqs = [
    {
      q: 'How does HireMind generate realistic company interview questions?',
      a: 'HireMind uses custom-engineered AI prompt personas (Google Bar Raisers, Amazon Leadership Evaluators, Microsoft Architects) powered by Google Gemini 3.1 LLM models. Questions reference your uploaded resume and adapt dynamically to your prior answers with multi-turn memory.'
    },
    {
      q: 'Is candidate resume data kept private and secure?',
      a: 'Yes! HireMind enforces strict privacy-first architecture. Passwords are stored bcrypt-encrypted. Uploaded resumes and interview responses are processed securely via SSL to Supabase PostgreSQL and Google Gemini API for real-time scoring. We NEVER sell or monetize candidate data.'
    },
    {
      q: 'Does HireMind evaluate actual programming code solutions?',
      a: 'Yes! HireMind includes a built-in Live Code Editor supporting Python, JavaScript, Java, and C++. Submissions are analyzed for logical correctness, time complexity (e.g. O(N)), space complexity, and edge case handling.'
    },
    {
      q: 'Can I practice skipping difficult questions?',
      a: 'Yes! If you encounter a question you cannot answer, click "Skip Question (-Penalty)" to receive real-time micro-feedback and move on to the next question smoothly.'
    }
  ];

  return (
    <div style={{ color: 'var(--text-main)', background: '#080808', overflowX: 'hidden' }}>
      
      {/* Dynamic Ambient Background Glows */}
      <div style={{ position: 'relative', minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 1.5rem 2rem 1.5rem' }}>
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(56, 189, 248, 0.08) 40%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ maxWidth: '1150px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          
          {/* Top Floating Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '0.4rem 1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '1.75rem',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)'
          }}>
            <Sparkles size={15} /> Introducing HireMind 2.0 • AI Company Personas & Live Code Engine
          </div>

          {/* Main Hero Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            maxWidth: '950px',
            margin: '0 auto 1.25rem auto'
          }}>
            Master Technical & HR Interviews with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #10B981 0%, #38BDF8 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Real Company AI Personas
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            margin: '0 auto 2.25rem auto',
            lineHeight: 1.65,
            fontWeight: 400
          }}>
            Practice with Google Bar Raisers, Amazon Leadership Evaluators, and Microsoft Architects. Get instant micro-feedback, Big-O code complexity analysis, and resume skill gap alignment.
          </p>

          {/* CTA Button Row */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <button
              onClick={() => navigate('/register')}
              className="hm-btn-primary"
              style={{ padding: '0.95rem 2rem', fontSize: '1.05rem', borderRadius: '12px', boxShadow: '0 0 25px var(--primary-glow)' }}
            >
              Start Free Mock Interview <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="hm-btn-secondary"
              style={{ padding: '0.95rem 1.75rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              Sign In to Dashboard
            </button>
          </div>

          {/* 3D Glassmorphism Showcase Card / Interactive Hero Preview */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(23, 23, 23, 0.9) 0%, rgba(13, 13, 13, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '1.75rem',
            maxWidth: '980px',
            margin: '0 auto',
            textAlign: 'left',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.12)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  hiremind.ai/interview/live-session
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="hm-badge hm-badge-emerald" style={{ fontSize: '0.75rem' }}>
                  Google Bar Raiser Persona
                </span>
                <span className="hm-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.75rem' }}>
                  Live Code Workspace
                </span>
              </div>
            </div>

            {/* Simulated Live Session Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {/* Question & AI Persona Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '0.4rem', borderRadius: '50%' }}>
                    <Brain size={18} color="#000" />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>AI Interviewer (Google)</span>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Principal Software Engineer</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.88rem', lineHeight: 1.55 }}>
                  "Given a data stream of integers, implement a class <code style={{ color: 'var(--primary)', background: 'rgba(16,185,129,0.1)', padding: '2px 5px', borderRadius: '4px' }}>SummaryRanges</code> that summarizes contiguous intervals in <code style={{ color: 'var(--primary)', background: 'rgba(16,185,129,0.1)', padding: '2px 5px', borderRadius: '4px' }}>O(N)</code> optimal time."
                </div>
              </div>

              {/* Syntax Color Code Snippet Column */}
              <div style={{ background: '#0D0D0D', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                <div style={{ color: '#71717A', fontStyle: 'italic', marginBottom: '0.3rem' }}>// Python 3 Solution</div>
                <div><span style={{ color: '#10B981', fontWeight: 700 }}>class</span> <span style={{ color: '#38BDF8' }}>SummaryRanges</span>:</div>
                <div style={{ paddingLeft: '1rem' }}><span style={{ color: '#10B981', fontWeight: 700 }}>def</span> <span style={{ color: '#38BDF8' }}>__init__</span>(self):</div>
                <div style={{ paddingLeft: '2rem', color: '#FAFAFA' }}>self.intervals = []</div>
                <div style={{ paddingLeft: '1rem' }}><span style={{ color: '#10B981', fontWeight: 700 }}>def</span> <span style={{ color: '#38BDF8' }}>addNum</span>(self, value: <span style={{ color: '#EC4899' }}>int</span>):</div>
                <div style={{ paddingLeft: '2rem', color: '#F59E0B' }}># Binary search insertion O(log N)</div>
                <div style={{ paddingLeft: '2rem', color: '#FAFAFA' }}>bisect.insort(self.intervals, value)</div>
              </div>
            </div>

            {/* Micro Evaluation Meter Bar */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                <Zap size={16} color="var(--primary)" />
                <span style={{ fontWeight: 600 }}>Code Micro Analysis:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>8.8 / 10</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                <span className="hm-badge hm-badge-emerald">Time: O(N)</span>
                <span className="hm-badge" style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.3)' }}>Space: O(1)</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Target Companies Strip */}
      <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '1.25rem' }}>
            Tailored AI Interviewer Personas for Top Tech & MNC Standards
          </span>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            {companies.map((c, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                padding: '0.65rem 1.25rem',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                fontWeight: 700
              }}>
                <Building2 size={16} color={c.color} />
                <span>{c.name}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500, borderLeft: '1px solid var(--border-color)', paddingLeft: '0.5rem' }}>
                  {c.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vercel/Linear Style 3D Bento Feature Grid */}
      <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="hm-badge hm-badge-emerald" style={{ marginBottom: '0.5rem' }}>Comprehensive Candidate System</div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>Engineered for Real Career Breakthroughs</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0.5rem auto 0 auto', fontSize: '1rem' }}>
            Everything you need to practice, identify knowledge gaps, write optimal code, and land your dream tech offer.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Tile 1: AI Skill Gap Radar */}
          <div className="hm-card hm-card-emerald-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={22} color="var(--primary)" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>AI Resume Skill Gap Analysis</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Upload your PDF resume to extract skills and instantly calculate your target role alignment percentage ($78\%$).
              </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                <span>Google Software Engineer Alignment</span>
                <span style={{ color: 'var(--primary)' }}>78%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: 'var(--primary)' }} />
              </div>
            </div>
          </div>

          {/* Tile 2: Live Code Editor & Asymptotic Engine */}
          <div className="hm-card hm-card-emerald-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={22} color="#38BDF8" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>Live Code Workspace & Big-O Engine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Solve algorithmic coding challenges in Python, JS, Java, or C++ with line numbers and automated complexity scoring.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="hm-badge hm-badge-emerald">Time: O(N)</span>
              <span className="hm-badge" style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.3)' }}>Space: O(1)</span>
              <span className="hm-badge hm-badge-success">Syntax Valid</span>
            </div>
          </div>

          {/* Tile 3: Multi-Turn Context Memory */}
          <div className="hm-card hm-card-emerald-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={22} color="#A855F7" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>Multi-Turn Context Memory</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                AI interviewers maintain conversational context across turns, asking probing follow-ups referencing your past statements.
              </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              "Building directly on your earlier mention of caching..."
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Demo Sandbox Section */}
      <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div className="hm-badge hm-badge-emerald" style={{ marginBottom: '0.5rem' }}>Interactive Demo</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Experience HireMind Live Workspace</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', marginBottom: '2rem' }}>
            Toggle between Coding Round and Behavioral interview modes below.
          </p>

          <div style={{ display: 'inline-flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <button
              onClick={() => setDemoTab('coding')}
              style={{
                background: demoTab === 'coding' ? 'rgba(16,185,129,0.15)' : 'transparent',
                border: `1px solid ${demoTab === 'coding' ? 'var(--primary)' : 'transparent'}`,
                color: demoTab === 'coding' ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <Code2 size={16} /> Live Coding Round
            </button>

            <button
              onClick={() => setDemoTab('behavioral')}
              style={{
                background: demoTab === 'behavioral' ? 'rgba(16,185,129,0.15)' : 'transparent',
                border: `1px solid ${demoTab === 'behavioral' ? 'var(--primary)' : 'transparent'}`,
                color: demoTab === 'behavioral' ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <Brain size={16} /> Amazon Behavioral (Leadership)
            </button>
          </div>

          <div className="hm-card" style={{ textAlign: 'left', padding: '2rem', border: '1px solid var(--primary-glow)' }}>
            {demoTab === 'coding' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>Question #1 (Google Coding Round):</div>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  Write a function <code style={{ color: 'var(--primary)', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px' }}>findTargetSum(nums, K)</code> in Python that returns the indices of contiguous subarrays equaling target value K in <code style={{ color: 'var(--primary)', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px' }}>O(N)</code> time complexity.
                </div>
                <div style={{ background: '#0D0D0D', padding: '1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>def</span> <span style={{ color: '#38BDF8' }}>findTargetSum</span>(nums, K):<br />
                  &nbsp;&nbsp;seen = &#123;0: -1&#125;<br />
                  &nbsp;&nbsp;<span style={{ color: '#F59E0B' }}># Hash map prefix sum technique O(N)</span><br />
                  &nbsp;&nbsp;<span style={{ color: '#10B981', fontWeight: 700 }}>return</span> result
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#FF9900', fontSize: '0.95rem' }}>Question #1 (Amazon Bar Raiser — Ownership):</div>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  "Tell me about a situation where a project deadline was at risk due to external dependencies, and how you took personal ownership to deliver under pressure."
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Evaluates STAR method (Situation, Task, Action, Result) alongside Amazon's 16 Leadership Principles.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Why Candidates Choose HireMind</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Compare HireMind against traditional solo practice tools.
          </p>
        </div>

        <div className="hm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.2rem 1.5rem' }}>Feature Capability</th>
                <th style={{ padding: '1.2rem 1.5rem', color: 'var(--primary)', fontWeight: 800 }}>HireMind AI 2.0</th>
                <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>Solo LeetCode</th>
                <th style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>Generic AI Chatbots</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Company Specific Personas</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--primary)', fontWeight: 700 }}><Check color="var(--primary)" size={18} /> Google / Amazon / MS</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-secondary)' }}><X color="var(--error)" size={18} /> No</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-secondary)' }}><X color="var(--error)" size={18} /> Generic Prompts</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Live Code Workspace & Big-O Engine</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--primary)', fontWeight: 700 }}><Check color="var(--primary)" size={18} /> Integrated ($O(N)$)</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-secondary)' }}><Check color="var(--success)" size={18} /> Compiler Only</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-secondary)' }}><X color="var(--error)" size={18} /> Code Text Only</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Multi-Turn Context Memory</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--primary)', fontWeight: 700 }}><Check color="var(--primary)" size={18} /> Probing Follow-ups</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-secondary)' }}><X color="var(--error)" size={18} /> None</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-secondary)' }}><X color="var(--error)" size={18} /> Shallow Context</td>
              </tr>
              <tr>
                <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Resume Skill Gap Alignment</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--primary)', fontWeight: 700 }}><Check color="var(--primary)" size={18} /> Automated ($78\%$)</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-secondary)' }}><X color="var(--error)" size={18} /> None</td>
                <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-secondary)' }}><X color="var(--error)" size={18} /> Manual Upload</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
              Everything you need to know about HireMind AI.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="hm-card"
                onClick={() => toggleFaq(idx)}
                style={{ cursor: 'pointer', padding: '1.35rem 1.75rem', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.05rem' }}>
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
                </div>

                {openFaq === idx && (
                  <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Bottom Call To Action Banner */}
      <div style={{ padding: '6rem 1.5rem', textAlign: 'center', position: 'relative' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1px solid var(--primary-glow)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          boxShadow: '0 0 50px rgba(16, 185, 129, 0.15)'
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, marginBottom: '1rem' }}>
            Ready to Ace Your Next Tech Interview?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
            Join software engineers practicing with real company personas, live code evaluation, and skill gap reports.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="hm-btn-primary"
            style={{ padding: '1rem 2.25rem', fontSize: '1.1rem', borderRadius: '12px', boxShadow: '0 0 30px var(--primary-glow)' }}
          >
            Launch Free AI Interview <ArrowRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};
