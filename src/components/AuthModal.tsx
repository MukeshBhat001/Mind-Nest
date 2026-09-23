/**
 * Authentication Modal Component
 * Demonstrates:
 * - JWT Signup / Login
 * - Real-time client-side form validation (regex, length, matching)
 * - Password strength meter
 * - 1-Click test accounts for easy role switching (Admin vs Member)
 * - Inline styling demonstration for dynamic password strength bar
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { validateLoginForm, validateRegisterForm, getPasswordStrength } from '../utils/validation';
import '../styles/AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrors({});
    setServerError(null);
  };

  const handleFillDemo = (demoType: 'admin' | 'member') => {
    setMode('login');
    setErrors({});
    setServerError(null);
    if (demoType === 'admin') {
      setEmail('admin@mindnest.org');
      setPassword('admin123');
    } else {
      setEmail('member@mindnest.org');
      setPassword('member123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (mode === 'login') {
      const validation = validateLoginForm({ email, password });
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      setIsSubmitting(true);
      const res = await login({ email, password });
      setIsSubmitting(false);

      if (res.success) {
        onClose();
      } else {
        setServerError(res.message || 'Login failed. Please check credentials.');
      }
    } else {
      const validation = validateRegisterForm({ name, email, password, confirmPassword });
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      setIsSubmitting(true);
      const res = await register({ name, email, password });
      setIsSubmitting(false);

      if (res.success) {
        onClose();
      } else {
        setServerError(res.message || 'Registration failed.');
      }
    }
  };

  const pwdStrength = getPasswordStrength(password);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="auth-header">
          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome Back to Mind Nest' : 'Create Your Sanctuary'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your saved favorites and session streaks.'
              : 'Join as a registered member to unlock full lessons and progress history.'}
          </p>
        </div>

        {/* 1-Click Demo Fill for University Evaluation */}
        <div className="demo-credentials-box">
          <div className="demo-title">
            <Shield size={14} />
            <span>Fast Examiner / Evaluation Login:</span>
          </div>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleFillDemo('admin')}
            >
              🔑 Load Admin (Full CRUD)
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleFillDemo('member')}
            >
              👤 Load Registered Member
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeChange('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleModeChange('register')}
          >
            Register Member
          </button>
        </div>

        {serverError && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Maya Lin"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="e.g. name@university.edu"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-pwd">Password</label>
            <input
              id="auth-pwd"
              type="password"
              placeholder="••••••••"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}

            {/* Password strength indicator for registration */}
            {mode === 'register' && password && (
              <div>
                <div className="password-meter-track">
                  {/* INLINE STYLING DEMONSTRATION */}
                  <div
                    className="password-meter-fill"
                    style={{
                      width: `${(pwdStrength.score / 4) * 100}%`,
                      backgroundColor: pwdStrength.color,
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: pwdStrength.color }}>
                  Strength: {pwdStrength.label}
                </div>
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-confirm-pwd">Confirm Password</label>
              <input
                id="auth-confirm-pwd"
                type="password"
                placeholder="••••••••"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In to Mind Nest'
              : 'Create Free Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
