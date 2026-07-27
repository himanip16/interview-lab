// src/content/deep-dive/illustrations/SQSIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function SQSIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Producers enqueue messages while consumers process independently
      </Label>

      <Box
        x={8}
        y={46}
        width={44}
        height={24}
        fill="mint"
        stroke="mintDeep"
        title="Producer"
      />

      <Arrow x1={52} y1={58} x2={86} y2={58} head />

      <Box
        x={86}
        y={34}
        width={48}
        height={48}
        fill="violet"
        stroke="violet"
        title="SQS"
        subtitle="Queue"
      />

      <Arrow x1={134} y1={58} x2={168} y2={58} head />

      <Box
        x={168}
        y={46}
        width={44}
        height={24}
        fill="amber"
        stroke="amber"
        title="Consumer"
      />

      <Arrow
        x1={190}
        y1={70}
        x2={190}
        y2={96}
        dashed
        label="Delete"
      />
    </IllustrationCanvas>
  );
}