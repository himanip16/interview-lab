// src/shared/illustrations/Acid.tsx

import { IllustrationCanvas, Box, Node, Arrow, Label } from '@/shared/diagram/primitives';


export function AcidIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* transaction boundary */}
      <rect
        x="10"
        y="10"
        width="36"
        height="36"
        rx="6"
        stroke="#15161C"
        strokeWidth="1.5"
        fill="#F6F6F4"
      />

      {/* operations inside one transaction */}
      <circle cx="18" cy="18" r="3.5" fill="#00D9A3" />
      <circle cx="38" cy="18" r="3.5" fill="#00A87E" />
      <circle cx="18" cy="38" r="3.5" fill="#6A5AE0" />
      <circle cx="38" cy="38" r="3.5" fill="#FF5A3C" />

      {/* connected as one atomic unit */}
      <path
        d="M18 18H38M18 18V38M38 18V38M18 38H38"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".35"
      />

      {/* commit in the center */}
      <circle cx="28" cy="28" r="6" fill="#FF5A3C" />
      <path
        d="M25.5 28L27.5 30L31 26"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* links to commit */}
      <path
        d="M18 18L28 28M38 18L28 28M18 38L28 28M38 38L28 28"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".2"
      />
    </svg>
  );
}