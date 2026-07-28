// src/content/deep-dive/illustrations/AVLTree.tsx

import {
  IllustrationCanvas,
  Node,
  Arrow,
} from "@/shared/diagram/primitives";

export function AVLTreeIllustration() {
  return (
    <IllustrationCanvas viewBox="0 0 64 64">
      {/* edges */}
      <Arrow x1={32} y1={16} x2={20} y2={28} opacity={0.3} />
      <Arrow x1={32} y1={16} x2={44} y2={28} opacity={0.3} />

      <Arrow x1={20} y1={28} x2={14} y2={42} opacity={0.3} />
      <Arrow x1={20} y1={28} x2={26} y2={42} opacity={0.3} />

      <Arrow x1={44} y1={28} x2={38} y2={42} opacity={0.3} />
      <Arrow x1={44} y1={28} x2={50} y2={42} opacity={0.3} />

      {/* nodes */}
      <Node cx={32} cy={16} r={4} fill="violet" />
      <Node cx={20} cy={28} r={4} fill="mint" />
      <Node cx={44} cy={28} r={4} fill="mint" />

      <Node cx={14} cy={42} r={3} fill="coral" />
      <Node cx={26} cy={42} r={3} fill="coral" />
      <Node cx={38} cy={42} r={3} fill="coral" />
      <Node cx={50} cy={42} r={3} fill="coral" />

      {/* balanced check */}
      <path
        d="M52 10L55 13L60 8"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IllustrationCanvas>
  );
}