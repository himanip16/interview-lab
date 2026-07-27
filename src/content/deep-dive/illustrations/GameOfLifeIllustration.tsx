// src/content/deep-dive/illustrations/GameOfLifeIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function GameOfLifeIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 110">
      <Label x={8} y={14}>
        Every cell updates simultaneously using its neighbors
      </Label>

      {/* Current generation */}
      <Box x={12} y={30} width={18} height={18} fill="soft" />
      <Box x={32} y={30} width={18} height={18} fill="mint" stroke="mintDeep" />
      <Box x={52} y={30} width={18} height={18} fill="soft" />

      <Box x={12} y={50} width={18} height={18} fill="soft" />
      <Box x={32} y={50} width={18} height={18} fill="mint" stroke="mintDeep" />
      <Box x={52} y={50} width={18} height={18} fill="soft" />

      <Box x={12} y={70} width={18} height={18} fill="soft" />
      <Box x={32} y={70} width={18} height={18} fill="mint" stroke="mintDeep" />
      <Box x={52} y={70} width={18} height={18} fill="soft" />

      <Arrow
        x1={82}
        y1={58}
        x2={136}
        y2={58}
        head
        label="next generation"
      />

      {/* Next generation */}
      <Box x={150} y={30} width={18} height={18} fill="soft" />
      <Box x={170} y={30} width={18} height={18} fill="soft" />
      <Box x={190} y={30} width={18} height={18} fill="soft" />

      <Box x={150} y={50} width={18} height={18} fill="mint" stroke="mintDeep" />
      <Box x={170} y={50} width={18} height={18} fill="mint" stroke="mintDeep" />
      <Box x={190} y={50} width={18} height={18} fill="mint" stroke="mintDeep" />

      <Box x={150} y={70} width={18} height={18} fill="soft" />
      <Box x={170} y={70} width={18} height={18} fill="soft" />
      <Box x={190} y={70} width={18} height={18} fill="soft" />
    </IllustrationCanvas>
  );
}