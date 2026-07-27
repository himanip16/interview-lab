
// src/content/deep-dive/illustrations/AWSLambdaIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function AWSLambdaIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Events invoke functions only when work arrives
      </Label>

      <Box
        x={8}
        y={46}
        width={44}
        height={24}
        fill="none"
        title="Event"
      />

      <Arrow x1={52} y1={58} x2={82} y2={58} head />

      <Box
        x={82}
        y={40}
        width={56}
        height={36}
        fill="mint"
        stroke="mintDeep"
        title="Lambda"
        subtitle="runs code"
      />

      <Arrow x1={138} y1={58} x2={170} y2={58} head />

      <Box
        x={170}
        y={46}
        width={42}
        height={24}
        fill="violet"
        stroke="violet"
        title="Result"
      />

      <Arrow
        x1={110}
        y1={76}
        x2={110}
        y2={102}
        dashed
        label="idle → removed"
      />
    </IllustrationCanvas>
  );
}