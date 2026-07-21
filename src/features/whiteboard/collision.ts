import { PositionedNode } from "@/features/whiteboard/types/whiteboard";


function overlaps(
  a: PositionedNode,
  b: PositionedNode
) {

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}


export function validateCollisions(
  nodes: PositionedNode[]
) {

  for(let i = 0; i < nodes.length; i++) {

    for(let j=i+1; j<nodes.length; j++) {

      if(overlaps(nodes[i], nodes[j])) {

        throw new Error(
          `Nodes overlap: ${nodes[i].id} and ${nodes[j].id}`
        );
      }
    }
  }
}