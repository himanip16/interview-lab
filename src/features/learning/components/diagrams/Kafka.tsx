// src/features/learning/components/diagrams/Kafka.tsx

export function KafkaDiagram() {
  return (
    <svg viewBox="0 0 220 220" fill="none">
      {/* Topic as a column, partitions as rows */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={60 + i * 50}
            y="40"
            width="40"
            height="140"
            fill="none"
            stroke="#15161C"
            strokeWidth="2"
          />
          {[0, 1, 2].map((j) => (
            <circle
              key={j}
              cx={80 + i * 50}
              cy={70 + j * 45}
              r="6"
              fill={j === 0 ? "#FF5A3C" : "#00D9A3"}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}