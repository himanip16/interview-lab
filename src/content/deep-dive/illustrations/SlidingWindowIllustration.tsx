// src/content/deep-dive/illustrations/SlidingWindowIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function SlidingWindowIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 100">
      <Label x={8} y={14}>
        Reuse the previous window by removing one element and adding one
      </Label>

      <Box x={12} y={42} width={22} height={20} fill="soft" title="2" />
      <Box x={36} y={42} width={22} height={20} fill="mint" stroke="mintDeep" title="5" />
      <Box x={60} y={42} width={22} height={20} fill="mint" stroke="mintDeep" title="1" />
      <Box x={84} y={42} width={22} height={20} fill="mint" stroke="mintDeep" title="7" />
      <Box x={108} y={42} width={22} height={20} fill="soft" title="3" />
      <Box x={132} y={42} width={22} height={20} fill="soft" title="6" />

      <Arrow
        x1={48}
        y1={74}
        x2={96}
        y2={74}
        head
        label="slide"
      />

      <Label x={32} y={90} size={6}>
        remove 5
      </Label>

      <Label x={96} y={90} size={6}>
        add 3
      </Label>
    </IllustrationCanvas>
  );
}