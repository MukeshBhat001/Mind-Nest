/**
 * Medical & University Academic Disclaimer Banner
 * Mind Nest - University Web Applications Assignment
 * Demonstrates: Inline styles and component layout
 */
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const MedicalDisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--sand-100)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: compact ? '10px 16px' : '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        margin: compact ? '12px 0' : '20px 0',
      }}
    >
      <AlertCircle
        size={20}
        style={{ color: 'var(--sage-700)', flexShrink: 0, marginTop: '2px' }}
      />
      <div style={{ fontSize: compact ? '0.82rem' : '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--sage-900)' }}>Educational Disclaimer: </strong>
        Mind Nest is an academic web application prototype developed for a university Web Applications course.
        Content and self-assessment tools are intended solely for educational reflection and relaxation training,
        not as clinical diagnostic advice or therapeutic substitutes. Always consult certified medical practitioners for health concerns.
      </div>
    </div>
  );
};
