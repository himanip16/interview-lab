// src/features/learning/services/WhiteboardService.ts

import {
  SystemDesign,
  NodeLayout,
  WhiteboardFrame,
} from "@/features/whiteboard/types/whiteboard";

import {
  DEFAULT_WHITEBOARD_CONFIG,
  WhiteboardConfig,
} from "@/features/whiteboard/config";

import { validateDesign } from "@/features/whiteboard/validation";
import { calculateWhiteboardFrame } from "@/features/whiteboard/calculateWhiteboardFrame";

/**
 * Production Scene Loader
 * Handles the full lifecycle from raw data to a calculated render frame.
 */
export function loadWhiteboardScene(
  design: SystemDesign,
  layout: NodeLayout[],
  config: WhiteboardConfig = DEFAULT_WHITEBOARD_CONFIG
): WhiteboardFrame {
  console.log('[WhiteboardService] loadWhiteboardScene called with design:', design);
  console.log('[WhiteboardService] loadWhiteboardScene called with layout:', layout);
  try {
    validateDesign(design, layout, config);
    console.log('[WhiteboardService] Design validation passed');

    const frame = calculateWhiteboardFrame(design, layout, config);
    console.log('[WhiteboardService] Calculated frame:', frame);
    return frame;
  } catch (error) {
    console.error("Failed to load whiteboard scene:", error);
    throw error;
  }
}