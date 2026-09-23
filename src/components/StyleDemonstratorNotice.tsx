/**
 * University Course Assignment Stylistic Compliance Demonstrator
 * Mind Nest - University Web Applications Assignment
 * Explains how External CSS, Internal CSS, and Inline Styling are implemented.
 */
import React, { useState } from 'react';
import { Palette, ChevronDown, ChevronUp, Code, Check } from 'lucide-react';

export const StyleDemonstratorNotice: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        backgroundColor: 'var(--sage-100)',
        borderBottom: '1px solid var(--sage-300)',
        fontSize: '0.84rem',
        padding: '8px 16px',
        color: 'var(--sage-900)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={16} color="var(--sage-700)" />
          <strong>Coursework Architecture Note:</strong>
          <span>
            100% Native CSS (No Tailwind / UI frameworks). Demonstrates <strong>External</strong>, <strong>Internal</strong>, & <strong>Inline</strong> styling.
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            color: 'var(--sage-700)',
            fontWeight: 600,
          }}
        >
          {isOpen ? 'Hide Breakdown' : 'View Code Breakdown'}
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isOpen && (
        <div className="container" style={{ paddingTop: '12px', paddingBottom: '8px' }}>
          <div className="grid-3" style={{ gap: '16px' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontWeight: 700, color: 'var(--sage-800)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="#2e7d32" /> 1. External CSS
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Dedicated <code>.css</code> stylesheets (<code>global.css</code>, <code>Navbar.css</code>, <code>BreathingExercise.css</code>, etc.) with custom CSS properties & responsive flexbox/grid.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontWeight: 700, color: 'var(--sage-800)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="#2e7d32" /> 2. Internal CSS
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Embedded <code>&lt;style&gt;</code> blocks inside React components (e.g. dynamic breathing keyframe animations in <code>BreathingExercise.tsx</code> & theme variables).
              </p>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontWeight: 700, color: 'var(--sage-800)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="#2e7d32" /> 3. Inline Styling
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Dynamic <code>style=&#123;&#123; ... &#125;&#125;</code> attributes for real-time timer arcs, breathing bubble scaling, password strength fill, and role badge pigments.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
