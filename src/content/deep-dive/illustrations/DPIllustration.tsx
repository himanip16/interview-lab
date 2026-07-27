// src/content/deep-dive/illustrations/DPIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function DPIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Solve each subproblem once, then reuse its answer
      </Label>

      <Box
        x={84}
        y={10}
        width={44}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="f(5)"
      />

      <Arrow x1={96} y1={30} x2={74} y2={48} head />
      <Arrow x1={116} y1={30} x2={138} y2={48} head />

      <Box
        x={52}
        y={48}
        width={44}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="f(4)"
      />

      <Box
        x={128}
        y={48}
        width={44}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="f(3)"
      />

      <Arrow x1={74} y1={68} x2={106} y2={88} head />
      <Arrow x1={150} y1={68} x2={114} y2={88} head />

      <Box
        x={92}
        y={88}
        width={44}
        height={20}
        fill="violet"
        stroke="violet"
        title="f(2)"
        subtitle="cached"
      />
    </IllustrationCanvas>
  );
}