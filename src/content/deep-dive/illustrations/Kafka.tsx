// src/content/deep-dive/illustrations/Kafka.tsx


export function KafkaIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* broker stack */}
      <rect
        x="10"
        y="10"
        width="36"
        height="8"
        rx="2"
        fill="#E8940A"
      />
      <rect
        x="10"
        y="24"
        width="36"
        height="8"
        rx="2"
        fill="#E8940A"
        opacity=".75"
      />
      <rect
        x="10"
        y="38"
        width="36"
        height="8"
        rx="2"
        fill="#E8940A"
        opacity=".45"
      />

      {/* partitions */}
      <line
        x1="22"
        y1="10"
        x2="22"
        y2="18"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />
      <line
        x1="34"
        y1="10"
        x2="34"
        y2="18"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />

      <line
        x1="22"
        y1="24"
        x2="22"
        y2="32"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />
      <line
        x1="34"
        y1="24"
        x2="34"
        y2="32"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />

      <line
        x1="22"
        y1="38"
        x2="22"
        y2="46"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />
      <line
        x1="34"
        y1="38"
        x2="34"
        y2="46"
        stroke="#15161C"
        strokeWidth="1"
        opacity=".25"
      />

      {/* messages moving through partitions */}
      <circle cx="16" cy="14" r="2" fill="#15161C" />
      <circle cx="28" cy="28" r="2" fill="#15161C" />
      <circle cx="40" cy="42" r="2" fill="#15161C" />

      {/* flow indicator */}
      <path
        d="M16 14L28 28L40 42"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".8"
      />
    </svg>
  );
}