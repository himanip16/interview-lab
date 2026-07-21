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
  try {
    validateDesign(design, layout, config);

    return calculateWhiteboardFrame(design, layout, config);
  } catch (error) {
    console.error("Failed to load whiteboard scene:", error);
    throw error;
  }
}