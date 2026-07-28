// src/content/deep-dive/illustrations/SpiralWalkIllustration.tsx

export function SpiralWalkIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* grid background */}
      <rect x="8" y="8" width="40" height="40" rx="2" stroke="#15161C" strokeWidth="1" opacity=".15" />
      
      {/* spiral path */}
      <path
        d="M12 12 L44 12 L44 44 L16 44 L16 20 L36 20 L36 36 L20 36 L20 24 L32 24 L32 32 L24 32"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* current position dot */}
      <circle cx="24" cy="32" r="3" fill="#FF5A3C" />
      
      {/* direction arrow */}
      <path
        d="M24 28 L24 25 L21 28"
        stroke="#FF5A3C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
