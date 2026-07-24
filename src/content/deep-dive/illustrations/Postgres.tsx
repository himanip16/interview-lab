// src/content/deep-dive/illustrations/Postgres.tsx

export function PostgresIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* root page */}
      <circle
        cx="28"
        cy="12"
        r="4"
        fill="#15161C"
      />

      {/* internal pages */}
      <circle
        cx="16"
        cy="26"
        r="3.5"
        fill="#00A87E"
      />
      <circle
        cx="40"
        cy="26"
        r="3.5"
        fill="#00A87E"
      />

      {/* leaf pages */}
      <circle
        cx="10"
        cy="42"
        r="3"
        fill="#00D9A3"
      />
      <circle
        cx="22"
        cy="42"
        r="3"
        fill="#00D9A3"
      />
      <circle
        cx="34"
        cy="42"
        r="3"
        fill="#00D9A3"
      />
      <circle
        cx="46"
        cy="42"
        r="3"
        fill="#00D9A3"
      />

      {/* B-Tree edges */}
      <path
        d="M28 16L16 22M28 16L40 22M16 29L10 39M16 29L22 39M40 29L34 39M40 29L46 39"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".35"
      />

      {/* highlighted lookup */}
      <circle
        cx="34"
        cy="42"
        r="5"
        fill="#FF5A3C"
        opacity=".18"
      />
      <circle
        cx="34"
        cy="42"
        r="2"
        fill="#FF5A3C"
      />
    </svg>
  );
}