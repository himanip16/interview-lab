// src/content/deep-dive/illustrations/Spark.tsx

export function SparkIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* input data */}
      <circle cx="8" cy="18" r="3" fill="#00D9A3" />
      <circle cx="8" cy="28" r="3" fill="#00D9A3" />
      <circle cx="8" cy="38" r="3" fill="#00D9A3" />

      {/* flow into engine */}
      <path
        d="M11 18H18M11 28H18M11 38H18"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* compute engine */}
      <rect
        x="18"
        y="12"
        width="20"
        height="32"
        rx="4"
        fill="#F6F6F4"
        stroke="#15161C"
        strokeWidth="1.5"
      />

      {/* distributed tasks */}
      <rect x="22" y="17" width="12" height="4" rx="2" fill="#FF5A3C" />
      <rect x="22" y="26" width="12" height="4" rx="2" fill="#E8940A" />
      <rect x="22" y="35" width="12" height="4" rx="2" fill="#6A5AE0" />

      {/* output */}
      <path
        d="M38 28H45"
        stroke="#00A87E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="48" cy="28" r="3" fill="#00A87E" />

      {/* parallel processing hint */}
      <path
        d="M18 18L22 19M18 28L22 28M18 38L22 37"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />
    </svg>
  );
}