/**
 * Emotional Regulation & Breathing Space Page Component
 * Mind Nest - University Web Applications Assignment
 * Demonstrates:
 * 1. External CSS: imported BreathingExercise.css
 * 2. Internal CSS: Embedded <style> tag containing dynamic keyframe animation & aura styling
 * 3. Inline Styling: Dynamic transform, scale, transition timing, and background color interpolations
 * - Multiple evidence-based breathing techniques (Box Breathing, 4-7-8, Coherent)
 * - Automatic session logging to user progress
 * - Grounding coping strategies drawer
 */
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { playBreathCue, playSingingBowl } from '../utils/soundEffects';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Shield, CheckCircle2, Sparkles, Feather } from 'lucide-react';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import '../styles/BreathingExercise.css';

interface BreathingPattern {
  name: string;
  description: string;
  phases: { name: 'Inhale' | 'Hold' | 'Exhale' | 'Rest'; duration: number }[];
}

const PATTERNS: Record<string, BreathingPattern> = {
  box: {
    name: 'Box Breathing (4-4-4-4)',
    description: 'Equal ratio technique used by athletes & high-stress professionals to stabilize nervous system arousal.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
  },
  relax478: {
    name: '4-7-8 Relaxing Breath',
    description: 'Extended exhalation stimulates the vagus nerve and activates the parasympathetic response for sleep or acute panic.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
  },
  coherent: {
    name: 'Coherent Breathing (5.5 - 5.5)',
    description: 'Optimizes Heart Rate Variability (HRV) at 5.5 breaths per minute, syncing cardiovascular rhythm.',
    phases: [
      { name: 'Inhale', duration: 5.5 },
      { name: 'Exhale', duration: 5.5 },
    ],
  },
};

