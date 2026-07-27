// src/content/deep-dive/illustrations/MemoizationIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function MemoizationIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Cache a computed result and reuse it on future calls
      </Label>

      <Box
        x={12}
        y={46}
        width={44}
        height={24}
        fill="mint"
        stroke="mintDeep"
        title="f(4)"
      />

      <Arrow x1={56} y1={58} x2={90} y2={58} head />

      <Box
        x={90}
        y={34}
        width={48}
        height={48}
        fill="violet"
        stroke="violet"
        title="Cache"
        subtitle="f(4) = 3"
      />

      <Arrow
        x1={114}
        y1={82}
        x2={114}
        y2={102}
        dashed
        head
        label="store"
      />

      <Arrow x1={138} y1={58} x2={172} y2={58} head />

      <Box
        x={172}
        y={46}
        width={40}
        height={24}
        fill="amber"
        stroke="amber"
        title="Reuse"
      />
    </IllustrationCanvas>
  );
}