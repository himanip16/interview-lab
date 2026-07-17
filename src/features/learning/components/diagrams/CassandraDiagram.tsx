// src/features/learning/components/diagrams/CassandraDiagram.tsx
export function CassandraDiagram() {
  return (
    <svg viewBox="0 0 220 220" fill="none" className="w-full h-auto">
      {/* Ring topology */}
      <circle
        cx="110"
        cy="110"
        r="88"
        stroke="#15161C"
        strokeWidth="2"
        strokeDasharray="4 7"
        opacity="0.25"
      />

      {/* 6 ring nodes */}
      <circle cx="110" cy="30" r="11" fill="#00D9A3" />
      <circle cx="182" cy="70" r="11" fill="#00A87E" />
      <circle cx="182" cy="150" r="11" fill="#15161C" />
      <circle cx="110" cy="190" r="11" fill="#00A87E" />
      <circle cx="38" cy="150" r="11" fill="#00D9A3" />
      <circle cx="38" cy="70" r="11" fill="#15161C" />

      {/* Center coordinator node */}
      <circle cx="110" cy="110" r="16" fill="#FF5A3C" />

      {/* Ring connections */}
      <path
        d="M110 30L182 70M182 70L182 150M182 150L110 190M110 190L38 150M38 150L38 70M38 70L110 30"
        stroke="#15161C"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Center connections */}
      <path
        d="M110 110L110 30M110 110L182 70M110 110L182 150M110 110L110 190M110 110L38 150M110 110L38 70"
        stroke="#FF5A3C"
        strokeWidth="1.5"
        opacity="0.35"
      />
    </svg>
  );
}

// ---

// src/features/learning/components/diagrams/RedisDiagram.tsx
export function RedisDiagram() {
  const positions = [
    { angle: 0, x: 110, y: 30 },
    { angle: 72, x: 182, y: 70 },
    { angle: 144, x: 182, y: 150 },
    { angle: 216, x: 38, y: 150 },
    { angle: 288, x: 38, y: 70 },
  ];

  return (
    <svg viewBox="0 0 220 220" fill="none" className="w-full h-auto">
      {/* Central cache node */}
      <circle cx="110" cy="110" r="20" fill="#FF5A3C" />
      <text
        x="110"
        y="115"
        textAnchor="middle"
        fontSize="10"
        fill="white"
        fontWeight="600"
      >
        Cache
      </text>

      {/* 5 surrounding key-value stores */}
      {positions.map((pos, i) => (
        <g key={i}>
          {/* Connection line */}
          <line
            x1="110"
            y1="110"
            x2={pos.x}
            y2={pos.y}
            stroke="#15161C"
            strokeWidth="1.5"
            opacity="0.3"
          />
          {/* Node */}
          <circle cx={pos.x} cy={pos.y} r="12" fill="#00D9A3" />
          <text
            x={pos.x}
            y={pos.y + 4}
            textAnchor="middle"
            fontSize="8"
            fill="#15161C"
            fontWeight="600"
          >
            {i + 1}
          </text>
        </g>
      ))}

      {/* Ring around center */}
      <circle cx="110" cy="110" r="88" stroke="#15161C" strokeWidth="2" strokeDasharray="4 7" opacity="0.15" />
    </svg>
  );
}

// ---

// src/features/learning/components/diagrams/KafkaDiagram.tsx
export function KafkaDiagram() {
  return (
    <svg viewBox="0 0 220 220" fill="none" className="w-full h-auto">
      {/* 3 Topics as vertical columns */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {/* Topic container */}
          <rect
            x={50 + i * 55}
            y="35"
            width="45"
            height="150"
            fill="none"
            stroke="#15161C"
            strokeWidth="2"
            rx="4"
            opacity="0.3"
          />

          {/* Topic label */}
          <text
            x={72.5 + i * 55}
            y="25"
            textAnchor="middle"
            fontSize="11"
            fill="#15161C"
            fontWeight="600"
          >
            Topic {i + 1}
          </text>

          {/* 3 Partitions per topic */}
          {[0, 1, 2].map((j) => (
            <g key={j}>
              {/* Partition container */}
              <rect
                x={55 + i * 55}
                y={50 + j * 45}
                width="35"
                height="35"
                fill="none"
                stroke="#15161C"
                strokeWidth="1"
                opacity="0.2"
              />

              {/* Leader or replica indicator */}
              <circle
                cx={72.5 + i * 55}
                cy={67.5 + j * 45}
                r="8"
                fill={j === 0 ? "#FF5A3C" : "#00D9A3"}
              />

              {/* Replica count */}
              {j > 0 && (
                <text
                  x={72.5 + i * 55}
                  y={71 + j * 45}
                  textAnchor="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="600"
                >
                  R
                </text>
              )}
              {j === 0 && (
                <text
                  x={72.5 + i * 55}
                  y={71 + j * 45}
                  textAnchor="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="600"
                >
                  L
                </text>
              )}
            </g>
          ))}
        </g>
      ))}

      {/* Legend */}
      <text x="55" y="210" fontSize="10" fill="#15161C" opacity="0.6">
        L = Leader, R = Replica
      </text>
    </svg>
  );
}