import { PositionedNode } from "@/features/whiteboard/types/whiteboard";

function toCorners(node: PositionedNode) {
  // node.x/y is CENTER — convert to left/right/top/bottom for AABB check.
  const halfW = node.width / 2;
  const halfH = node.height / 2;
  return {
    left: node.x - halfW,
    right: node.x + halfW,
    top: node.y - halfH,
    bottom: node.y + halfH,
  };
}

function overlaps(a: PositionedNode, b: PositionedNode) {
  const rectA = toCorners(a);
  const rectB = toCorners(b);

  return (
    rectA.left < rectB.right &&
    rectA.right > rectB.left &&
    rectA.top < rectB.bottom &&
    rectA.bottom > rectB.top
  );
}

export function validateCollisions(nodes: PositionedNode[]) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (overlaps(nodes[i], nodes[j])) {
        throw new Error(
          `Nodes overlap: ${nodes[i].id} and ${nodes[j].id}`
        );
      }
    }
  }
}