/**
 * Mind Nest: A Safe Space to Learn, Breathe, and Grow
 * University Web Applications Course Assignment
 * Full-Stack MERN Architecture
 */
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { MeditationLibrary } from './pages/MeditationLibrary';
import { BreathingExercise } from './pages/BreathingExercise';
import { SelfAssessment } from './pages/SelfAssessment';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AudioPlayerModal } from './components/AudioPlayerModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { StyleDemonstratorNotice } from './components/StyleDemonstratorNotice';

function MainAppContent() {
  const { user, isMember, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [activeAudioItem, setActiveAudioItem] = useState<any | null>(null);
  const [activeVideoItem, setActiveVideoItem] = useState<any | null>(null);
  const [activeArticleItem, setActiveArticleItem] = useState<any | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (tab: string) => {
    // Check route permissions
    if (tab === 'dashboard' && !isMember) {
      handleOpenAuth('login');
      return;
    }
    if (tab === 'admin' && !isAdmin) {
      handleOpenAuth('login');
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCategory = (category: string) => {
    setCurrentTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* University Coursework Style Compliance Notice */}
      <StyleDemonstratorNotice />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Page Routing */}
      <main style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
            onOpenAudio={(item) => setActiveAudioItem(item)}
            onOpenVideo={(item) => setActiveVideoItem(item)}
            onOpenArticle={(item) => setActiveArticleItem(item)}
          />
        )}

        {currentTab === 'library' && (
          <MeditationLibrary
            onOpenAudio={(item) => setActiveAudioItem(item)}
            onOpenVideo={(item) => setActiveVideoItem(item)}
            onOpenArticle={(item) => setActiveArticleItem(item)}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'breathing' && <BreathingExercise />}

        {currentTab === 'assessment' && (
          <SelfAssessment
            onNavigateToCategory={handleNavigateToCategory}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'dashboard' && isMember && (
          <UserDashboard
            onOpenAudio={(item) => setActiveAudioItem(item)}
            onOpenVideo={(item) => setActiveVideoItem(item)}
            onOpenArticle={(item) => setActiveArticleItem(item)}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin' && isAdmin && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <AudioPlayerModal
        content={activeAudioItem}
        isOpen={!!activeAudioItem}
        onClose={() => setActiveAudioItem(null)}
      />

      <VideoPlayerModal
        content={activeVideoItem}
        isOpen={!!activeVideoItem}
        onClose={() => setActiveVideoItem(null)}
      />

      <ArticleReaderModal
        content={activeArticleItem}
        isOpen={!!activeArticleItem}
        onClose={() => setActiveArticleItem(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
