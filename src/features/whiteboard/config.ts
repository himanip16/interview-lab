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
  canvasWidth: 1000,
  canvasHeight: 800,

  gridColumns: 12,
  gridRows: 12,

  defaultNodeWidth: 160,
  defaultNodeHeight: 80,

  enableCollisionDetection: true,
};