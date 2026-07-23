// src/features/learning/components/diagrams/Redis.tsx

export function RedisDiagram() {
  return (
    <svg viewBox="0 0 220 220" fill="none">
      {/* Central cache with satellite key-value stores */}
      <circle cx="110" cy="110" r="20" fill="#FF5A3C" />
      {/* 5 surrounding stores */}
      {[0, 72, 144, 216, 288].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 110 + 70 * Math.cos(rad);
        const y = 110 + 70 * Math.sin(rad);
        return (
          <g key={angle}>
            <circle cx={x} cy={y} r="12" fill="#00D9A3" />
            <line x1="110" y1="110" x2={x} y2={y} stroke="#15161C" strokeWidth="1.5" opacity="0.3" />
          </g>
        );
      })}
    </svg>
  );
}