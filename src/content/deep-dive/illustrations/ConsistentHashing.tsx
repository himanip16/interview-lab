// src/content/deep-dive/illustrations/ConsistentHashing.tsx

export function ConsistentHashingIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* hash ring */}
      <circle
        cx="28"
        cy="28"
        r="20"
        stroke="#15161C"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity=".22"
      />

      {/* servers on the ring */}
      <circle cx="28" cy="8" r="3.5" fill="#00D9A3" />
      <circle cx="45" cy="20" r="3.5" fill="#FF5A3C" />
      <circle cx="39" cy="43" r="3.5" fill="#00A87E" />
      <circle cx="17" cy="45" r="3.5" fill="#6A5AE0" />
      <circle cx="10" cy="18" r="3.5" fill="#00A87E" />

      {/* request */}
      <circle cx="23" cy="15" r="2.5" fill="#15161C" />

      {/* request routing */}
      <path
        d="M23 15 Q30 13 38 19"
        stroke="#15161C"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity=".35"
      />

      {/* clockwise ownership */}
      <path
        d="M41 23
           A16 16 0 0 1 35 39"
        stroke="#FF5A3C"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* arrow head */}
      <path
        d="M34 37 L35 40 L38 38"
        stroke="#FF5A3C"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* key */}
      <circle cx="28" cy="28" r="2.8" fill="#15161C" opacity=".18" />
    </svg>
  );
}