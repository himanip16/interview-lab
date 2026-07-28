// src/content/deep-dive/illustrations/SortingOrderIllustration.tsx

export function SortingOrderIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ascending bars */}
      <rect x="10" y="36" width="8" height="12" rx="1" fill="#FF5A3C" opacity=".6" />
      <rect x="22" y="28" width="8" height="20" rx="1" fill="#FF5A3C" opacity=".7" />
      <rect x="34" y="20" width="8" height="28" rx="1" fill="#FF5A3C" opacity=".85" />
      <rect x="46" y="12" width="8" height="36" rx="1" fill="#FF5A3C" />
      
      {/* arrow pointing up */}
      <path
        d="M28 8 L28 4"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 7 L28 4 L31 7"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* baseline */}
      <line x1="8" y1="48" x2="48" y2="48" stroke="#15161C" strokeWidth="1" opacity=".2" />
    </svg>
  );
}
