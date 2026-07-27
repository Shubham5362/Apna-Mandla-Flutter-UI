import React from 'react';

export const AshokChakra = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="48" fill="none" stroke="#000080" strokeWidth="2" />
    <circle cx="50" cy="50" r="8" fill="none" stroke="#000080" strokeWidth="2" />
    {[...Array(24)].map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
        y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
        stroke="#000080"
        strokeWidth="1.5"
      />
    ))}
    {[...Array(24)].map((_, i) => (
      <circle
        key={`dot-${i}`}
        cx={50 + 44 * Math.cos((i * 15 + 7.5) * Math.PI / 180)}
        cy={50 + 44 * Math.sin((i * 15 + 7.5) * Math.PI / 180)}
        r="1"
        fill="#000080"
      />
    ))}
  </svg>
);
