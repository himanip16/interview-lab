import { IllustrationCanvas, Label, Node, Box, Arrow } from './primitives';

export function DynamoConsistencyIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>One write, two ways to read it back</Label>

      <Box x={8} y={44} width={40} height={22} fill="none" title="WRITE" />

      <Node cx={110} cy={30} r={7} fill="mintDeep" label="Replica A" labelDy={-12} />
      <Node cx={110} cy={90} r={7} fill="ink" label="Replica B" labelDy={16} labelColor="var(--text-soft)" />

      <Arrow x1={48} y1={50} x2={103} y2={33} label="lands first" />
      <Arrow x1={110} y1={37} x2={110} y2={83} dashed color="var(--text-soft)" label="replicates" />

      <Arrow x1={130} y1={26} x2={175} y2={16} head color="mintDeep" />
      <Box x={175} y={4} width={40} height={22} fill="mint" stroke="mintDeep" title="strong read" subtitle="always current" titleColor="var(--mint-deep)" />

      <Arrow x1={130} y1={90} x2={175} y2={90} head color="coral" />
      <Box x={175} y={78} width={40} height={24} fill="coral" stroke="coral" title="eventual read" subtitle="may be stale" titleColor="var(--coral)" />

      <Label x={8} y={112} size={6.5}>
        Strong reads always hit the replica with the latest write; eventual reads may hit a lagging one
      </Label>
    </IllustrationCanvas>
  );
}
