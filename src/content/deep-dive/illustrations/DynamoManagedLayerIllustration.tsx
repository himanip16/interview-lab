// src/content/deep-dive/illustrations/DynamoManagedLayerIllustration.tsx

import { IllustrationCanvas, Label, Box } from './primitives';

export function DynamoManagedLayerIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 200 110">
      <Label x={8} y={14}>What you see vs what AWS manages</Label>

      <Box x={8} y={24} width={184} height={28} fill="none" title="Your table" subtitle="schema · partition key · read/write capacity" />

      <line x1="8" y1="58" x2="192" y2="58" stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3" />
      <Label x={62} y={66} size={6}>managed boundary</Label>

      <Box x={8} y={72} width={184} height={30} fill="coral" stroke="coral" title="AWS managed" titleColor="var(--coral)" />

      {[14, 50, 86, 122].map((x) => (
        <rect key={x} x={x} y={88} width={30} height={10} rx={3} fill="var(--coral)" opacity={0.3} />
      ))}
      <Label x={14} y={107} size={6}>partitions — created, split, rebalanced automatically</Label>
    </IllustrationCanvas>
  );
}
