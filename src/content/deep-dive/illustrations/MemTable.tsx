// src/shared/illustrations/Memtable.tsx

import { IllustrationCanvas, Box, Arrow, Label } from '@/shared/diagram/primitives';

export function MemtableIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* in-memory table */}
      <rect
        x="10"
        y="10"
        width="36"
        height="36"
        rx="4"
        fill="#F6F6F4"
        stroke="#15161C"
        strokeWidth="1.5"
      />

      {/* rows */}
      <line
        x1="10"
        y1="20"
        x2="46"
        y2="20"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".2"
      />
      <line
        x1="10"
        y1="30"
        x2="46"
        y2="30"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".2"
      />
      <line
        x1="10"
        y1="40"
        x2="46"
        y2="40"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".2"
      />

      {/* key/value separator */}
      <line
        x1="24"
        y1="10"
        x2="24"
        y2="46"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".2"
      />

      {/* recent writes */}
      <circle cx="18" cy="15" r="2.5" fill="#00D9A3" />
      <circle cx="18" cy="25" r="2.5" fill="#00D9A3" />
      <circle cx="18" cy="35" r="2.5" fill="#00D9A3" />

      {/* flush direction */}
      <path
        d="M46 28H52"
        stroke="#FF5A3C"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M49 25L52 28L49 31"
        stroke="#FF5A3C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}