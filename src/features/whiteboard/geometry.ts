export interface Point { x: number; y: number; }
export interface Rect extends Point { width: number; height: number; }

/**
 * Calculates the connection point on the perimeter of a rectangle
 * looking toward a target point (the center of the other node).
 */
export function getConnectionPoint(source: Rect, target: Point): Point {
  const dx = target.x - source.x;
  const dy = target.y - source.y;

  // Calculate the scale to the horizontal and vertical edges
  const hScale = dx === 0 ? Infinity : Math.abs((source.width / 2) / dx);
  const vScale = dy === 0 ? Infinity : Math.abs((source.height / 2) / dy);

  const scale = Math.min(hScale, vScale);

  return {
    x: source.x + dx * scale,
    y: source.y + dy * scale
  };
}