export const BreathingExercise: React.FC = () => {
  const { user } = useAuth();
  const [selectedPatternKey, setSelectedPatternKey] = useState<string>('box');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionLoggedMessage, setSessionLoggedMessage] = useState<string | null>(null);

  const pattern = PATTERNS[selectedPatternKey];
  const currentPhase = pattern.phases[phaseIndex];

  // Sound cue triggering
  const triggerPhaseSound = (phaseName: string) => {
    if (!soundEnabled) return;
    if (phaseName === 'Inhale') playBreathCue('inhale');
    else if (phaseName === 'Hold') playBreathCue('hold');
    else playBreathCue('exhale');
  };

  // Timer loop
  useEffect(() => {
    let timer: any = null;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const nextIdx = (phaseIndex + 1) % pattern.phases.length;
            setPhaseIndex(nextIdx);

            // If wrapped around to 0, completed one full cycle
            if (nextIdx === 0) {
              setCompletedCycles((c) => {
                const updated = c + 1;
                if (updated === 4) {
                  handleMilestoneReached();
                }
                return updated;
              });
            }

            const nextDuration = pattern.phases[nextIdx].duration;
            triggerPhaseSound(pattern.phases[nextIdx].name);
            return Math.ceil(nextDuration);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phaseIndex, pattern, soundEnabled]);

  const handleStart = () => {
    setIsActive(true);
    setPhaseIndex(0);
    setSecondsRemaining(Math.ceil(pattern.phases[0].duration));
    triggerPhaseSound(pattern.phases[0].name);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(Math.ceil(pattern.phases[0].duration));
    setCompletedCycles(0);
  };

  const handlePatternChange = (key: string) => {
    setSelectedPatternKey(key);
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(Math.ceil(PATTERNS[key].phases[0].duration));
  };

  const handleMilestoneReached = async () => {
    playSingingBowl();
    if (user) {
      try {
        await api.logSession({
          contentId: 'breath_' + selectedPatternKey,
          contentTitle: `${pattern.name} Somatic Practice`,
          contentType: 'breathing',
          durationMinutes: 4,
        });
        setSessionLoggedMessage('Awesome! 4 completed cycles recorded to your daily streak.');
        setTimeout(() => setSessionLoggedMessage(null), 5000);
      } catch (err) {
        console.error('Failed to log breathing streak:', err);
      }
    }
  };

  // Compute visual scale & color depending on breathing phase
  let bubbleScale = 1;
  let bubbleColor = '#5a875a'; // Sage green default

  if (isActive) {
    if (currentPhase.name === 'Inhale') {
      bubbleScale = 1.35;
      bubbleColor = '#4f839f'; // Sky blue expansion
    } else if (currentPhase.name === 'Hold') {
      bubbleScale = 1.35;
      bubbleColor = '#836e9c'; // Soothing lavender hold
    } else if (currentPhase.name === 'Exhale') {
      bubbleScale = 0.88;
      bubbleColor = '#5a875a'; // Deep sage exhalation
    }
  }

  return (
    <div className="breathing-page-wrapper">
      {/* 
        DEMONSTRATION OF INTERNAL CSS as required by university project:
        An embedded <style> tag demonstrating component-scoped styling and dynamic keyframe effects.
      */}
      <style>{`
        /* INTERNAL CSS DEMONSTRATION */
        @keyframes internalGlowPulsing {
          0% {
            box-shadow: 0 0 15px rgba(91, 133, 91, 0.2);
            transform: scale(0.98);
          }
          50% {
            box-shadow: 0 0 35px rgba(91, 133, 91, 0.45);
            transform: scale(1.02);
          }
          100% {
            box-shadow: 0 0 15px rgba(91, 133, 91, 0.2);
            transform: scale(0.98);
          }
        }

        .internal-breathing-aura {
          animation: internalGlowPulsing 4s ease-in-out infinite;
        }

        .cycle-chip-internal {
          background: linear-gradient(135deg, #e4ede4, #cadcca);
          border: 1px solid #a7c5a7;
          border-radius: 999px;
          padding: 4px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #253925;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 30px' }}>
          <span className="badge badge-sage" style={{ marginBottom: '8px' }}>
            <Wind size={13} style={{ marginRight: '4px' }} />
            Emotional Regulation Tool
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--sage-900)', marginBottom: '8px' }}>
            Interactive Breathing Space
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Regulate autonomic arousal and lower resting heart rate with rhythmic visual guidance.
          </p>
        </div>

        {/* Breathing Stage Card */}
        <div className="breathing-stage-card">
          {/* Pattern Selector */}
          <div className="pattern-selector-bar">
            {Object.keys(PATTERNS).map((k) => (
              <button
                key={k}
                className={`pattern-btn ${selectedPatternKey === k ? 'active' : ''}`}
                onClick={() => handlePatternChange(k)}
              >
                {PATTERNS[k].name}
              </button>
            ))}
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            {pattern.description}
          </p>

          {/* Interactive Breathing Bubble Display */}
          <div className="bubble-arena">
            <div className="bubble-outer-glow internal-breathing-aura" />

            {/* 
              DEMONSTRATION OF INLINE STYLING:
              Inline CSS variables and transitions calculating real-time scale, background color, and easing
            */}
            <div
              className="bubble-core"
              style={{
                transform: `scale(${bubbleScale})`,
                transition: isActive
                  ? `transform ${currentPhase.duration}s cubic-bezier(0.4, 0, 0.2, 1), background-color 1s ease`
                  : 'transform 0.4s ease, background-color 0.4s ease',
                backgroundColor: bubbleColor,
              }}
            >
              <div className="bubble-phase-text">
                {isActive ? currentPhase.name : 'Ready'}
              </div>
              <div className="bubble-timer-number">
                {isActive ? secondsRemaining : 'Start'}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '2px' }}>
                {isActive ? `${currentPhase.duration}s count` : 'Click Play below'}
              </div>
            </div>
          </div>

          {/* Cycles Counter */}
          <div style={{ marginBottom: '28px' }}>
            <span className="cycle-chip-internal">
              <Sparkles size={13} color="var(--sage-700)" />
              Completed Cycles: {completedCycles}
            </span>
          </div>

          {/* Session Logged Notification */}
          {sessionLoggedMessage && (
            <div
              style={{
                backgroundColor: 'var(--sage-100)',
                color: 'var(--sage-800)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.86rem',
                marginBottom: '20px',
              }}
            >
              <CheckCircle2 size={16} color="var(--sage-600)" />
              <span>{sessionLoggedMessage}</span>
            </div>
          )}

          {/* Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <button
              className="btn btn-secondary"
              onClick={handleReset}
              title="Reset cycle counter and timer"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>

            {!isActive ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleStart}
                style={{ paddingLeft: '28px', paddingRight: '28px' }}
              >
                <Play size={20} />
                <span>Begin Breathing</span>
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-lg"
                onClick={handlePause}
                style={{ paddingLeft: '28px', paddingRight: '28px' }}
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Tibetan bell chime cues' : 'Enable Tibetan bell chime cues'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Coping Strategies & Emotional Regulation Module */}
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--sage-900)', marginBottom: '8px', textAlign: 'center' }}>
            Evidence-Based Somatic Coping Strategies
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Techniques to combine with rhythmic breathing during high-stress exam periods or sensory overwhelm.
          </p>

          <div className="grid-3">
            <div className="coping-card">
              <div className="coping-title">
                <Feather size={20} color="var(--sage-600)" />
                <h4>5-4-3-2-1 Grounding</h4>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Anchor yourself immediately in physical reality to disrupt runaway catastrophic thinking:
                <br />• <strong>5</strong> things you can see
                <br />• <strong>4</strong> things you can feel
                <br />• <strong>3</strong> sounds you can hear
                <br />• <strong>2</strong> scents you can smell
                <br />• <strong>1</strong> positive self-truth
              </p>
            </div>

            <div className="coping-card">
              <div className="coping-title">
                <Shield size={20} color="var(--accent-sky)" />
                <h4>Progressive Relaxation</h4>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Release unconscious somatic armoring:
                <br />1. Tense your shoulder blades firmly towards your ears for 5 seconds.
                <br />2. Exhale slowly and let them drop down completely.
                <br />3. Unclench your jaw and let your tongue rest off the roof of your mouth.
              </p>
            </div>

            <div className="coping-card">
              <div className="coping-title">
                <Sparkles size={20} color="var(--accent-terracotta)" />
                <h4>Vagal Sigh Protocol</h4>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Demonstrated in Stanford neurobiology research:
                <br />• Take two consecutive sniffs through the nose without exhaling in between (filling lungs to capacity).
                <br />• Release with a long, unforced sigh through the mouth. Repeat 3 times to immediately drop heart rate.
              </p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '40px auto 0' }}>
          <MedicalDisclaimerBanner compact />
        </div>
      </div>
    </div>
  );
};
