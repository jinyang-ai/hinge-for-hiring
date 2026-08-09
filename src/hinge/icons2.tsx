// ============================================================
// Tal Reel 2 — inline SVG icons. currentColor / stroke so the CSS
// tokens drive them. 24×24 nominal unless noted.
// ============================================================
import React from "react";

// Verified seal (filled badge + check) — sits after the name, ~15px.
export const Verified: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 1.6l2.7 2 3.3-.3 1 3.2 2.7 2-1.3 3 1.3 3-2.7 2-1 3.2-3.3-.3-2.7 2-2.7-2-3.3.3-1-3.2-2.7-2 1.3-3-1.3-3 2.7-2 1-3.2 3.3.3z"
      fill="currentColor"
    />
    <path d="M8.4 12.2l2.4 2.4 4.8-4.9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Location pin — thin outline, ~12px.
export const Pin: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 21.5c4.2-4.3 6.3-7.7 6.3-10.4A6.3 6.3 0 0012 5a6.3 6.3 0 00-6.3 6.1c0 2.7 2.1 6.1 6.3 10.4z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10.9" r="2.3" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

// Super Chat — a star inside a rounded square.
export const SuperChat: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 7.4l1.35 2.86 3.05.4-2.25 2.13.58 3.06L12 14.9l-2.73 1.06.58-3.06-2.25-2.13 3.05-.4z"
      fill="currentColor"
    />
  </svg>
);

// Start DM — speech bubble.
export const DM: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7A2.5 2.5 0 0117.5 16H9l-4 3.4V16H6.5A2.5 2.5 0 014 13.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

// ✕ reject.
export const Cross: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// waving hand — small emoji used in the "Hiring" row.
export const Wave: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }} aria-hidden>
    👋
  </span>
);
