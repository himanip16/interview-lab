// src/content/deep-dive/illustrations/SegmentTree.tsx

export function SegmentTreeIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* root range */}
      <circle cx="28" cy="10" r="4" fill="#15161C" />

      {/* internal range nodes */}
      <circle cx="18" cy="24" r="3.5" fill="#2563EB" />
      <circle cx="38" cy="24" r="3.5" fill="#2563EB" />

      {/* leaf nodes */}
      <circle cx="10" cy="40" r="3" fill="#60A5FA" />
      <circle cx="18" cy="40" r="3" fill="#60A5FA" />
      <circle cx="38" cy="40" r="3" fill="#60A5FA" />
      <circle cx="46" cy="40" r="3" fill="#60A5FA" />

      {/* tree edges */}
      <path
        d="
          M28 14L18 20
          M28 14L38 20
          M18 27L10 37
          M18 27L18 37
          M38 27L38 37
          M38 27L46 37
        "
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".35"
      />

      {/* highlighted query range */}
      <circle
        cx="38"
        cy="40"
        r="5"
        fill="#FF5A3C"
        opacity=".18"
      />
      <circle
        cx="38"
        cy="40"
        r="2"
        fill="#FF5A3C"
      />

      {/* small range brackets */}
      <path
        d="M34 47H42"
        stroke="#FF5A3C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}