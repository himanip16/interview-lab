// src/content/deep-dive/illustrations/SSTable.tsx

export function SSTableIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* immutable file */}
      <rect
        x="12"
        y="8"
        width="32"
        height="40"
        rx="4"
        fill="#F6F6F4"
        stroke="#15161C"
        strokeWidth="1.5"
      />

      {/* sorted rows */}
      <line
        x1="18"
        y1="18"
        x2="38"
        y2="18"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".25"
      />
      <line
        x1="18"
        y1="26"
        x2="38"
        y2="26"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".25"
      />
      <line
        x1="18"
        y1="34"
        x2="38"
        y2="34"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".25"
      />
      <line
        x1="18"
        y1="42"
        x2="38"
        y2="42"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity=".25"
      />

      {/* sorted order */}
      <circle cx="18" cy="18" r="2" fill="#00D9A3" />
      <circle cx="22" cy="26" r="2" fill="#00A87E" />
      <circle cx="26" cy="34" r="2" fill="#6A5AE0" />
      <circle cx="30" cy="42" r="2" fill="#FF5A3C" />

      {/* immutable lock */}
      <rect
        x="35"
        y="11"
        width="5"
        height="5"
        rx="1"
        fill="#E8940A"
      />
    </svg>
  );
}