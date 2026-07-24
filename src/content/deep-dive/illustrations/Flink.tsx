// src/shared/illustrations/Flink.tsx

import { IllustrationCanvas, Box, Node, Arrow, Label } from '@/shared/diagram/primitives';

export function FlinkIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* input stream */}
      <circle cx="8" cy="28" r="3" fill="#00D9A3" />
      <path
        d="M11 28H18"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* processing engine */}
      <rect
        x="18"
        y="14"
        width="20"
        height="28"
        rx="4"
        fill="#F6F6F4"
        stroke="#15161C"
        strokeWidth="1.5"
      />

      {/* operators */}
      <circle cx="28" cy="20" r="2.5" fill="#FF5A3C" />
      <circle cx="28" cy="28" r="2.5" fill="#E8940A" />
      <circle cx="28" cy="36" r="2.5" fill="#6A5AE0" />

      <line
        x1="28"
        y1="22.5"
        x2="28"
        y2="33.5"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".3"
      />

      {/* output stream */}
      <path
        d="M38 28H45"
        stroke="#00A87E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="48" cy="28" r="3" fill="#00A87E" />

      {/* continuous flow */}
      <path
        d="M8 18C18 10 38 10 48 18"
        stroke="#15161C"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity=".2"
      />
      <path
        d="M8 38C18 46 38 46 48 38"
        stroke="#15161C"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity=".2"
      />
    </svg>
  );
}