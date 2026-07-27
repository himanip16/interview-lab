// src/content/deep-dive/illustrations/BitManipulationIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
} from "../../../shared/diagram/primitives";

export function BitManipulationIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 110">
      <Label x={8} y={14}>
        Bitwise operations compare corresponding bits independently
      </Label>

      {/* A */}
      <Box x={20} y={28} width={20} height={18} fill="mint" stroke="mintDeep" title="1" />
      <Box x={42} y={28} width={20} height={18} fill="mint" stroke="mintDeep" title="0" />
      <Box x={64} y={28} width={20} height={18} fill="mint" stroke="mintDeep" title="1" />
      <Box x={86} y={28} width={20} height={18} fill="mint" stroke="mintDeep" title="1" />

      <Label x={112} y={40}>AND</Label>

      {/* B */}
      <Box x={140} y={28} width={20} height={18} fill="violet" stroke="violet" title="1" />
      <Box x={162} y={28} width={20} height={18} fill="violet" stroke="violet" title="1" />
      <Box x={184} y={28} width={20} height={18} fill="violet" stroke="violet" title="0" />
      <Box x={206} y={28} width={20} height={18} fill="violet" stroke="violet" title="1" />

      {/* Result */}
      <Box x={20} y={72} width={20} height={18} fill="amber" stroke="amber" title="1" />
      <Box x={42} y={72} width={20} height={18} fill="amber" stroke="amber" title="0" />
      <Box x={64} y={72} width={20} height={18} fill="amber" stroke="amber" title="0" />
      <Box x={86} y={72} width={20} height={18} fill="amber" stroke="amber" title="1" />
    </IllustrationCanvas>
  );
}