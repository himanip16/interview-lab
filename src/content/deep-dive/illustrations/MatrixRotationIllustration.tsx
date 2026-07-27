// src/content/deep-dive/illustrations/MatrixRotationIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function MatrixRotationIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Rotate one layer by cycling four corresponding cells
      </Label>

      {/* Matrix */}

      <Box x={24} y={26} width={22} height={22} fill="mint" stroke="mintDeep" title="1" />
      <Box x={48} y={26} width={22} height={22} fill="soft" />
      <Box x={72} y={26} width={22} height={22} fill="amber" stroke="amber" title="2" />

      <Box x={24} y={50} width={22} height={22} fill="soft" />
      <Box x={48} y={50} width={22} height={22} fill="violet" stroke="violet" title="•" />
      <Box x={72} y={50} width={22} height={22} fill="soft" />

      <Box x={24} y={74} width={22} height={22} fill="coral" stroke="coral" title="4" />
      <Box x={48} y={74} width={22} height={22} fill="soft" />
      <Box x={72} y={74} width={22} height={22} fill="mint" stroke="mintDeep" title="3" />

      {/* Four-way cycle */}

      <Arrow x1={36} y1={24} x2={82} y2={24} head />
      <Arrow x1={96} y1={38} x2={96} y2={84} head />
      <Arrow x1={82} y1={98} x2={36} y2={98} head />
      <Arrow x1={22} y1={84} x2={22} y2={38} head />
    </IllustrationCanvas>
  );
}