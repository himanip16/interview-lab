// src/content/deep-dive/illustrations/ACIDAtomicityIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Box,
  Arrow,
} from "../../../shared/diagram/primitives";

export function ACIDAtomicityIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Crash before COMMIT → every earlier change is rolled back
      </Label>

      <Box
        x={8}
        y={42}
        width={42}
        height={28}
        fill="none"
        title="BEGIN"
      />

      <Arrow x1={50} y1={56} x2={70} y2={56} head />

      <Box
        x={70}
        y={34}
        width={54}
        height={44}
        fill="mint"
        stroke="mintDeep"
        title="A -= $100"
        subtitle="applied"
      />

      <Arrow x1={124} y1={56} x2={144} y2={56} head />

      <Box
        x={144}
        y={34}
        width={34}
        height={44}
        fill="coral"
        stroke="coral"
        title="💥"
        subtitle="crash"
      />

      <Arrow
        x1={161}
        y1={78}
        x2={97}
        y2={96}
        dashed
        head
        color="coral"
        label="rollback"
      />

      <Box
        x={56}
        y={88}
        width={82}
        height={20}
        fill="none"
        title="Final state = transaction never happened"
      />
    </IllustrationCanvas>
  );
}