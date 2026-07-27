// src/content/deep-dive/illustrations/TwoPointers.tsx

export function TwoPointersIllustration() {
  return (
    <svg className="mark" viewBox="0 0 220 220" fill="none">
      {/* array */}
      <rect
        x="40"
        y="96"
        width="140"
        height="28"
        rx="6"
        fill="#F6F6F4"
        stroke="#15161C"
        strokeWidth="2"
      />

      {/* array divisions */}
      <path
        d="M60 96V124M80 96V124M100 96V124M120 96V124M140 96V124M160 96V124"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".18"
      />

      {/* left pointer */}
      <circle cx="60" cy="48" r="11" fill="#00D9A3" />
      <path
        d="M60 60V88"
        stroke="#00D9A3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* right pointer */}
      <circle cx="160" cy="172" r="11" fill="#00A87E" />
      <path
        d="M160 160V132"
        stroke="#00A87E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* movement */}
      <path
        d="M72 48H102"
        stroke="#00D9A3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M148 172H118"
        stroke="#00A87E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* convergence */}
      <circle
        cx="110"
        cy="110"
        r="18"
        fill="#FF5A3C"
        opacity=".18"
      />
      <circle
        cx="110"
        cy="110"
        r="7"
        fill="#FF5A3C"
      />

      {/* guide lines */}
      <path
        d="M60 88L110 110M160 132L110 110"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".3"
      />
    </svg>
  );
}