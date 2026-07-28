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
  canvasWidth: 2000,
  canvasHeight: 1600,

  gridColumns: 16,
  gridRows: 16,

  defaultNodeWidth: 200,
  defaultNodeHeight: 100,

  enableCollisionDetection: true,
};