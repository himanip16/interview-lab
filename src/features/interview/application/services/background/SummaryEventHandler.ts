import { DomainEvent, TurnCompletedEventData, PhaseTransitionEventData, InterviewCompletedEventData } from "@/features/interview/domain/InterviewAggregate";
import { InterviewRepository } from "@/features/interview/infrastructure/repositories/InterviewRepository";
import { SessionContext } from "@/features/interview/application/context/SessionContext";
import { InterviewProfileService } from "@/features/interview/data/profiles/InterviewProfileService";
import { AIService } from "@/shared/ai";

/**
 * SummaryEventHandler
 * 
 * Handles adaptive summary refresh triggered by:
 * - Phase changes (always refresh to capture conclusion of previous phase)
 * - Token thresholds (if transcript exceeds ~2000 tokens)
 * - Interview end (final summary for report page)
 * 
 * Replaces the "Every 10 turns" rule with adaptive triggers
 */
export class SummaryEventHandler {
  private readonly repository = new InterviewRepository();
  private readonly profileService = new InterviewProfileService();
  private readonly ai = new AIService();
  
  private static readonly TOKEN_THRESHOLD = 2000; // Approximate tokens

  async handleTurnCompleted(event: DomainEvent): Promise<void> {
    const data = event.data as TurnCompletedEventData;
    
    // Only update summary on phase transitions or completion
    if (!data.transitioned && !data.completed) {
      return;
    }

    await this.refreshSummary(event.aggregateId);
  }

  async handlePhaseTransition(event: DomainEvent): Promise<void> {
    // Always refresh on phase transition to capture conclusion
    await this.refreshSummary(event.aggregateId);
  }

  async handleInterviewCompleted(event: DomainEvent): Promise<void> {
    // Final summary for report page
    await this.refreshSummary(event.aggregateId, true);
  }

  private async refreshSummary(interviewId: string, isFinal = false): Promise<void> {
    try {
      // Load session context with full transcript
      const context = await SessionContext.forBackground({
        interviewId,
        repository: this.repository,
        profileService: this.profileService,
      });

      const fullTranscript = await context.getFullTranscript(this.repository);
      if (!fullTranscript) {
        console.warn(`[SummaryEventHandler] No transcript found for interview ${interviewId}`);
        return;
      }

      // Check token threshold
      const estimatedTokens = this.estimateTokens(fullTranscript);
      if (!isFinal && estimatedTokens < SummaryEventHandler.TOKEN_THRESHOLD) {
        // Skip refresh if under threshold and not final
        return;
      }

      // Generate new summary
      const newSummary = await this.generateSummary(fullTranscript, context.summary);

      // Update aggregate and persist
      context.interviewAggregate.updateSummary(newSummary);
      const payload = context.interviewAggregate.toPersistence();

      await this.repository.updateSummary(interviewId, newSummary);
      
      console.log(`[SummaryEventHandler] Summary refreshed for interview ${interviewId} (${estimatedTokens} tokens)`);
    } catch (error) {
      console.error(`[SummaryEventHandler] Failed to refresh summary for interview ${interviewId}:`, error);
      // Don't throw - this is non-critical work
    }
  }

  private async generateSummary(
    transcript: Array<{ role: string; content: string }>,
    previousSummary: string
  ): Promise<string> {
    const transcriptText = transcript
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const prompt = this.isFinalSummary(previousSummary)
      ? `
Generate a final comprehensive summary of this interview.

Previous Summary:
${previousSummary}

Full Transcript:
${transcriptText}

Create a detailed summary that captures:
- All architectural decisions and trade-offs discussed
- Candidate's strengths and weaknesses across all phases
- Key technical concepts covered
- Overall performance assessment

Keep under 500 words. Return plain text only.
`
      : `
Update the interview summary with new information.

Previous Summary:
${previousSummary}

New Conversation:
${transcriptText}

Update the summary by incorporating only the new information.

Requirements:
- Keep under 250 words
- Preserve important architectural decisions
- Preserve candidate strengths and weaknesses
- Remove redundant details
- Return plain text only
`;

    return this.ai.chat(
      [
        {
          role: "system",
          content: "You are an expert technical interviewer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      { task: "summary" }
    );
  }

  private estimateTokens(transcript: Array<{ role: string; content: string }>): number {
    // Rough estimate: ~4 characters per token
    const totalChars = transcript.reduce((sum, msg) => sum + msg.content.length, 0);
    return Math.floor(totalChars / 4);
  }

  private isFinalSummary(summary: string): boolean {
    return summary.includes("Interview has not started yet");
  }
}
