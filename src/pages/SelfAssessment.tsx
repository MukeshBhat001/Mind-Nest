/**
 * Self-Assessment & Mental Vitality Page Component
 * Mind Nest - University Web Applications Assignment
 * Demonstrates:
 * - Dynamic score computation across multi-item scales (PSS-4 & GAD-based)
 * - Tailored content routing / recommendations
 * - Prominent medical disclaimer
 * - History storage in database
 * - External CSS (SelfAssessment.css) & Inline CSS (dynamic score gauge)
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  ArrowRight,
  BookOpen,
  Calendar,
  Lock,
  Sparkles,
} from 'lucide-react';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import '../styles/SelfAssessment.css';

interface SelfAssessmentProps {
  onNavigateToCategory: (category: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const SelfAssessment: React.FC<SelfAssessmentProps> = ({
  onNavigateToCategory,
  onOpenAuth,
}) => {
  const { user, isMember } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuizId, setActiveQuizId] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'take' | 'history'>('take');
  const [loading, setLoading] = useState(true);

  // Load quizzes
  useEffect(() => {
    async function loadQuizzes() {
      try {
        setLoading(true);
        const res = await api.getQuizzes();
        if (res.success && res.quizzes.length > 0) {
          setQuizzes(res.quizzes);
          setActiveQuizId(res.quizzes[0]._id);
        }

        if (user) {
          const histRes = await api.getQuizHistory();
          if (histRes.success && histRes.history) {
            setHistory(histRes.history);
          }
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, [user]);

  const activeQuiz = quizzes.find((q) => q._id === activeQuizId);

  const handleSelectOption = (questionId: string, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: points,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuiz) return;

    // Check if all questions are answered
    const unanswered = activeQuiz.questions.filter((q: any) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      alert(`Please answer all ${activeQuiz.questions.length} questions before submitting.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitQuiz({
        quizId: activeQuiz._id,
        answers,
      });

      if (res.success && res.evaluation) {
        setEvaluation(res.evaluation);

        // Refresh history if member
        if (user) {
          const histRes = await api.getQuizHistory();
          if (histRes.success) {
            setHistory(histRes.history);
          }
        }
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setEvaluation(null);
  };

  // Color selection based on stress tier
  const getTierColor = (level: string) => {
    if (level?.toLowerCase().includes('low') || level?.toLowerCase().includes('minimal')) return '#43a047';
    if (level?.toLowerCase().includes('moderate') || level?.toLowerCase().includes('mild')) return '#fb8c00';
    return '#e53935';
  };

  return (
    <div className="assessment-container">
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="badge badge-sage" style={{ marginBottom: '8px' }}>
            <ClipboardCheck size={14} style={{ marginRight: '4px' }} />
            Academic Mental Vitality Check
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--sage-900)', marginBottom: '8px' }}>
            Evidence-Informed Self-Assessment
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Reflect on current stress demands and receive personalized mindfulness curriculum suggestions.
          </p>
        </div>

        {/* Prominent Medical Disclaimer */}
        <MedicalDisclaimerBanner />

        {/* View Switcher: Take Assessment vs History */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '24px 0 32px' }}>
          <button
            className={`btn ${activeTab === 'take' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('take')}
          >
            <ClipboardCheck size={16} />
            <span>Complete Assessment</span>
          </button>

          {isMember ? (
            <button
              className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={16} />
              <span>Personal History ({history.length})</span>
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => onOpenAuth('register')}
              title="Register free to track scores over time"
            >
              <Lock size={14} />
              <span>Save History (Join Free)</span>
            </button>
          )}
        </div>

        {activeTab === 'history' ? (
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--sage-900)', marginBottom: '16px' }}>
              Your Past Self-Assessment Evaluations
            </h3>
            {history.length === 0 ? (
              <div className="card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <ClipboardCheck size={36} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                <p>No recorded evaluations yet. Take your first assessment to begin tracking!</p>
              </div>
            ) : (
              history.map((record) => (
                <div key={record._id} className="history-card">
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--sage-900)', fontSize: '1.05rem', marginBottom: '4px' }}>
                      {record.quizTitle}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                      <span style={{ fontWeight: 600, color: getTierColor(record.stressLevel) }}>
                        {record.stressLevel}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--sage-800)' }}>
                      {record.totalScore}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      /{record.maxScore} pts
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : evaluation ? (
          /* Dynamic Results Screen */
          <div className="quiz-card" style={{ textAlign: 'center' }}>
            <span className="badge badge-sage" style={{ marginBottom: '14px' }}>
              Dynamically Evaluated
            </span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--sage-900)', marginBottom: '6px' }}>
              Assessment Results: {evaluation.stressLevel}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 24px' }}>
              {evaluation.description}
            </p>

            {/* 
              DEMONSTRATION OF INLINE STYLING:
              Inline CSS variables and dynamic border color for circular score gauge
            */}
            <div
              className="result-score-gauge"
              style={{
                backgroundColor: 'var(--sage-50)',
                border: `4px solid ${getTierColor(evaluation.stressLevel)}`,
                color: getTierColor(evaluation.stressLevel),
              }}
            >
              <div className="gauge-score-number">{evaluation.totalScore}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                out of {evaluation.maxScore}
              </div>
            </div>

            {/* Recommendations Block */}
            <div className="recommendations-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={18} color="var(--sage-700)" />
                <strong style={{ fontSize: '1.05rem', color: 'var(--sage-900)' }}>
                  Personalized Mind Nest Recommendations:
                </strong>
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {evaluation.recommendations.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>

              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--sage-800)' }}>
                  Curated focus category: {evaluation.recommendedCategory}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onNavigateToCategory(evaluation.recommendedCategory)}
                >
                  <BookOpen size={14} />
                  <span>View {evaluation.recommendedCategory} Exercises</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={handleRetake}>
                Retake Assessment
              </button>
              {!isMember && (
                <button className="btn btn-primary" onClick={() => onOpenAuth('register')}>
                  Save These Results (Register Free)
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Questionnaire Form */
          <div>
            {/* Template Selector if more than 1 available */}
            {quizzes.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {quizzes.map((q) => (
                  <button
                    key={q._id}
                    className={`btn btn-sm ${activeQuizId === q._id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setActiveQuizId(q._id);
                      setAnswers({});
                    }}
                  >
                    <span>{q.title.split('(')[0].trim()}</span>
                    {q.isPreview && <span className="badge badge-preview" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>Free</span>}
                  </button>
                ))}
              </div>
            )}

            {activeQuiz && (
              <form onSubmit={handleSubmit} className="quiz-card">
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--sage-900)', marginBottom: '6px' }}>
                    {activeQuiz.title}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {activeQuiz.description}
                  </p>
                </div>

                {activeQuiz.questions.map((q: any, qIdx: number) => (
                  <div key={q.id} className="question-block">
                    <div className="question-prompt">
                      {qIdx + 1}. {q.prompt}
                    </div>

                    <div className="options-grid">
                      {q.options.map((opt: any) => {
                        const isSelected = answers[q.id] === opt.points;
                        return (
                          <button
                            type="button"
                            key={opt.label}
                            className={`option-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectOption(q.id, opt.points)}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '12px' }}
                  disabled={isSubmitting}
                >
                  <ClipboardCheck size={18} />
                  <span>{isSubmitting ? 'Evaluating Responses...' : 'Calculate My Score & Recommendations'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
