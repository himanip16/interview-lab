// src/content/deep-dive/illustrations/TopologicalSortIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Node,
  Arrow,
} from "../../../shared/diagram/primitives";

export function TopologicalSortIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        A node can appear only after all of its prerequisites
      </Label>

      <Node cx={24} cy={60} label="A" fill="mintDeep" />

      <Node cx={78} cy={32} label="B" />
      <Node cx={78} cy={88} label="C" />

      <Node cx={136} cy={60} label="D" />

      <Node cx={194} cy={60} label="E" fill="violet" />

      <Arrow x1={30} y1={56} x2={72} y2={36} head />
      <Arrow x1={30} y1={64} x2={72} y2={84} head />

      <Arrow x1={84} y1={36} x2={130} y2={56} head />
      <Arrow x1={84} y1={84} x2={130} y2={64} head />

      <Arrow x1={142} y1={60} x2={188} y2={60} head />

      <Label x={58} y={108} size={6}>
        One valid order: A → B → C → D → E
      </Label>
    </IllustrationCanvas>
  );
}