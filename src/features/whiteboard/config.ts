// src/features/whiteboard/config.ts

export type WhiteboardConfig = {
  canvasWidth: number;
  canvasHeight: number;

  gridColumns: number;
  gridRows: number;

  defaultNodeWidth: number;
  defaultNodeHeight: number;

  enableCollisionDetection: boolean;
};

export const DEFAULT_WHITEBOARD_CONFIG: WhiteboardConfig = {
  canvasWidth: 3000, // Changed from 100,000
  canvasHeight: 3000, // Changed from 100,000

  gridColumns: 16,
  gridRows: 16,

  defaultNodeWidth: 240, // Slightly larger for better readability
  defaultNodeHeight: 120,

  enableCollisionDetection: false,
};