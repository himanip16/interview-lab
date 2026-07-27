// src/content/deep-dive/illustrations/TrieIllustration.tsx

import {
  IllustrationCanvas,
  Label,
  Node,
  Arrow,
} from "../../../shared/diagram/primitives";

export function TrieIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 220 120">
      <Label x={8} y={14}>
        Words share common prefixes before branching into different suffixes
      </Label>

      {/* Root */}
      <Node cx={26} cy={60} label="•" fill="mintDeep" />

      {/* c */}
      <Node cx={58} cy={60} label="c" />
      <Arrow x1={32} y1={60} x2={52} y2={60} />

      {/* a */}
      <Node cx={90} cy={60} label="a" />
      <Arrow x1={64} y1={60} x2={84} y2={60} />

      {/* t */}
      <Node cx={122} cy={42} label="t" />
      <Arrow x1={96} y1={56} x2={116} y2={46} />

      {/* r */}
      <Node cx={122} cy={78} label="r" />
      <Arrow x1={96} y1={64} x2={116} y2={74} />

      {/* End markers */}
      <Node cx={154} cy={42} r={4} fill="violet" label="✓" labelDy={-10} />
      <Arrow x1={128} y1={42} x2={148} y2={42} />

      <Node cx={154} cy={78} r={4} fill="violet" label="✓" labelDy={-10} />
      <Arrow x1={128} y1={78} x2={148} y2={78} />

      <Label x={168} y={46} size={6}>
        cat
      </Label>

      <Label x={168} y={82} size={6}>
        car
      </Label>
    </IllustrationCanvas>
  );
}