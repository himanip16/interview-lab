import { DiagramNode, DiagramEdge } from "../../types/whiteboard";

export const DiagramEdges = ({ nodes, edges }: { nodes: DiagramNode[], edges: DiagramEdge[] }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      {edges.map((edge, i) => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        if (!from || !to) return null;

        // Calculate line start/end as percentages based on grid
        const x1 = `${(from.gridPos.x / 12) * 100}%`;
        const y1 = `${(from.gridPos.y / 8) * 100}%`;
        const x2 = `${(to.gridPos.x / 12) * 100}%`;
        const y2 = `${(to.gridPos.y / 8) * 100}%`;

        return (
          <line
            key={`${edge.from}-${edge.to}-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(21,22,28,0.1)"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="animate-flow" // CSS defined in globals
          />
        );
      })}
    </svg>
  );
};