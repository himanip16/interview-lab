import { SystemDesign, NodeLayout, WhiteboardFrame, DEFAULT_CONFIG } from "../types/whiteboard";
import { validateDesignIntegrity } from "../utils/validation";
import { calculateWhiteboardFrame } from "../utils/layoutEngine";

/**
 * Production Scene Loader
 * Handles the full lifecycle from raw data to a calculcated render frame.
 */
export function loadWhiteboardScene(
  design: SystemDesign, 
  layout: NodeLayout[],
  config = DEFAULT_CONFIG
): WhiteboardFrame {
  try {
    // 1. Validate
    validateDesignIntegrity(design, layout);

    // 2. Project Layout
    return calculateWhiteboardFrame(design, layout, config);
  } catch (error) {
    // In production, log to Sentry/NewRelic here
    console.error("Failed to load whiteboard scene:", error);
    throw error;
  }
}