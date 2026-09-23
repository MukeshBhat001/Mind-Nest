/**
 * Meditation Learning Library Page Component
 * Mind Nest - University Web Applications Assignment
 * Demonstrates:
 * - Category filters (Sleep, Focus, Anxiety Relief, Mindfulness)
 * - Format tabs (Audio, Video, Articles)
 * - Sample preview tags for guests
 * - Protected full lessons for registered members
 * - Favorite saving (REST API)
 * - External CSS (MeditationLibrary.css) & Inline CSS (dynamic status badges)
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  BookOpen,
  Search,
  Volume2,
  Video,
  FileText,
  Lock,
  Play,
  Heart,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import '../styles/MeditationLibrary.css';

interface MeditationLibraryProps {
  onOpenAudio: (item: any) => void;
  onOpenVideo: (item: any) => void;
  onOpenArticle: (item: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const MeditationLibrary: React.FC<MeditationLibraryProps> = ({
  onOpenAudio,
  onOpenVideo,
  onOpenArticle,
  onOpenAuth,
}) => {
  const { user, isMember } = useAuth();
  const [contents, setContents] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Sleep', 'Focus', 'Anxiety Relief', 'Mindfulness'];
  const types = [
    { label: 'All Formats', value: 'All' },
    { label: 'Guided Audio', value: 'audio', icon: Volume2 },
    { label: 'Wellness Video', value: 'video', icon: Video },
    { label: 'Articles', value: 'article', icon: FileText },
  ];

  const loadContentAndFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.getContent({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        type: selectedType !== 'All' ? selectedType : undefined,
        search: searchQuery || undefined,
      });

      if (res.success && res.contents) {
        setContents(res.contents);
      }

      if (user) {
        const progRes = await api.getProgress();
        if (progRes.success && progRes.progress) {
          setFavorites(progRes.progress.favorites || []);
        }
      }
    } catch (err) {
      console.error('Error fetching library contents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContentAndFavorites();
  }, [selectedCategory, selectedType, searchQuery, user]);

  const handleToggleFavorite = async (e: React.MouseEvent, contentId: string) => {
    e.stopPropagation();
    if (!user) {
      onOpenAuth('login');
      return;
    }
    try {
      const res = await api.toggleFavorite(contentId);
      if (res.success) {
        setFavorites(res.favorites);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleOpenItem = (item: any) => {
    if (item.isLockedForGuest) {
      onOpenAuth('register');
      return;
    }
    if (item.type === 'audio') onOpenAudio(item);
    else if (item.type === 'video') onOpenVideo(item);
    else onOpenArticle(item);
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="library-hero">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-sage">Multimedia Curriculum</span>
            {!isMember && (
              <span className="badge badge-preview">
                Guest Mode: Sample Previews Available
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--sage-900)', marginBottom: '8px' }}>
            Meditation & Psychoeducation Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', fontSize: '1rem' }}>
            Explore scientific relaxation methods, somatic video release, and guided mindful audios
            curated for student resilience and cognitive recovery.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '70px' }}>
        {/* Controls Bar */}
        <div className="library-controls-bar">
          {/* Category Filter Pills */}
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Media Format Type Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {types.map((t) => (
              <button
                key={t.value}
                className={`btn btn-sm ${selectedType === t.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedType(t.value)}
              >
                {t.icon && <t.icon size={14} />}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search lessons & topics..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Items Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Sparkles size={32} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px' }} />
            <p>Loading mindfulness catalogue...</p>
          </div>
        ) : contents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <BookOpen size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h3>No exercises match your filter</h3>
            <p>Try resetting your search query or selecting 'All' categories.</p>
          </div>
        ) : (
          <div className="grid-3">
            {contents.map((item) => {
              const isFav = favorites.includes(item._id);

              return (
                <div key={item._id} className="content-card">
                  {/* Thumbnail & Badges */}
                  <div className="content-thumb-wrapper">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="content-thumb"
                    />

                    {/* Free Sample Badge vs Member Badge */}
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: '6px' }}>
                      {item.isPreview ? (
                        <span className="badge badge-preview">★ Free Preview</span>
                      ) : (
                        <span className="badge badge-member">
                          <Lock size={11} style={{ marginRight: 2 }} /> Member
                        </span>
                      )}
                      <span className="badge badge-sage">
                        {item.type === 'audio' ? 'Audio' : item.type === 'video' ? 'Video' : 'Article'}
                      </span>
                    </div>

                    {/* Favorite Toggle Button */}
                    <button
                      className={`favorite-btn-floating ${isFav ? 'is-active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, item._id)}
                      title={isFav ? 'Remove favorite' : 'Save to favorites'}
                    >
                      <Heart size={16} fill={isFav ? '#c86d51' : 'none'} />
                    </button>
                  </div>

                  {/* Card Details */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--sage-700)', fontWeight: 700, marginBottom: '6px' }}>
                      {item.category.toUpperCase()}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--sage-900)', marginBottom: '8px' }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1, lineHeight: 1.5 }}>
                      {item.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '14px',
                        borderTop: '1px solid var(--border-light)',
                        marginTop: 'auto',
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {item.duration ? `${item.duration} min` : item.readTime}
                      </span>

                      {item.isLockedForGuest ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenAuth('register')}
                        >
                          <Lock size={13} />
                          <span>Unlock (Free)</span>
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenItem(item)}
                        >
                          {item.type === 'audio' ? <Play size={13} /> : item.type === 'video' ? <Play size={13} /> : <FileText size={13} />}
                          <span>{item.type === 'article' ? 'Read' : 'Begin'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
