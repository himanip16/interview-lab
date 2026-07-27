// src/content/deep-dive/illustrations/TabulationIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function TabulationIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 100">
      <Label x={8} y={14}>
        Build larger solutions from previously computed entries
      </Label>

      <Box x={10}  y={40} width={30} height={24} fill="mint" stroke="mintDeep" title="dp[0]" />
      <Box x={50}  y={40} width={30} height={24} fill="mint" stroke="mintDeep" title="dp[1]" />
      <Box x={90}  y={40} width={30} height={24} fill="mint" stroke="mintDeep" title="dp[2]" />
      <Box x={130} y={40} width={30} height={24} fill="mint" stroke="mintDeep" title="dp[3]" />
      <Box x={170} y={40} width={40} height={24} fill="violet" stroke="violet" title="dp[n]" />

      <Arrow x1={40} y1={52} x2={50} y2={52} head />
      <Arrow x1={80} y1={52} x2={90} y2={52} head />
      <Arrow x1={120} y1={52} x2={130} y2={52} head />
      <Arrow x1={160} y1={52} x2={170} y2={52} head />
    </IllustrationCanvas>
  );
}