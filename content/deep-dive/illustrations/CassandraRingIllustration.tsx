import { IllustrationCanvas, Label, RingPath, Node, Arrow, ringPositions } from './primitives';

export function CassandraRingIllustration() {
  const positions = ringPositions(80, 65, 38, 6);

  return (
    <IllustrationCanvas viewBox="0 0 160 120">
      <Label x={10} y={14}>Peer ring — every node is equal</Label>

      <RingPath cx={80} cy={65} r={38} />
      {positions.map((p, i) => (
        <Node key={i} cx={p.x} cy={p.y} r={6} fill="mintDeep" />
      ))}

      <Arrow x1={10} y1={30} x2={74} y2={29} color="violet" dashed head label="write A" />
      <Arrow x1={150} y1={100} x2={86} y2={102} color="coral" dashed head label="write B" />

      <Label x={20} y={118} size={7}>No node coordinates the others — any peer accepts any key</Label>
    </IllustrationCanvas>
  );
}
