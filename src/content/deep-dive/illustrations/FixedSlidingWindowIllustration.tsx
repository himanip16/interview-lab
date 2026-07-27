// src/content/deep-dive/illustrations/FixedSlidingWindowIllustration.tsx

import {
  IllustrationCanvas,
  Box,
  Arrow,
} from "@/shared/diagram/primitives";

export function FixedSlidingWindowIllustration() {
  const size = 18;
  const gap = 6;
  const startX = 22;
  const y = 42;

  return (
    <IllustrationCanvas viewBox="0 0 220 100">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Box
          key={i}
          x={startX + i * (size + gap)}
          y={y}
          width={size}
          height={size}
          fill={i >= 2 && i <= 4 ? "mint" : "soft"}
          stroke={i >= 2 && i <= 4 ? "mintDeep" : "border"}
        />
      ))}

      <Arrow
        x1={84}
        y1={74}
        x2={136}
        y2={74}
        color="coral"
        head
      />
    </IllustrationCanvas>
  );
}