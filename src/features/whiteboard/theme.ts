// src/features/whiteboard/theme.ts

/**
 * Shared theme tokens for whiteboard components
 * Centralizes colors, dimensions, and styling for consistency
 */

// Color palette
export const WHITEBOARD_COLORS = {
  // Edge colors
  edgeNormal: 'rgba(21, 22, 28, 0.16)',
  edgeActive: 'rgba(0, 217, 163, 0.6)',
  edgeHover: 'rgba(0, 217, 163, 0.8)',
  
  // Navigation hint colors
  navigationArrow: 'var(--mint)',
  
  // Focus effect colors
  dimOverlay: 'black',
  
  // Node colors
  nodeBorder: 'rgba(21, 22, 28, 0.1)',
  nodeBorderActive: 'rgba(0, 217, 163, 0.6)',
} as const;

// Edge styling
export const EDGE_STYLES = {
  normal: {
    strokeWidth: 2,
    strokeDasharray: '5 6',
  },
  active: {
    strokeWidth: 3,
    strokeDasharray: '0',
  },
  hover: {
    strokeWidth: 3,
    strokeDasharray: '5 6',
  },
} as const;

// Arrow markers
export const ARROW_CONFIG = {
  headSize: 10,
  markerWidth: 10,
  markerHeight: 10,
  refX: 9,
  refY: 5,
} as const;

// Navigation hint styling
export const NAVIGATION_HINTS = {
  arrowLength: 30,
  padding: 10,
  strokeWidth: 2,
  strokeDasharray: '4 4',
  opacity: 0.6,
} as const;

// Focus effects
export const FOCUS_EFFECTS = {
  dimOpacity: 0.3,
  nodeBorderRadius: 12,
  transitionDuration: 500,
} as const;

// Interaction targets
export const INTERACTION_TARGETS = {
  clickTargetStrokeWidth: 12,
  clickTargetOpacity: 0,
} as const;

// Animation
export const ANIMATION_CONFIG = {
  flowDuration: 1.5,
  pulseDuration: 2,
} as const;
