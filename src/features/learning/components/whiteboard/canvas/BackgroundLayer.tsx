import React from "react";

interface BackgroundLayerProps {
  width: number;
  height: number;
  gridSize?: number;
}

export function BackgroundLayer({
  width,
  height,
  gridSize = 25,
}: BackgroundLayerProps) {
  const patternId = React.useId();

  return (
    <g data-canvas-background="true">
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
            stroke="rgba(21,22,28,0.04)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect
        x={-width}
        y={-height}
        width={width * 3}
        height={height * 3}
        fill={`url(#${patternId})`}
        data-canvas-background="true"
      />
    </g>
  );
}