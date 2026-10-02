import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

export const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const WordCountIndicator = ({ text, min = 20, max = 40 }) => {
  const count = countWords(text);
  const isValid = count >= min && count <= max;
  const isTooShort = count < min;
  const isTooLong = count > max;

  let statusClass = 'valid';
  let message = `Optimal Length: ${count} words`;
  let Icon = CheckCircle;
  let color = '#00f59b';

  if (count === 0) {
    statusClass = 'warning';
    message = `Required: ${min} - ${max} words`;
    Icon = AlertTriangle;
    color = '#ffb703';
  } else if (isTooShort) {
    statusClass = 'warning';
    message = `Add ${min - count} more words (${count}/${min}-${max})`;
    Icon = AlertTriangle;
    color = '#ffb703';
  } else if (isTooLong) {
    statusClass = 'invalid';
    message = `Exceeds by ${count - max} words (${count}/${max})`;
    Icon = AlertCircle;
    color = '#ff0055';
  }

  // Progress percentage (capped at 100%)
  const percentage = Math.min(100, Math.round((count / max) * 100));

  return (
    <div
      style={{
        marginTop: '10px',
        padding: '10px 14px',
        background: 'rgba(5, 8, 16, 0.7)',
        borderRadius: 'var(--radius-xs)',
        border: `1px solid ${color}35`,
        boxShadow: `0 0 14px ${color}15`,
      }}
    >
      <div className={`word-counter ${statusClass}`} style={{ fontWeight: 700, fontSize: '0.84rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color }}>
          <Icon size={15} />
          {message}
        </span>
        <span
          className="font-mono"
          style={{
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '4px',
            background: `${color}25`,
            border: `1px solid ${color}45`,
            fontSize: '0.78rem',
          }}
        >
          {count} / {max} words
        </span>
      </div>
      {/* Visual glowing progress track */}
      <div
        style={{
          width: '100%',
          height: '5px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          marginTop: '8px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: isValid
              ? 'linear-gradient(90deg, #00f59b, #38bdf8)'
              : isTooLong
              ? 'linear-gradient(90deg, #f59e0b, #ff0055)'
              : count > 0
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
              : '#64748b',
            boxShadow: `0 0 10px ${color}`,
            transition: 'width 0.25s ease, background-color 0.25s ease',
          }}
        />
      </div>
    </div>
  );
};

export default WordCountIndicator;

