// src/content/deep-dive/illustrations/ACIDIsolationIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function ACIDIsolationIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 90">
      <Label x={8} y={14}>
        Stronger isolation ↓ concurrency ↑ consistency
      </Label>

      <Arrow x1={18} y1={46} x2={202} y2={46} head />

      <Box
        x={18}
        y={34}
        width={24}
        height={24}
        fill="mint"
        stroke="mintDeep"
        title="RU"
      />

      <Box
        x={62}
        y={34}
        width={24}
        height={24}
        fill="mint"
        stroke="mintDeep"
        title="RC"
      />

      <Box
        x={106}
        y={34}
        width={24}
        height={24}
        fill="amber"
        stroke="amber"
        title="RR"
      />

      <Box
        x={150}
        y={34}
        width={52}
        height={24}
        fill="coral"
        stroke="coral"
        title="Serializable"
      />

      <Label x={18} y={72} size={6}>
        More concurrency
      </Label>

      <Label x={160} y={72} size={6}>
        Stronger guarantees
      </Label>
    </IllustrationCanvas>
  );
}