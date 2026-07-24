// src/shared/illustrations/Cassandra.tsx

import { IllustrationCanvas, Node, Arrow, RingPath, ringPositions } from '@/shared/diagram/primitives';

export function CassandraIllustration() {
  const center = { cx: 110, cy: 110 };
  const ringR = 80;
  const nodeFills = ['mint', 'mintDeep', 'ink', 'mintDeep', 'mint', 'ink'] as const;
  const positions = ringPositions(center.cx, center.cy, ringR, 6);

  return (
    <IllustrationCanvas viewBox="0 0 220 220">
      <RingPath cx={center.cx} cy={center.cy} r={88} dashed opacity={0.25} />

      {positions.map((p, i) => (
        <Arrow
          key={`perimeter-${i}`}
          x1={p.x}
          y1={p.y}
          x2={positions[(i + 1) % positions.length].x}
          y2={positions[(i + 1) % positions.length].y}
          color="ink"
          opacity={0.3}
        />
      ))}

      {positions.map((p, i) => (
        <Arrow
          key={`spoke-${i}`}
          x1={center.cx}
          y1={center.cy}
          x2={p.x}
          y2={p.y}
          color="coral"
          opacity={0.35}
        />
      ))}

      {positions.map((p, i) => (
        <Node key={`node-${i}`} cx={p.x} cy={p.y} r={11} fill={nodeFills[i]} />
      ))}

      <Node cx={center.cx} cy={center.cy} r={16} fill="coral" />
    </IllustrationCanvas>
  );
}