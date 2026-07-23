// src/content/deep-dive/illustrations/ConsistentHashing.tsx

'use client';

import { useState, useRef, useEffect } from 'react';

export function ConsistentHashingIllustration() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState([
    { id: 'A', angle: 20, color: '#00D9A3', alive: true },
    { id: 'B', angle: 110, color: '#FF5A3C', alive: true },
    { id: 'C', angle: 200, color: '#6A5AE0', alive: true },
    { id: 'D', angle: 300, color: '#00A87E', alive: true },
  ]);
  const [log, setLog] = useState('Click "Send a request" to see it land on the ring.');

  const cx = 110;
  const cy = 110;
  const r = 80;

  const pt = (angle: number, radius: number) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(a),
      y: cy + radius * Math.sin(a),
    };
  };

  const nextClockwise = (angle: number) => {
    const alive = nodes.filter((n) => n.alive).sort((a, b) => a.angle - b.angle);
    for (const n of alive) {
      if (n.angle >= angle) return n;
    }
    return alive[0];
  };

  const draw = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    svg.innerHTML = '';

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', String(cx));
    ring.setAttribute('cy', String(cy));
    ring.setAttribute('r', String(r));
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', 'var(--border)');
    ring.setAttribute('stroke-width', '1.5');
    svg.appendChild(ring);

    nodes.forEach((n) => {
      const p = pt(n.angle, r);
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', String(p.x));
      c.setAttribute('cy', String(p.y));
      c.setAttribute('r', String(n.alive ? 9 : 9));
      c.setAttribute('fill', n.alive ? n.color : 'none');
      c.setAttribute('stroke', n.alive ? 'none' : '#FF5A3C');
      c.setAttribute('stroke-width', '2');
      svg.appendChild(c);

      if (!n.alive) {
        const x1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        x1.setAttribute('x1', String(p.x - 5));
        x1.setAttribute('y1', String(p.y - 5));
        x1.setAttribute('x2', String(p.x + 5));
        x1.setAttribute('y2', String(p.y + 5));
        x1.setAttribute('stroke', '#FF5A3C');
        x1.setAttribute('stroke-width', '2');
        svg.appendChild(x1);
      }

      const lp = pt(n.angle, r + 18);
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', String(lp.x));
      t.setAttribute('y', String(lp.y));
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-size', '11');
      t.setAttribute('font-weight', '700');
      t.setAttribute('fill', n.alive ? 'var(--text)' : 'var(--text-soft)');
      t.textContent = n.id;
      svg.appendChild(t);
    });
  };

  const sendRequest = (forceAngle?: number) => {
    if (!svgRef.current) return;
    const angle = forceAngle !== undefined ? forceAngle : Math.random() * 360;
    const start = pt(angle, r);
    const target = nextClockwise(angle);
    const end = pt(target.angle, r);

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '5');
    dot.setAttribute('fill', 'var(--text)');
    dot.setAttribute('cx', String(start.x));
    dot.setAttribute('cy', String(start.y));
    svgRef.current.appendChild(dot);

    const midAngle = (angle + target.angle) / 2;
    const mid = pt(midAngle, r * 0.55);
    const path = `M${start.x},${start.y} Q${mid.x},${mid.y} ${end.x},${end.y}`;

    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    anim.setAttribute('dur', '0.9s');
    anim.setAttribute('fill', 'freeze');
    anim.setAttribute('path', path);
    dot.appendChild(anim);

    setLog(`Request hashed near ${Math.round(angle)}° → nearest clockwise node is ${target.id}`);

    setTimeout(() => dot.remove(), 1400);
  };

  const killNode = () => {
    const b = nodes.find((n) => n.id === 'B');
    if (!b || !b.alive) return;
    b.alive = false;
    setNodes([...nodes]);
    draw();
    setLog('Node B failed. Its keys now belong to the next node clockwise — watch:');
    setTimeout(() => sendRequest(90), 500);
    setTimeout(() => sendRequest(105), 1600);
  };

  const reset = () => {
    nodes.forEach((n) => (n.alive = true));
    setNodes([...nodes]);
    draw();
    setLog('Click "Send a request" to see it land on the ring.');
  };

  useEffect(() => {
    draw();
  }, [nodes]);

  return (
    <div className="diagram-card">
      <div className="ring-stage">
        <svg className="ringsvg" width="220" height="220" viewBox="0 0 220 220" ref={svgRef} />
      </div>
      <div className="ring-controls">
        <button className="rbtn primary" onClick={() => sendRequest()}>
          Send a request
        </button>
        <button className="rbtn danger" onClick={killNode}>
          Node B fails
        </button>
        <button className="rbtn" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="ring-log" dangerouslySetInnerHTML={{ __html: log }} />
    </div>
  );
}
