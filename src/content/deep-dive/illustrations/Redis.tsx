// src/content/deep-dive/illustrations/Redis.tsx

export function RedisIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* in-memory cache */}
      <rect
        x="12"
        y="14"
        width="32"
        height="28"
        rx="4"
        fill="#F6F6F4"
        stroke="#15161C"
        strokeWidth="1.5"
      />

      {/* memory rows */}
      <line
        x1="18"
        y1="20"
        x2="38"
        y2="20"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />
      <line
        x1="18"
        y1="28"
        x2="38"
        y2="28"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />
      <line
        x1="18"
        y1="36"
        x2="38"
        y2="36"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />

      {/* hot key */}
      <circle cx="28" cy="28" r="5" fill="#FF5A3C" />
      <circle cx="28" cy="28" r="2" fill="#15161C" />

      {/* fast access */}
      <path
        d="M6 28H12"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M44 28H50"
        stroke="#00A87E"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* speed lines */}
      <path
        d="M4 22H10M4 34H10"
        stroke="#00D9A3"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".6"
      />
    </svg>
  );
}