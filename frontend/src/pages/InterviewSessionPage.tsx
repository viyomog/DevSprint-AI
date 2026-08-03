import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { Brain, Send, Mic, MicOff, Award, Building2, Code2, MessageSquare, Loader2, Sparkles, SkipForward, AlertCircle, CheckCircle2, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { MarkdownView } from '../components/MarkdownView';

interface QNAItem {
  question_number: number;
  question: string;
  user_answer: string;
  technical_score: number;
  communication_score: number;
  clarity_score: number;
  completeness_score: number;
  overall_score: number;
  feedback_good: string;
  feedback_missing: string;
  feedback_improvement: string;
}

interface InterviewSession {
  interview_id: number;
  company: string;
  role: string;
  experience_level: string;
  difficulty: string;
  interview_type: string;
  status: string;
  total_questions: number;
  current_question_index: number;
  qnas: QNAItem[];
}

export const InterviewSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'code'>('text');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastEval, setLastEval] = useState<any | null>(null);
  const [codeEval, setCodeEval] = useState<any | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSession() {
      try {
        const data = await apiRequest<InterviewSession>(`/interviews/${id}`);
        setSession(data);
        if (data.interview_type === 'Coding Round' || data.interview_type.toLowerCase().includes('coding')) {
          setActiveTab('code');
        }
        if (data.status === 'completed') {
          navigate(`/report/${id}`);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading interview session');
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [id]);

  const handleSubmitAnswer = async (e?: React.FormEvent, isSkipped: boolean = false) => {
    if (e) e.preventDefault();
    if (!session) return;

    const answerContent = isSkipped
      ? "Skipped by candidate"
      : (activeTab === 'code' ? `Code Submission (${codeLanguage}):\n${codeSnippet}` : currentAnswer);

    if (!isSkipped && !answerContent.trim()) return;

    setSubmitting(true);
    setError('');

    const activeQIndex = session.current_question_index;

    try {
      if (!isSkipped && activeTab === 'code' && codeSnippet.trim()) {
        const cEval = await apiRequest<any>('/interviews/code-eval', {
          method: 'POST',
          body: JSON.stringify({
            interview_id: session.interview_id,
            question_number: activeQIndex,
            code_snippet: codeSnippet,
            language: codeLanguage
          })
        });
        setCodeEval(cEval);
      } else {
        setCodeEval(null);
      }

      const evalRes = await apiRequest<any>('/interviews/answer', {
        method: 'POST',
        body: JSON.stringify({
          interview_id: session.interview_id,
          question_number: activeQIndex,
          user_answer: answerContent,
          is_skipped: isSkipped
        })
      });

      setLastEval(evalRes);
      setCurrentAnswer('');

      if (evalRes.is_finished) {
        setTimeout(() => {
          navigate(`/report/${session.interview_id}`);
        }, 2000);
      } else {
        const updatedSession = await apiRequest<InterviewSession>(`/interviews/${id}`);
        setSession(updatedSession);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={36} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'var(--text-secondary)' }}>Initializing AI Interviewer & Company Persona...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', textAlign: 'center' }}>
        <h2>Session Not Found</h2>
        <button onClick={() => navigate('/dashboard')} className="hm-btn-primary" style={{ marginTop: '1rem' }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  const activeQNA = session.qnas.find(q => q.question_number === session.current_question_index) || session.qnas[session.qnas.length - 1];

  const getPersonaTitle = (comp: string) => {
    if (comp === 'Google') return 'Google Principal Software Engineer & Bar Raiser';
    if (comp === 'Amazon') return 'Amazon Bar Raiser (Leadership Principles & Tech Depth)';
    if (comp === 'Microsoft') return 'Microsoft Senior Software Architect';
    if (comp === 'Meta') return 'Meta Production Engineering Lead';
    if (comp === 'Apple') return 'Apple Systems Software Architect';
    return `${comp} Senior Technical Interviewer`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'var(--primary)';
    if (score >= 6.0) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Session Top Bar */}
      <div className="hm-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '8px' }}>
            <Building2 size={20} color="var(--primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{session.company} — {session.role}</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Difficulty: {session.difficulty} | Type: {session.interview_type}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="hm-badge hm-badge-emerald">
            Question {session.current_question_index} of {session.total_questions}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(session.current_question_index / session.total_questions) * 100}%`,
          background: 'var(--primary)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* AI Persona Box */}
      <div className="hm-card hm-card-emerald-glow" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--primary-glow)'
            }}>
              <Brain size={22} color="#000000" />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>AI Interviewer ({session.company})</span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {getPersonaTitle(session.company)}
              </span>
            </div>
          </div>

          <div className="hm-badge hm-badge-emerald" style={{ gap: '0.3rem' }}>
            <Sparkles size={12} /> Multi-Turn Context Memory
          </div>
        </div>

        {/* Formatted Question Box */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          fontSize: '1.05rem',
          fontWeight: 500,
          lineHeight: 1.65,
          color: 'var(--text-main)'
        }}>
          {activeQNA ? (
            <MarkdownView content={activeQNA.question} />
          ) : (
            "Preparing personalized question..."
          )}
        </div>
      </div>

      {/* Response Workspace */}
      <form onSubmit={(e) => handleSubmitAnswer(e, false)} className="hm-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
        {/* Mode Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              style={{
                background: activeTab === 'text' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: `1px solid ${activeTab === 'text' ? 'var(--primary)' : 'transparent'}`,
                color: activeTab === 'text' ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <MessageSquare size={14} /> Verbal / Text Answer
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              style={{
                background: activeTab === 'code' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: `1px solid ${activeTab === 'code' ? 'var(--primary)' : 'transparent'}`,
                color: activeTab === 'code' ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Code2 size={14} /> Live Code Editor
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            style={{
              background: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-secondary)',
              border: `1px solid ${isRecording ? 'var(--error)' : 'var(--border-color)'}`,
              color: isRecording ? 'var(--error)' : 'var(--text-secondary)',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {isRecording ? <><MicOff size={14} /> Listening (Phase 4)...</> : <><Mic size={14} /> Voice Input</>}
          </button>
        </div>

        {/* Input area */}
        {activeTab === 'text' ? (
          <textarea
            required={activeTab === 'text'}
            rows={6}
            className="hm-input"
            placeholder="Type your structured answer here. Include concepts, trade-offs, and examples where applicable..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />
        ) : (
          <CodeEditor
            initialCode={codeSnippet}
            onCodeChange={(c, lang) => {
              setCodeSnippet(c);
              setCodeLanguage(lang);
            }}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {activeTab === 'text'
              ? `Word Count: ${currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} words`
              : `Language: ${codeLanguage.toUpperCase()} Code Solution`}
          </span>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Skip Question Button */}
            <button
              type="button"
              onClick={() => handleSubmitAnswer(undefined, true)}
              disabled={submitting}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--error)',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
            >
              <SkipForward size={15} /> Skip Question (-Score Penalty)
            </button>

            <button type="submit" disabled={submitting} className="hm-btn-primary">
              {submitting ? 'Evaluating Response...' : <>Submit Answer <Send size={16} /></>}
            </button>
          </div>
        </div>
      </form>

      {/* Upgraded Code Analytics Card */}
      {codeEval && (
        <div className="hm-card" style={{ border: `1px solid ${getScoreColor(codeEval.logic_score)}`, background: 'rgba(23, 23, 23, 0.95)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '8px' }}>
                <Code2 size={22} color={getScoreColor(codeEval.logic_score)} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Code Logic Analysis</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evaluated Asymptotic & Logic Correctness</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="hm-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.8rem' }}>
                TIME: {codeEval.time_complexity}
              </span>
              <span className="hm-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.8rem' }}>
                SPACE: {codeEval.space_complexity}
              </span>
              <span style={{
                background: getScoreColor(codeEval.logic_score),
                color: '#000000',
                fontWeight: 800,
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                Score: {codeEval.logic_score}/10
              </span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
            <MarkdownView content={codeEval.feedback_good} />
          </div>
        </div>
      )}

      {/* Upgraded Micro Evaluation Card */}
      {lastEval && (
        <div className="hm-card" style={{ border: `1px solid ${getScoreColor(lastEval.overall_score)}`, background: 'rgba(23, 23, 23, 0.95)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Micro Eval Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.55rem', borderRadius: '10px' }}>
                <Zap size={22} color={getScoreColor(lastEval.overall_score)} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Micro Evaluation Breakdown</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Multi-Turn Context & Technical Alignment</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="hm-badge hm-badge-emerald">
                Context Evaluated
              </span>
              <div style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${getScoreColor(lastEval.overall_score)}`,
                padding: '0.4rem 1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Score:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: getScoreColor(lastEval.overall_score) }}>
                  {lastEval.overall_score} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/ 10</span>
                </span>
              </div>
            </div>
          </div>

          {/* Micro Evaluation Category Meters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Technical Depth</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: getScoreColor(lastEval.technical_score) }}>{lastEval.technical_score} / 10</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Communication</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: getScoreColor(lastEval.communication_score) }}>{lastEval.communication_score} / 10</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Clarity & Structure</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: getScoreColor(lastEval.clarity_score) }}>{lastEval.clarity_score} / 10</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Completeness</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: getScoreColor(lastEval.completeness_score) }}>{lastEval.completeness_score} / 10</div>
            </div>
          </div>

          {/* Feedback Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '1.15rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> Key Strengths
              </div>
              <MarkdownView content={lastEval.feedback_good} />
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '1.15rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warning)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <Lightbulb size={16} /> Actionable Improvement
              </div>
              <MarkdownView content={lastEval.feedback_improvement} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
