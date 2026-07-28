// src/content/deep-dive/illustrations/OwnershipArrowIllustration.tsx

export function OwnershipArrowIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ownership arrow */}
      <path
        d="M12 44 L28 28 L44 12"
        stroke="#00D9A3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* arrow head */}
      <path
        d="M40 16 L44 12 L40 8"
        stroke="#00D9A3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* start point */}
      <circle cx="12" cy="44" r="3" fill="#FF5A3C" />
      
      {/* end point */}
      <circle cx="44" cy="12" r="3" fill="#6A5AE0" />
      
      {/* midpoint */}
      <circle cx="28" cy="28" r="2" fill="#15161C" opacity=".3" />
    </svg>
  );
}
