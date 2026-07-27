// src/content/deep-dive/illustrations/UnionFindIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Node,
  Arrow,
} from "../../../shared/diagram/primitives";

export function UnionFindIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Union merges components while Find identifies their representative
      </Label>

      {/* Component A */}
      <Node cx={30} cy={42} label="A" />
      <Node cx={60} cy={42} label="B" />
      <Arrow x1={36} y1={42} x2={54} y2={42} />

      {/* Component B */}
      <Node cx={30} cy={82} label="C" />
      <Node cx={60} cy={82} label="D" />
      <Arrow x1={36} y1={82} x2={54} y2={82} />

      {/* Union */}
      <Arrow
        x1={82}
        y1={62}
        x2={132}
        y2={62}
        head
        label="union"
      />

      {/* Merged component */}
      <Node cx={156} cy={62} label="A" fill="mintDeep" />
      <Node cx={184} cy={38} label="B" />
      <Node cx={184} cy={62} label="C" />
      <Node cx={184} cy={86} label="D" />

      <Arrow x1={160} y1={60} x2={178} y2={40} />
      <Arrow x1={162} y1={62} x2={178} y2={62} />
      <Arrow x1={160} y1={64} x2={178} y2={84} />
    </IllustrationCanvas>
  );
}