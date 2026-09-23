/**
 * Article Reader Modal Component
 * Mind Nest - University Web Applications Assignment
 * Demonstrates: Font scaling, structured reading layout, and session logging
 */
import React, { useState } from 'react';
import { X, BookOpen, Clock, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ArticleReaderModalProps {
  content: {
    _id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    readTime?: string;
    contentBody?: string;
    thumbnail?: string;
    createdAt?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSessionLogged?: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  content,
  isOpen,
  onClose,
  onSessionLogged,
}) => {
  const { user } = useAuth();
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [markedRead, setMarkedRead] = useState(false);

  if (!isOpen || !content) return null;

  const handleMarkRead = async () => {
    setMarkedRead(true);
    if (user) {
      try {
        await api.logSession({
          contentId: content._id,
          contentTitle: content.title,
          contentType: 'article',
          durationMinutes: 4,
        });
        if (onSessionLogged) onSessionLogged();
      } catch (err) {
        console.error('Failed to log article reading:', err);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', padding: '0', overflow: 'hidden' }}
      >
        <div style={{ position: 'relative', height: '160px' }}>
          <img
            src={content.thumbnail || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80'}
            alt={content.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(23, 36, 23, 0.75), transparent)',
            }}
          />
          <button
            onClick={onClose}
            className="close-modal-btn"
            style={{ position: 'absolute', top: 12, right: 12, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '28px' }}>
          {/* Header Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="badge badge-sage">{content.category} • Psychoeducation</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-secondary btn-sm ${fontSize === 'normal' ? 'btn-primary' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                onClick={() => setFontSize('normal')}
              >
                A
              </button>
              <button
                className={`btn btn-secondary btn-sm ${fontSize === 'large' ? 'btn-primary' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.88rem' }}
                onClick={() => setFontSize('large')}
              >
                A+
              </button>
            </div>
          </div>

          <h2 style={{ fontSize: '1.45rem', marginBottom: '10px', color: 'var(--sage-900)' }}>
            {content.title}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} />
              {content.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              {content.readTime || '4 min read'}
            </span>
          </div>

          {/* Article Body Content */}
          <div
            style={{
              fontSize: fontSize === 'normal' ? '0.95rem' : '1.1rem',
              lineHeight: '1.8',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '8px',
              marginBottom: '20px',
            }}
          >
            {content.contentBody || content.description}
          </div>

          {/* Complete Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            {markedRead ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sage-600)', fontSize: '0.9rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>Article completed! Logged to your reading records.</span>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleMarkRead}
              >
                <CheckCircle2 size={16} />
                <span>Mark as Finished & Log Progress</span>
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close Reader
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
