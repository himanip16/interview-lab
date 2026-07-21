import { PositionedEdge } from "../../types/whiteboard";

interface DiagramEdgesProps {
  edges: PositionedEdge[];
}

export const DiagramEdges = ({ edges }: DiagramEdgesProps) => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {edges.map((edge, i) => (
        <line
          key={`${edge.fromId}-${edge.toId}-${i}`}
          x1={`${edge.start.x}%`}
          y1={`${edge.start.y}%`}
          x2={`${edge.end.x}%`}
          y2={`${edge.end.y}%`}
          stroke="rgba(21,22,28,0.16)"
          strokeWidth="2"
          strokeDasharray="5 6"
          className="animate-flow"
        />
      ))}
    </svg>
  );
};