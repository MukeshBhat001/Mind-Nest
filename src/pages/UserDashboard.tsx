/**
 * Registered Member Dashboard Page Component
 * Mind Nest - University Web Applications Assignment
 * Demonstrates:
 * - Daily session logging & streak tracking
 * - Saved favorites list
 * - Editable profile information
 * - Chronological history logs
 * - External CSS (Dashboard.css) & Inline styling (dynamic streak badge)
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Heart,
  Flame,
  CheckCircle2,
  Clock,
  Calendar,
  Play,
  FileText,
  Volume2,
  Video,
  Sparkles,
  Edit2,
  Save,
  BookOpen,
} from 'lucide-react';
import '../styles/Dashboard.css';

interface UserDashboardProps {
  onOpenAudio: (item: any) => void;
  onOpenVideo: (item: any) => void;
  onOpenArticle: (item: any) => void;
  onNavigate: (tab: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenAudio,
  onOpenVideo,
  onOpenArticle,
  onNavigate,
}) => {
  const { user, updateUser } = useAuth();
  const [progress, setProgress] = useState<any | null>(null);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'favorites' | 'history' | 'profile'>('favorites');

  // Edit profile fields
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        const res = await api.getProgress();
        if (res.success && res.progress) {
          setProgress(res.progress);
          setFavoriteItems(res.progress.favoriteItems || []);
        }
      } catch (err) {
        console.error('Failed to load user progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      const res = await api.updateProfile({ name, bio });
      if (res.success) {
        updateUser({ name, bio });
        setEditMode(false);
        setSaveSuccessMsg('Profile changes saved successfully!');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLaunchItem = (item: any) => {
    if (item.type === 'audio') onOpenAudio(item);
    else if (item.type === 'video') onOpenVideo(item);
    else onOpenArticle(item);
  };

  const handleRemoveFavorite = async (e: React.MouseEvent, contentId: string) => {
    e.stopPropagation();
    try {
      const res = await api.toggleFavorite(contentId);
      if (res.success) {
        setFavoriteItems((prev) => prev.filter((item) => item._id !== contentId));
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Please log in to view your member dashboard.</h2>
      </div>
    );
  }

  // Calculate total meditation minutes
  const totalMinutes = (progress?.sessionLogs || []).reduce(
    (acc: number, log: any) => acc + (log.durationMinutes || 0),
    0
  );

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        {/* Profile Card Banner */}
        <div className="profile-card">
          <div className="profile-info-group">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user.name}
              className="profile-avatar-lg"
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.75rem', color: 'var(--sage-900)' }}>{user.name}</h1>
                <span className="badge badge-member">{user.role}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                {user.email}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                "{user.bio || 'Mindfulness explorer finding stillness on Mind Nest.'}"
              </p>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setTab('profile');
              setEditMode(true);
            }}
          >
            <Edit2 size={14} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Progress & Streak Metrics Grid */}
        <div className="grid-3" style={{ marginBottom: '36px' }}>
          <div className="streak-card">
            <Flame size={44} color="#ffd54f" />
            <div>
              <div className="streak-number">{progress?.currentStreak || 1}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, opacity: 0.9 }}>
                Day Mindfulness Streak
              </div>
              <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Log any session daily to keep it glowing!</div>
            </div>
          </div>

          <div className="stat-widget">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Clock size={22} color="var(--sage-600)" />
              <span className="badge badge-sage">Time Invested</span>
            </div>
            <div className="stat-value">{totalMinutes} min</div>
            <div className="stat-label">Total mindfulness & breathing time</div>
          </div>

          <div className="stat-widget">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <CheckCircle2 size={22} color="var(--accent-sky)" />
              <span className="badge badge-sage">Sessions</span>
            </div>
            <div className="stat-value">{progress?.sessionLogs?.length || 0}</div>
            <div className="stat-label">Total completed practices & readings</div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab-btn ${tab === 'favorites' ? 'active' : ''}`}
            onClick={() => setTab('favorites')}
          >
            <Heart size={16} />
            <span>Saved Favorites ({favoriteItems.length})</span>
          </button>

          <button
            className={`dashboard-tab-btn ${tab === 'history' ? 'active' : ''}`}
            onClick={() => setTab('history')}
          >
            <Clock size={16} />
            <span>Session History ({progress?.sessionLogs?.length || 0})</span>
          </button>

          <button
            className={`dashboard-tab-btn ${tab === 'profile' ? 'active' : ''}`}
            onClick={() => setTab('profile')}
          >
            <User size={16} />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Tab 1: Saved Favorites */}
        {tab === 'favorites' && (
          <div>
            {favoriteItems.length === 0 ? (
              <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Heart size={44} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <h3>No saved favorite meditations yet</h3>
                <p style={{ marginBottom: '18px' }}>
                  Explore the library and click the heart icon on any practice to keep it handy here.
                </p>
                <button className="btn btn-primary" onClick={() => onNavigate('library')}>
                  <BookOpen size={16} />
                  <span>Browse Meditation Library</span>
                </button>
              </div>
            ) : (
              <div className="grid-3">
                {favoriteItems.map((item) => (
                  <div key={item._id} className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: '160px' }}>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="badge badge-sage" style={{ position: 'absolute', top: 12, left: 12 }}>
                        {item.category}
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ position: 'absolute', top: 12, right: 12, padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.9)' }}
                        onClick={(e) => handleRemoveFavorite(e, item._id)}
                        title="Remove from favorites"
                      >
                        <Heart size={14} fill="#c86d51" color="#c86d51" />
                      </button>
                    </div>

                    <div style={{ padding: '18px' }}>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--sage-900)', marginBottom: '8px' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                        {item.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {item.duration ? `${item.duration} min` : item.readTime}
                        </span>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleLaunchItem(item)}
                        >
                          <Play size={13} />
                          <span>Practice Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Chronological Session Logs */}
        {tab === 'history' && (
          <div>
            {(!progress?.sessionLogs || progress.sessionLogs.length === 0) ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Clock size={36} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p>No recorded sessions yet. Try the 5-Minute Ocean Breath or a Breathing Cycle!</p>
              </div>
            ) : (
              progress.sessionLogs.map((log: any) => (
                <div key={log.id} className="activity-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--sage-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--sage-700)',
                      }}
                    >
                      {log.contentType === 'audio' ? (
                        <Volume2 size={18} />
                      ) : log.contentType === 'video' ? (
                        <Video size={18} />
                      ) : log.contentType === 'breathing' ? (
                        <Sparkles size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--sage-900)', fontSize: '0.96rem' }}>
                        {log.contentTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={12} />
                        <span>{new Date(log.completedAt).toLocaleString()}</span>
                        <span>• {log.contentType.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-sage">
                    +{log.durationMinutes} mins
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {tab === 'profile' && (
          <div className="card" style={{ padding: '32px', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--sage-900)', marginBottom: '16px' }}>
              Personalize Your Profile
            </h3>

            {saveSuccessMsg && (
              <div
                style={{
                  backgroundColor: 'var(--sage-100)',
                  color: 'var(--sage-800)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                }}
              >
                <CheckCircle2 size={16} color="var(--sage-600)" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label" htmlFor="user-display-name">Display Name</label>
                <input
                  id="user-display-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-registered-email">Registered Email</label>
                <input
                  id="user-registered-email"
                  type="email"
                  className="form-input"
                  value={user.email}
                  disabled
                  style={{ backgroundColor: '#f5f5f5', color: '#888' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Email is linked to your university account login.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-mindfulness-intent">Mindfulness Reflection / Bio</label>
                <textarea
                  id="user-mindfulness-intent"
                  className="form-textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short personal mindfulness intention or focus..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSavingProfile}
              >
                <Save size={16} />
                <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
