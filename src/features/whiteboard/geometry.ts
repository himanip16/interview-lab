export interface Point { x: number; y: number; }

/**
 * Rect is CENTER-based: x,y is the center of the box, not top-left.
 * This matches how nodes are rendered (translate -50%/-50%) and how
 * connection-point math below treats it. collision.ts converts to
 * corners internally — don't assume corner semantics elsewhere.
 */
export interface Rect extends Point { width: number; height: number; }

/**
 * Calculates the connection point on the perimeter of a rectangle
 * looking toward a target point (the center of the other node).
 */
export function getConnectionPoint(source: Rect, target: Point): Point {
  const dx = target.x - source.x;
  const dy = target.y - source.y;

  if (dx === 0 && dy === 0) {
    // Same center (overlapping nodes) — no direction to project along.
    return { x: source.x, y: source.y };
  }

  const hScale = dx === 0 ? Infinity : Math.abs((source.width / 2) / dx);
  const vScale = dy === 0 ? Infinity : Math.abs((source.height / 2) / dy);

  const scale = Math.min(hScale, vScale);

  return {
    x: source.x + dx * scale,
    y: source.y + dy * scale,
  };
}