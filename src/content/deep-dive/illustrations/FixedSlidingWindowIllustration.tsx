// src/content/deep-dive/illustrations/FixedSlidingWindowIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function FixedSlidingWindowIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 100">
      <Label x={8} y={14}>
        A fixed-size window slides one position at a time
      </Label>

      <Box x={10}  y={40} width={22} height={20} fill="soft" title="2" />
      <Box x={34}  y={40} width={22} height={20} fill="mint" stroke="mintDeep" title="5" />
      <Box x={58}  y={40} width={22} height={20} fill="mint" stroke="mintDeep" title="1" />
      <Box x={82}  y={40} width={22} height={20} fill="mint" stroke="mintDeep" title="7" />
      <Box x={106} y={40} width={22} height={20} fill="soft" title="3" />
      <Box x={130} y={40} width={22} height={20} fill="soft" title="6" />

      <Arrow
        x1={44}
        y1={74}
        x2={92}
        y2={74}
        head
        label="slide"
      />

      <Label x={28} y={92} size={6}>
        -5
      </Label>

      <Label x={98} y={92} size={6}>
        +3
      </Label>
    </IllustrationCanvas>
  );
}