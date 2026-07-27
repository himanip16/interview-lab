// src/content/deep-dive/illustrations/MonotonicStackIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function MonotonicStackIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Pop until the stack becomes monotonic, then push the new element
      </Label>

      {/* Incoming value */}
      <Box
        x={12}
        y={46}
        width={34}
        height={24}
        fill="amber"
        stroke="amber"
        title="4"
      />

      <Arrow x1={46} y1={58} x2={82} y2={58} head label="push" />

      {/* Stack */}
      <Box
        x={82}
        y={78}
        width={40}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="2"
      />

      <Box
        x={82}
        y={56}
        width={40}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="3"
      />

      <Box
        x={82}
        y={34}
        width={40}
        height={20}
        fill="coral"
        stroke="coral"
        title="5"
      />

      <Arrow
        x1={126}
        y1={44}
        x2={164}
        y2={44}
        dashed
        head
        color="coral"
        label="pop"
      />

      <Box
        x={170}
        y={34}
        width={38}
        height={24}
        fill="none"
        title="5 removed"
      />
    </IllustrationCanvas>
  );
}