import React from 'react';
import { cn } from '@/lib/utils';

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  label: string;
  category: 'practice' | 'learn' | 'live' | 'concept' | 'info' | 'social' | 'neutral';
  kind?: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  animated?: boolean;
}

interface DiagramCanvasProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  onNodeClick?: (node: DiagramNode) => void;
  selectedNode?: string;
  className?: string;
}

/**
 | DiagramCanvas Pattern
 * 
 * A config-driven pattern for rendering positioned nodes + animated connectors.
 * Reconciles three different node-diagram implementations into one.
 * Delegates detail display to Inspector pattern.
 * 
 * This pattern provides:
 * - Config-driven node rendering (nodes[] array)
 * - Config-driven edge rendering (edges[] array)
 * - Category-based color mapping for nodes
 * - Animated connectors (flow animation)
 * - Click handling for node selection
 * - No business logic
 * 
 * Usage: Whiteboards, system diagrams, architecture visualizations
 * 
 * @example
 * <DiagramCanvas
 *   nodes={[
 *     { id: '1', x: 100, y: 100, label: 'Load Balancer', category: 'neutral', kind: 'Gateway' },
 *     { id: '2', x: 300, y: 100, label: 'Web Server', category: 'learn', kind: 'Compute' }
 *   ]}
 *   edges={[
 *     { from: '1', to: '2', animated: true }
 *   ]}
 *   onNodeClick={(node) => setSelectedNode(node)}
 * />
 */
export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  nodes,
  edges,
  onNodeClick,
  selectedNode,
  className
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      practice: 'var(--category-practice)',
      learn: 'var(--category-learn)',
      live: 'var(--category-live)',
      concept: 'var(--category-concept)',
      info: 'var(--category-info)',
      social: 'var(--category-social)',
      neutral: 'var(--category-neutral)',
    };
    return colors[category] || colors.neutral;
  };

  const getCategoryBg = (category: string) => {
    const colors: Record<string, string> = {
      practice: 'var(--category-practice-bg)',
      learn: 'var(--category-learn-bg)',
      live: 'var(--category-live-bg)',
      concept: 'var(--category-concept-bg)',
      info: 'var(--category-info-bg)',
      social: 'var(--category-social-bg)',
      neutral: 'var(--category-neutral-bg)',
    };
    return colors[category] || colors.neutral;
  };

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Render edges */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={`edge-${index}`}
              x1={fromNode.x + 60}
              y1={fromNode.y + 30}
              x2={toNode.x + 60}
              y2={toNode.y + 30}
              stroke="var(--border-default)"
              strokeWidth="2"
              className={cn(edge.animated && 'flow-line')}
            />
          );
        })}
      </svg>

      {/* Render nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          onClick={() => onNodeClick?.(node)}
          className={cn(
            'absolute cursor-pointer transition-transform hover:scale-105',
            'w-[120px] h-[60px] rounded-[var(--radius-card)]',
            'border-2 flex flex-col items-center justify-center',
            'pointer-events-auto'
          )}
          style={{
            left: node.x,
            top: node.y,
            borderColor: getCategoryColor(node.category),
            backgroundColor: getCategoryBg(node.category),
            boxShadow: selectedNode === node.id ? 'var(--shadow-hover)' : 'var(--shadow-resting)',
          }}
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: getCategoryColor(node.category) }}
          >
            {node.kind || node.category}
          </span>
          <span className="text-[13px] font-medium text-[var(--text-primary)] mt-1">
            {node.label}
          </span>
        </div>
      ))}
    </div>
  );
};
