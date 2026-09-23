/**
 * Home Page Component
 * Mind Nest - University Web Applications Assignment
 * Demonstrates:
 * - Hero banner with free sample preview lessons for guests
 * - Core architectural pillars (Learn, Breathe, Grow)
 * - Interactive teaser for the breathing exercise
 * - External CSS (Home.css)
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  Wind,
  BookOpen,
  ArrowRight,
  Play,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Volume2,
  FileText,
} from 'lucide-react';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import '../styles/Home.css';

interface HomeProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAudio: (item: any) => void;
  onOpenVideo: (item: any) => void;
  onOpenArticle: (item: any) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenAudio,
  onOpenVideo,
  onOpenArticle,
}) => {
  const { user, isMember } = useAuth();
  const [previewContents, setPreviewContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreviews() {
      try {
        const res = await api.getContent();
        if (res.success && res.contents) {
          // Take preview items for guests
          const previews = res.contents.filter((c: any) => c.isPreview).slice(0, 3);
          setPreviewContents(previews);
        }
      } catch (err) {
        console.error('Failed to load preview lessons:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPreviews();
  }, []);

  const handleLaunchContent = (item: any) => {
    if (item.type === 'audio') onOpenAudio(item);
    else if (item.type === 'video') onOpenVideo(item);
    else onOpenArticle(item);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-eyebrow">
              <Sparkles size={16} />
              <span>Full-Stack MERN Mental Health & Mindfulness Sanctuary</span>
            </div>

            <h1 className="hero-title">
              A gentle space to <span>learn</span>, <span>breathe</span>, and <span>grow</span>.
            </h1>

            <p className="hero-subtitle">
              Mind Nest is an evidence-informed wellness application created for university students
              and researchers. Explore guided audio meditations, somatic breathing tools, and clinical
              self-assessments designed to quiet academic stress and cognitive overload.
            </p>

            <div className="hero-cta-group">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('breathing')}
              >
                <Wind size={20} />
                <span>Start Breathing Exercise</span>
              </button>

              <button
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate('library')}
              >
                <span>Browse Meditation Library</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {!isMember && (
              <div
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                }}
              >
                <CheckCircle2 size={16} color="var(--sage-600)" />
                <span>Guest mode active. Free sample lessons ready to play instantly below.</span>
              </div>
            )}
          </div>

          {/* Hero Visual Preview Card */}
          <div className="hero-card-preview">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
              alt="Meditative lake reflections"
              className="hero-img"
            />
            <div className="hero-floating-badge">
              <div>
                <span className="badge badge-preview" style={{ marginBottom: '4px' }}>
                  ★ Free Guest Sample
                </span>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--sage-900)' }}>
                  5-Min Ocean Breath
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Led by Dr. Elena Vance • Calms Nervous System
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (previewContents.length > 0) handleLaunchContent(previewContents[0]);
                  else onNavigate('library');
                }}
              >
                <Play size={14} />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Medical Disclaimer Banner */}
      <div className="container">
        <MedicalDisclaimerBanner />
      </div>

      {/* Three Pillars Section */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">The Three Pillars of Mind Nest</h2>
            <p className="section-subtitle">
              Grounded in cognitive behavioural principles and polyvagal science to support daily academic life.
            </p>
          </div>

          <div className="grid-3">
            <div className="pillar-card">
              <div
                className="pillar-icon-box"
                style={{ backgroundColor: 'var(--sage-100)', color: 'var(--sage-700)' }}
              >
                <BookOpen size={30} />
              </div>
              <h3 className="pillar-title">1. Learn (Psychoeducation)</h3>
              <p className="pillar-desc">
                Gain clarity on the neurobiology of burnout, sleep architecture, and attentional fatigue
                through guided audio practices and evidence-based articles.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('library')}
              >
                Explore Library
              </button>
            </div>

            <div className="pillar-card">
              <div
                className="pillar-icon-box"
                style={{ backgroundColor: 'var(--accent-sky-soft)', color: 'var(--accent-sky)' }}
              >
                <Wind size={30} />
              </div>
              <h3 className="pillar-title">2. Breathe (Somatic Regulation)</h3>
              <p className="pillar-desc">
                Sync with our interactive CSS-animated breathing bubble. Shift instantly into parasympathetic
                rest with Box Breathing (4-4-4-4) and 4-7-8 relaxing patterns.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('breathing')}
              >
                Launch Bubble Guide
              </button>
            </div>

            <div className="pillar-card">
              <div
                className="pillar-icon-box"
                style={{ backgroundColor: 'var(--accent-gold-soft)', color: 'var(--accent-gold)' }}
              >
                <Sparkles size={30} />
              </div>
              <h3 className="pillar-title">3. Grow (Self-Assessment)</h3>
              <p className="pillar-desc">
                Check your stress load with clinically inspired questionnaires (PSS-4 & GAD), receive
                dynamic scores, and track your daily mindfulness streaks over time.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('assessment')}
              >
                Take Assessment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Sample Preview Showcase */}
      <section className="preview-showcase-section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-preview" style={{ marginBottom: '10px' }}>
              Guest Access Enabled
            </span>
            <h2 className="section-title">Free Sample Lessons for Non-Registered Guests</h2>
            <p className="section-subtitle">
              Try these selected mindfulness resources right now without an account, or register free to unlock the complete library.
            </p>
          </div>

          <div className="grid-3">
            {previewContents.map((item) => (
              <div key={item._id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '170px' }}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    className="badge badge-preview"
                    style={{ position: 'absolute', top: '12px', left: '12px' }}
                  >
                    ★ Free Sample
                  </span>
                  <span
                    className="badge badge-sage"
                    style={{ position: 'absolute', top: '12px', right: '12px' }}
                  >
                    {item.type === 'audio' ? 'Guided Audio' : item.type === 'video' ? 'Video' : 'Article'}
                  </span>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--sage-700)', fontWeight: 700, marginBottom: '6px' }}>
                    {item.category.toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--sage-900)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {item.duration ? `${item.duration} mins` : item.readTime}
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleLaunchContent(item)}
                    >
                      {item.type === 'audio' ? <Play size={14} /> : item.type === 'video' ? <Play size={14} /> : <FileText size={14} />}
                      <span>Open Lesson</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!user && (
            <div
              style={{
                marginTop: '40px',
                textAlign: 'center',
                padding: '24px',
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-medium)',
              }}
            >
              <h4 style={{ color: 'var(--sage-900)', marginBottom: '8px' }}>
                Want to unlock all 10+ guided meditations, videos, and personalized progress tracking?
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Create a free member account in seconds to save your favorite exercises and log daily streaks.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onOpenAuth('register')}
              >
                Register as Member (Free)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Inspirational Quote Banner */}
      <section className="container">
        <div className="quote-banner">
          <p className="quote-text">
            “You cannot stop the waves, but you can learn how to surf.”
          </p>
          <div className="quote-author">Dr. Jon Kabat-Zinn — Founder of MBSR</div>
        </div>
      </section>
    </div>
  );
};
