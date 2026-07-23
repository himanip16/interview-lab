import { IllustrationCanvas, Label, Box, Arrow } from './primitives';

export function CassandraReadPathIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>Read path — gather every version, then merge</Label>

      <Box x={8} y={46} width={46} height={24} fill="none" title="read key" />

      <Box x={80} y={16} width={60} height={20} fill="mintDeep" stroke="mintDeep" title="memtable @10:00:09" titleColor="var(--mint-deep)" />
      <Box x={80} y={50} width={60} height={20} fill="violet" stroke="violet" title="SSTable_1 @10:00:04" titleColor="var(--violet)" />
      <Box x={80} y={84} width={60} height={20} fill="none" title="ruled out (bloom filter)" titleColor="var(--text-soft)" />

      <Arrow x1={54} y1={55} x2={80} y2={27} />
      <Arrow x1={54} y1={58} x2={80} y2={60} />
      <Arrow x1={54} y1={62} x2={80} y2={93} dashed />

      <Arrow x1={140} y1={26} x2={168} y2={46} />
      <Arrow x1={140} y1={60} x2={168} y2={52} />

      <Box x={168} y={40} width={44} height={26} fill="mint" stroke="mintDeep" title="merge —" subtitle="newest wins" />
    </IllustrationCanvas>
  );
}
