// src/features/learning/components/whiteboard/canvas/BackgroundLayer.tsx

import React from "react";

interface BackgroundLayerProps {
  width: number;
  height: number;
  gridSize?: number;
}

export function BackgroundLayer({
  width,
  height,
  gridSize = 50,
}: BackgroundLayerProps) {
  const patternId = "grid-pattern";

  return (
    <g className="background-layer">
      <defs>
        <pattern
          id={patternId}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="rgba(21, 22, 28, 0.04)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#${patternId})" />
    </g>
  );
}
