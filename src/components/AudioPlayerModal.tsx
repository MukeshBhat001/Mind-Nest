/**
 * Audio Player Modal Component for Guided Meditations
 * Mind Nest - University Web Applications Assignment
 * Demonstrates:
 * - HTML5 Audio playback + Web Audio ambient synthesis fallback
 * - Real-time progress bar with Inline Styling
 * - Automatic session logging via REST API on completion
 */
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, CheckCircle2, Heart, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { playSingingBowl } from '../utils/soundEffects';

interface AudioPlayerModalProps {
  content: {
    _id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    duration?: number;
    mediaUrl?: string;
    contentBody?: string;
    thumbnail?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSessionLogged?: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  content,
  isOpen,
  onClose,
  onSessionLogged,
}) => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState((content?.duration || 5) * 60);
  const [showTranscript, setShowTranscript] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (content) {
      setTotalDuration((content.duration || 5) * 60);
      setCurrentTime(0);
      setIsPlaying(false);
      setIsCompleted(false);
    }
  }, [content]);

  // Timer simulation if external audio stream is paused or synthetic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            handleCompleteSession();
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, totalDuration]);

  if (!isOpen || !content) return null;

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Autoplay or cross-origin restrictions gracefully simulated via timer
        });
      }
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleCompleteSession = async () => {
    setIsPlaying(false);
    setIsCompleted(true);
    playSingingBowl();

    if (user) {
      try {
        await api.logSession({
          contentId: content._id,
          contentTitle: content.title,
          contentType: 'audio',
          durationMinutes: Math.max(1, Math.round(totalDuration / 60)),
        });
        if (onSessionLogged) onSessionLogged();
      } catch (err) {
        console.error('Failed to log session:', err);
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) return;
    try {
      const res = await api.toggleFavorite(content._id);
      if (res.success) {
        setIsFavorited(res.isFavorited);
      }
    } catch {
      // ignore
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = Math.min(100, (currentTime / (totalDuration || 1)) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '0', overflow: 'hidden' }}
      >
        {/* Header Visual Image */}
        <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
          <img
            src={content.thumbnail || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'}
            alt={content.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(23, 36, 23, 0.85), transparent)',
            }}
          />
          <button
            onClick={onClose}
            className="close-modal-btn"
            style={{ position: 'absolute', top: 12, right: 12, color: '#fff', backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            <X size={18} />
          </button>
          <div style={{ position: 'absolute', bottom: 16, left: 24, right: 24, color: '#fff' }}>
            <span className="badge badge-sage" style={{ marginBottom: 6 }}>
              {content.category} • Guided Meditation
            </span>
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>{content.title}</h3>
            <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>Led by {content.author}</div>
          </div>
        </div>

        {/* Audio Element */}
        {content.mediaUrl && (
          <audio
            ref={audioRef}
            src={content.mediaUrl}
            preload="metadata"
            onEnded={handleCompleteSession}
          />
        )}

        <div style={{ padding: '24px' }}>
          {isCompleted ? (
            <div
              style={{
                backgroundColor: 'var(--sage-100)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              <CheckCircle2 size={36} color="var(--sage-600)" style={{ margin: '0 auto 8px' }} />
              <h4 style={{ color: 'var(--sage-900)', marginBottom: '4px' }}>Mindfulness Session Complete!</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {user
                  ? 'Your meditation minutes have been logged to your progress tracking streak.'
                  : 'Well done! Sign in or register to preserve your daily streaks and saved favorites.'}
              </p>
            </div>
          ) : (
            <>
              {/* Progress Slider */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: 'var(--sage-100)',
                    borderRadius: '4px',
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPct = clickX / rect.width;
                    setCurrentTime(newPct * totalDuration);
                    if (audioRef.current) audioRef.current.currentTime = newPct * totalDuration;
                  }}
                >
                  {/* INLINE STYLING DEMONSTRATION for player bar */}
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      backgroundColor: 'var(--sage-600)',
                      transition: 'width 0.2s linear',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginTop: '6px',
                  }}
                >
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  marginBottom: '24px',
                }}
              >
                <button
                  onClick={handleRestart}
                  className="btn btn-secondary"
                  style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%' }}
                  title="Restart"
                >
                  <RotateCcw size={18} />
                </button>

                <button
                  onClick={togglePlay}
                  className="btn btn-primary"
                  style={{ width: '60px', height: '60px', padding: 0, borderRadius: '50%' }}
                >
                  {isPlaying ? <Pause size={26} /> : <Play size={26} style={{ marginLeft: 3 }} />}
                </button>

                {user && (
                  <button
                    onClick={handleToggleFavorite}
                    className="btn btn-secondary"
                    style={{
                      width: '42px',
                      height: '42px',
                      padding: 0,
                      borderRadius: '50%',
                      color: isFavorited ? '#c86d51' : 'inherit',
                    }}
                    title={isFavorited ? 'Saved to Favorites' : 'Add to Favorites'}
                  >
                    <Heart size={18} fill={isFavorited ? '#c86d51' : 'none'} />
                  </button>
                )}
              </div>
            </>
          )}

          {/* Transcript / Guidance Body */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'var(--sage-900)',
                }}
              >
                <BookOpen size={16} />
                <span>Guided Meditation Transcript & Practice</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript ? 'Hide Guidance' : 'Read Guidance'}
              </button>
            </div>

            {showTranscript && (
              <div
                style={{
                  backgroundColor: 'var(--sand-50)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  fontSize: '0.9rem',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-line',
                  color: 'var(--text-secondary)',
                }}
              >
                {content.contentBody || content.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
