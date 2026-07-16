
import type { ProcessInterviewMessageResult } from "@/modules/interview/types";
import type { InterviewState } from "@/modules/interview/types";
export class InterviewApiClient {
  private readonly baseUrl = '/api/interviews';

  /**
   * Get current interview state
   * Called once on mount, then only after user actions
   */
  async getInterview(interviewId: string): Promise<InterviewState> {
    const response = await fetch(`${this.baseUrl}/${interviewId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Interview not found');
      }
      throw new Error(`Failed to fetch interview: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Send a message and get the interviewer's response
   * Backend handles:
   * - Phase transitions
   * - Summary updates
   * - Evaluation state
   * - Interview completion
   * 
   * Request body DOES NOT include phase — backend owns that decision
   */
  async sendMessage(interviewId: string, message: string): Promise<ProcessInterviewMessageResult> {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    const response = await fetch(`${this.baseUrl}/${interviewId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim() }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.error || `Failed to send message: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Finish the interview early
   * Backend handles cleanup, evaluation queuing, etc.
   */
  async finishInterview(interviewId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${interviewId}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to finish interview: ${response.statusText}`);
    }
  }

  /**
   * Save whiteboard state
   * Called after each drawing/change
   */
  async saveWhiteboardState(
    interviewId: string,
    whiteboardState: Record<string, any>
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${interviewId}/whiteboard`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whiteboardState }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save whiteboard: ${response.statusText}`);
    }
  }
}

/**
 * Singleton instance — use this throughout the app
 * Alternative: pass via React context if needed
 */
export const interviewApiClient = new InterviewApiClient();