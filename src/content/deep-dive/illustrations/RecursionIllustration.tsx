// src/content/deep-dive/illustrations/RecursionIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function RecursionIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Each call solves a smaller problem, then returns upward
      </Label>

      <Box
        x={16}
        y={18}
        width={44}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="f(4)"
      />

      <Arrow x1={38} y1={38} x2={38} y2={48} head />

      <Box
        x={44}
        y={48}
        width={44}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="f(3)"
      />

      <Arrow x1={66} y1={68} x2={66} y2={78} head />

      <Box
        x={72}
        y={78}
        width={44}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="f(2)"
      />

      <Arrow x1={94} y1={98} x2={94} y2={108} head />

      <Box
        x={100}
        y={100}
        width={52}
        height={18}
        fill="amber"
        stroke="amber"
        title="Base case"
      />

      <Arrow
        x1={152}
        y1={104}
        x2={198}
        y2={42}
        dashed
        head
        label="return"
      />
    </IllustrationCanvas>
  );
}