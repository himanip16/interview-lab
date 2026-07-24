// src/content/deep-dive/illustrations/CassandraWritePathIllustration.tsx

import { IllustrationCanvas, Label, Box, Arrow } from '../../../shared/diagram/primitives';

export function CassandraWritePathIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 100">
      <Label x={8} y={14}>Write path — two steps, no lookup</Label>

      <Box x={8} y={38} width={42} height={24} fill="none" title="WRITE" />

      <Arrow x1={50} y1={45} x2={90} y2={24} />
      <Arrow x1={50} y1={56} x2={90} y2={76} />

      <Box x={90} y={10} width={60} height={26} fill="violet" stroke="violet" title="Commit log" subtitle="sequential disk write" titleColor="var(--violet)" />
      <Box x={90} y={64} width={60} height={26} fill="mintDeep" stroke="mintDeep" title="Memtable" subtitle="in-memory insert" titleColor="var(--mint-deep)" />

      <Arrow x1={150} y1={23} x2={182} y2={46} />
      <Arrow x1={150} y1={77} x2={182} y2={54} />

      <Box x={182} y={38} width={30} height={24} fill="none" title="ACK" />
    </IllustrationCanvas>
  );
}
