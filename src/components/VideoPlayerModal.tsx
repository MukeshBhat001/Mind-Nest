/**
 * Video Player Modal Component for Somatic Movement & Visual Meditations
 * Mind Nest - University Web Applications Assignment
 */
import React, { useState } from 'react';
import { X, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface VideoPlayerModalProps {
  content: {
    _id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    duration?: number;
    mediaUrl?: string;
    thumbnail?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSessionLogged?: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  content,
  isOpen,
  onClose,
  onSessionLogged,
}) => {
  const { user } = useAuth();
  const [logged, setLogged] = useState(false);

  if (!isOpen || !content) return null;

  const handleVideoEnded = async () => {
    setLogged(true);
    if (user) {
      try {
        await api.logSession({
          contentId: content._id,
          contentTitle: content.title,
          contentType: 'video',
          durationMinutes: content.duration || 6,
        });
        if (onSessionLogged) onSessionLogged();
      } catch (err) {
        console.error('Failed to log video session:', err);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', padding: '0', overflow: 'hidden' }}
      >
        <div style={{ position: 'relative', backgroundColor: '#000' }}>
          <button
            onClick={onClose}
            className="close-modal-btn"
            style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            <X size={18} />
          </button>

          <video
            src={content.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
            controls
            autoPlay
            poster={content.thumbnail}
            onEnded={handleVideoEnded}
            style={{ width: '100%', maxHeight: '420px', display: 'block' }}
          />
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-sage">{content.category}</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {content.duration || 6} min guided movement
            </span>
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--sage-900)' }}>
            {content.title}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {content.description}
          </p>

          {logged && (
            <div
              style={{
                backgroundColor: 'var(--sage-100)',
                color: 'var(--sage-800)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.88rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>Session completed! Logged to your personal Mind Nest activity tracker.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
