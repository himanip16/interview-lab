// src/content/deep-dive/illustrations/HashMapIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function HashMapIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        A hash function maps keys to buckets for fast lookup
      </Label>

      <Box
        x={8}
        y={46}
        width={40}
        height={24}
        fill="mint"
        stroke="mintDeep"
        title='"cat"'
      />

      <Arrow
        x1={48}
        y1={58}
        x2={88}
        y2={58}
        head
        label="hash()"
      />

      <Box
        x={88}
        y={46}
        width={40}
        height={24}
        fill="violet"
        stroke="violet"
        title="Bucket 3"
      />

      <Arrow x1={128} y1={58} x2={168} y2={58} head />

      <Box
        x={168}
        y={36}
        width={44}
        height={20}
        fill="soft"
        title="cat → 42"
      />

      <Box
        x={168}
        y={60}
        width={44}
        height={20}
        fill="soft"
        title="car → 18"
      />
    </IllustrationCanvas>
  );
}