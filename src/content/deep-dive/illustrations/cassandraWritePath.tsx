// src/content/deep-dive/illustrations/cassandraWritePath.ts

import { IllustrationCanvas, Box, Arrow, Label } from '@/shared/diagram/primitives';

export function CassandraWritePathIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 100">
      <Label x={8} y={14}>
        Cassandra write path
      </Label>

      <Box x={10} y={40} width={50} height={24} fill="mint" stroke="mintDeep" title="Write Request" />
      <Box x={80} y={40} width={50} height={24} fill="soft" title="Commit Log" subtitle="append-only" />
      <Box x={150} y={40} width={50} height={24} fill="soft" title="Memtable" subtitle="in-memory" />

      <Arrow x1={60} y1={52} x2={80} y2={52} head label="1. append" />
      <Arrow x1={60} y1={52} x2={150} y2={52} head label="2. write" />
    </IllustrationCanvas>
  );
}