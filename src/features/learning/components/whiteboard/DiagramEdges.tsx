import { PositionedEdge } from "@/features/whiteboard/types/whiteboard";

interface DiagramEdgesProps {
  edges: PositionedEdge[];
}

export const DiagramEdges = ({ edges }: DiagramEdgesProps) => {
  return (
    <>
      {edges.map((edge) => (
        <line
          key={edge.id}
          x1={edge.start.x}
          y1={edge.start.y}
          x2={edge.end.x}
          y2={edge.end.y}
          stroke="rgba(21,22,28,0.16)"
          strokeWidth="2"
          strokeDasharray="5 6"
          className="animate-flow"
        />
      ))}
    </>
  );
};