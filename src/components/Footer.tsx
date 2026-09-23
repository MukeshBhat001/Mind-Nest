/**
 * Footer Component with Medical Disclaimer & Crisis Resources
 * Mind Nest - University Web Applications Assignment
 * Demonstrates: External CSS (Footer.css)
 */
import React from 'react';
import { Heart, Sparkles, ShieldAlert } from 'lucide-react';
import '../styles/Footer.css';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-title">Mind Nest</div>
            <p className="footer-desc">
              A university full-stack MERN web application built as an academic capstone.
              Providing an accessible, evidence-informed digital sanctuary for mindfulness,
              somatic emotional regulation, and stress self-reflection.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#97b197' }}>
              <Sparkles size={16} />
              <span>Full-Stack MERN Architecture</span>
            </div>
          </div>

          <div>
            <div className="footer-heading">Sanctuary</div>
            <ul className="footer-list">
              <li><button onClick={() => onNavigate('home')} style={{ color: 'inherit' }}>Home Welcome</button></li>
              <li><button onClick={() => onNavigate('library')} style={{ color: 'inherit' }}>Meditation Library</button></li>
              <li><button onClick={() => onNavigate('breathing')} style={{ color: 'inherit' }}>Breathing Bubble Guide</button></li>
              <li><button onClick={() => onNavigate('assessment')} style={{ color: 'inherit' }}>Stress Self-Assessment</button></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Access Levels</div>
            <ul className="footer-list">
              <li><span>1. Guest (Sample previews)</span></li>
              <li><span>2. Registered Member (History & Saves)</span></li>
              <li><span>3. Admin (Full CRUD Control)</span></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">24/7 Crisis Support</div>
            <div className="crisis-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <ShieldAlert size={16} color="#ffd8ce" />
                <strong>Immediate Support</strong>
              </div>
              <p>
                If you are in acute mental distress:
                <br />• <strong>Call / Text 988</strong> (Suicide & Crisis Lifeline)
                <br />• Text HOME to <strong>741741</strong> (Crisis Text Line)
                <br />• International: <strong>befrienders.org</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Mind Nest University Project. Made with care for mental wellness education.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Designed with standard CSS & MERN Stack</span>
            <Heart size={14} color="#e57373" />
          </div>
        </div>
      </div>
    </footer>
  );
};
