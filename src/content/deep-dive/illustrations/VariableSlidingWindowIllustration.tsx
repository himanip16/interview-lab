// src/content/deep-dive/illustrations/VariableSlidingWindowIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function VariableSlidingWindowIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 110">
      <Label x={8} y={14}>
        Expand the window, then shrink it until the condition is satisfied
      </Label>

      <Box x={10}  y={42} width={22} height={20} fill="mint" stroke="mintDeep" title="2" />
      <Box x={34}  y={42} width={22} height={20} fill="mint" stroke="mintDeep" title="1" />
      <Box x={58}  y={42} width={22} height={20} fill="mint" stroke="mintDeep" title="5" />
      <Box x={82}  y={42} width={22} height={20} fill="mint" stroke="mintDeep" title="3" />
      <Box x={106} y={42} width={22} height={20} fill="soft" title="4" />
      <Box x={130} y={42} width={22} height={20} fill="soft" title="2" />

      <Arrow
        x1={92}
        y1={74}
        x2={116}
        y2={74}
        head
        label="expand"
      />

      <Arrow
        x1={44}
        y1={90}
        x2={68}
        y2={90}
        head
        label="shrink"
      />
    </IllustrationCanvas>
  );
}