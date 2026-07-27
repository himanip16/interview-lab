// src/content/deep-dive/illustrations/AVLTreeIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Node,
  Arrow,
} from "../../../shared/diagram/primitives";

export function AVLTreeIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 110">
      <Label x={8} y={14}>
        Rebalance after insertion using a tree rotation
      </Label>

      {/* Before */}

      <Node cx={44} cy={28} label="30" />
      <Node cx={30} cy={54} label="20" />
      <Node cx={16} cy={80} fill="coral" label="10" />

      <Arrow x1={41} y1={33} x2={33} y2={49} />
      <Arrow x1={27} y1={59} x2={19} y2={75} />

      <Label x={20} y={100} size={6}>
        Unbalanced
      </Label>

      {/* Rotation */}

      <Arrow
        x1={82}
        y1={54}
        x2={132}
        y2={54}
        head
        label="rotate"
      />

      {/* After */}

      <Node cx={176} cy={28} label="20" fill="mintDeep" />
      <Node cx={156} cy={54} label="10" />
      <Node cx={196} cy={54} label="30" />

      <Arrow x1={172} y1={33} x2={160} y2={49} />
      <Arrow x1={180} y1={33} x2={192} y2={49} />

      <Label x={158} y={100} size={6}>
        Balanced
      </Label>
    </IllustrationCanvas>
  );
}