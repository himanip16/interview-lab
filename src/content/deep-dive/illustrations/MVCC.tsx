// src/shared/illustrations/MVCC.tsx

import { IllustrationCanvas, Box, Node, Arrow, Label } from '@/shared/diagram/primitives';

export function MVCCIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* database row */}
      <rect
        x="14"
        y="10"
        width="28"
        height="36"
        rx="4"
        fill="#F6F6F4"
        stroke="#15161C"
        strokeWidth="1.5"
      />

      {/* row versions */}
      <rect
        x="18"
        y="16"
        width="20"
        height="5"
        rx="2"
        fill="#00D9A3"
      />
      <rect
        x="18"
        y="25"
        width="20"
        height="5"
        rx="2"
        fill="#E8940A"
        opacity=".8"
      />
      <rect
        x="18"
        y="34"
        width="20"
        height="5"
        rx="2"
        fill="#6A5AE0"
        opacity=".7"
      />

      {/* timeline */}
      <path
        d="M10 46H46"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />

      {/* version pointer */}
      <circle
        cx="28"
        cy="46"
        r="2.5"
        fill="#FF5A3C"
      />
    </svg>
  );
}