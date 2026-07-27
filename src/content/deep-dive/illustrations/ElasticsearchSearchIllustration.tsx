// src/content/deep-dive/illustrations/ElasticsearchSearchIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function ElasticsearchSearchIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Search fans out to every shard, then merges the top results
      </Label>

      <Box
        x={8}
        y={46}
        width={42}
        height={24}
        fill="none"
        title="Query"
      />

      <Arrow x1={50} y1={58} x2={82} y2={26} head />
      <Arrow x1={50} y1={58} x2={82} y2={58} head />
      <Arrow x1={50} y1={58} x2={82} y2={90} head />

      <Box
        x={82}
        y={16}
        width={52}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="Shard 1"
      />

      <Box
        x={82}
        y={48}
        width={52}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="Shard 2"
      />

      <Box
        x={82}
        y={80}
        width={52}
        height={20}
        fill="mint"
        stroke="mintDeep"
        title="Shard 3"
      />

      <Arrow x1={134} y1={26} x2={170} y2={58} head />
      <Arrow x1={134} y1={58} x2={170} y2={58} head />
      <Arrow x1={134} y1={90} x2={170} y2={58} head />

      <Box
        x={170}
        y={45}
        width={42}
        height={26}
        fill="violet"
        stroke="violet"
        title="Merge"
        subtitle="Top K"
      />
    </IllustrationCanvas>
  );
}