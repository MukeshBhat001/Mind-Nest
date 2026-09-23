/**
 * Navigation Bar Component
 * Mind Nest - University Web Applications Assignment
 * Demonstrates: External CSS (imported Navbar.css) and Inline CSS (for dynamic role badge styling)
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Wind, BookOpen, ClipboardCheck, User, Shield, LogOut, LogIn, Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAuth }) => {
  const { user, isAdmin, isMember, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <button
          className="brand-link"
          onClick={() => handleNavClick('home')}
          aria-label="Mind Nest Home"
        >
          <div className="brand-icon-wrapper">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="brand-title">Mind Nest</div>
            <div className="brand-tagline">Learn • Breathe • Grow</div>
          </div>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <button
              className={`nav-item-btn ${currentTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${currentTab === 'library' ? 'active' : ''}`}
              onClick={() => handleNavClick('library')}
            >
              <BookOpen size={16} />
              Meditation Library
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${currentTab === 'breathing' ? 'active' : ''}`}
              onClick={() => handleNavClick('breathing')}
            >
              <Wind size={16} />
              Breathing Space
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${currentTab === 'assessment' ? 'active' : ''}`}
              onClick={() => handleNavClick('assessment')}
            >
              <ClipboardCheck size={16} />
              Self-Assessment
            </button>
          </li>

          {/* Member Protected Route */}
          {isMember && (
            <li>
              <button
                className={`nav-item-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                <User size={16} />
                My Nest
              </button>
            </li>
          )}

          {/* Administrator Protected Route */}
          {isAdmin && (
            <li>
              <button
                className={`nav-item-btn ${currentTab === 'admin' ? 'active' : ''}`}
                onClick={() => handleNavClick('admin')}
              >
                <Shield size={16} />
                Admin Panel
              </button>
            </li>
          )}
        </ul>

        {/* User Auth Controls */}
        <div className="nav-auth-section">
          {user ? (
            <div className="flex items-center gap-sm">
              <div className="user-pill">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={user.name}
                  className="user-avatar"
                />
                <span className="user-name">{user.name.split(' ')[0]}</span>

                {/* DEMONSTRATION OF INLINE STYLING as required by assignment */}
                <span
                  style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    backgroundColor: user.role === 'admin' ? '#c86d51' : '#4f839f',
                    color: '#ffffff',
                  }}
                >
                  {user.role}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={logout}
                title="Log out of account"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-sm">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenAuth('login')}
              >
                <LogIn size={15} />
                <span>Log In</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onOpenAuth('register')}
              >
                Join Free
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
