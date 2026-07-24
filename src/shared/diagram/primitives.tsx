
// src/shared/diagram/primitives.tsx

// Small, composable SVG building blocks shared by every illustration in this
// folder. An illustration should almost never need a raw <circle>/<rect>/<line>
// — reach for Node / Box / Arrow / Label instead, and only drop to raw SVG for
// something genuinely one-off.

export const palette = {
  mint: '#00D9A3',
  mintDeep: '#00A87E',
  violet: '#6A5AE0',
  coral: '#FF5A3C',
  amber: '#E8940A',
  ink: '#15161C',
} as const;

type Fill = keyof typeof palette | 'soft' | 'none';

function resolveFill(fill?: Fill, opacity?: number): { fill: string; opacity?: number } {
  if (!fill || fill === 'none') return { fill: 'none' };
  if (fill === 'soft') return { fill: 'var(--border-soft)' };
  return { fill: palette[fill], opacity };
}

/** A labeled circular node — the basic unit for servers/peers/replicas. */
export function Node({
  cx,
  cy,
  r = 6,
  fill = 'mintDeep',
  label,
  labelDx = 0,
  labelDy = -12,
  labelColor = 'var(--text)',
}: {
  cx: number;
  cy: number;
  r?: number;
  fill?: Fill;
  label?: string;
  labelDx?: number;
  labelDy?: number;
  labelColor?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} {...resolveFill(fill)} />
      {label && (
        <text
          x={cx + labelDx}
          y={cy + labelDy}
          fontSize={7}
          fill={labelColor}
          fontFamily="Inter"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** A labeled rounded box — for pipeline steps, storage layers, states. */
export function Box({
  x,
  y,
  width,
  height,
  fill = 'soft',
  stroke,
  title,
  subtitle,
  titleColor = 'var(--text)',
  subtitleColor = 'var(--text-soft)',
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: Fill;
  stroke?: keyof typeof palette | 'border';
  title?: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
}) {
  const strokeColor = !stroke ? 'var(--border)' : stroke === 'border' ? 'var(--border)' : palette[stroke];
  const { fill: fillColor, opacity } = resolveFill(fill, fill !== 'soft' && fill !== 'none' ? 0.15 : undefined);

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6} fill={fillColor} opacity={opacity} stroke={strokeColor} />
      {title && (
        <text x={x + 6} y={y + height / 2 - (subtitle ? 4 : -3)} fontSize={7} fill={titleColor} fontFamily="Inter">
          {title}
        </text>
      )}
      {subtitle && (
        <text x={x + 6} y={y + height / 2 + 8} fontSize={6} fill={subtitleColor} fontFamily="Inter">
          {subtitle}
        </text>
      )}
    </g>
  );
}


export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = 'var(--text-soft)',
  dashed = false,
  head = false,
  opacity,
  label,
  labelColor,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: keyof typeof palette | string;
  dashed?: boolean;
  head?: boolean;
  opacity?: number;
  label?: string;
  labelColor?: string;
}) {
  color = resolveColor(color);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headSize = 5;
  const hx1 = x2 - headSize * Math.cos(angle - Math.PI / 7);
  const hy1 = y2 - headSize * Math.sin(angle - Math.PI / 7);
  const hx2 = x2 - headSize * Math.cos(angle + Math.PI / 7);
  const hy2 = y2 - headSize * Math.sin(angle + Math.PI / 7);

  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1.2}
        strokeDasharray={dashed ? '2,2' : undefined}
      />
      {head && <polygon points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`} fill={color} />}
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 4}
          fontSize={6.5}
          fill={labelColor ?? color}
          fontFamily="Inter"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function resolveColor(color?: keyof typeof palette | string): string {
  if (!color) return 'var(--text-soft)';
  return color in palette ? palette[color as keyof typeof palette] : color;
}

/** A straight or dashed connector, optionally with an arrowhead and label. */


/** A ring path (unfilled circle) for peer-to-peer / hash-ring diagrams. */
export function RingPath({
  cx,
  cy,
  r,
  dashed = false,
  opacity,
}: {
  cx: number;
  cy: number;
  r: number;
  dashed?: boolean;
  opacity?: number;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke="var(--border)"
      strokeWidth={1.5}
      strokeDasharray={dashed ? '4,7' : undefined}
      opacity={opacity}
    />
  );
}

/** Places n items evenly around a circle. Returns {x, y} for each index. */
export function ringPositions(cx: number, cy: number, r: number, count: number, startDeg = -90) {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((startDeg + (360 / count) * i) * Math.PI) / 180;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

/** A standalone text label — for titles, footnotes, standalone captions. */
export function Label({
  x,
  y,
  children,
  size = 8,
  color = 'var(--text-soft)',
  weight,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={color} fontFamily="Inter" fontWeight={weight}>
      {children}
    </text>
  );
}

/** Wraps children in a consistently-sized, non-scaling SVG canvas. */
export function IllustrationCanvas({
  viewBox,
  children,
}: {
  viewBox: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox={viewBox} width="100%">
      {children}
    </svg>
  );
}
