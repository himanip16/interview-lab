// src/features/learning/components/whiteboard/DiagramNode.tsx

import { DiagramNode as NodeType } from "@/features/whiteboard/types/whiteboard";

const CATEGORY_COLORS: Record<string, string> = {
  entry: "var(--category-practice)",
  logic: "var(--category-concept)",
  storage: "var(--category-learn-deep)",
  queue: "var(--category-live)",
  network: "var(--category-neutral)",
};

export const DiagramNode = ({
  node,
  isSelected,
  onClick,
  x,
  y,
  width,
  height,
}: {
  node: NodeType;
  isSelected: boolean;
  onClick: () => void;
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  const color = CATEGORY_COLORS[node.category] ?? "var(--category-neutral)";
  const left = x - width / 2;
  const top = y - height / 2;
  const clipId = `clip-${node.id}`;

  return (
    <g
      transform={`translate(${left}, ${top})`}
      onClick={onClick}
      role="button"
      aria-label={`Inspect ${node.title}`}
      aria-pressed={isSelected}
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <clipPath id={clipId}>
        <rect width={width} height={height} rx={12} />
      </clipPath>

      <rect
        width={width}
        height={height}
        rx={12}
        fill={color}
        stroke={color}
        opacity={isSelected ? 1 : 0.9}
      />

      <g clipPath={`url(#${clipId})`}>
        <text
          x={12}
          y={22}
          fontSize="12"
          fontWeight="700"
          fill="white"
        >
          {node.title}
        </text>
        <text
          x={12}
          y={height - 12}
          fontSize="9"
          fontWeight="700"
          fill="white"
          opacity="0.7"
          style={{ textTransform: "uppercase" }}
        >
          {node.category}
        </text>
      </g>

      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={16}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.2"
          strokeWidth="4"
        />
      )}
    </g>
  );
};