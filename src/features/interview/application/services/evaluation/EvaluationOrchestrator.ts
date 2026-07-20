import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/prisma/client";
import logger from "@/shared/logger/logger";
import { AIService } from "@/shared/ai";
import { EvaluationService } from "./EvaluationService";
import { PromptLoader } from "../../../prompts/prompt/PromptLoader";

// Type alias for the enum - will be resolved after IDE refresh
type EvaluationStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

/**
 * EvaluationOrchestrator ensures idempotent evaluation by using atomic state transitions.
 * 
 * State machine: PENDING → RUNNING → COMPLETED/FAILED
 * 
 * Only the request that successfully transitions PENDING → RUNNING is allowed to perform
 * the evaluation. Any concurrent request sees RUNNING or COMPLETED and exits immediately.
 * 
 * This prevents duplicate LLM calls, duplicate evidence, and inconsistent results.
 */
export class EvaluationOrchestrator {
  /**
   * Request evaluation for an interview. Idempotent - safe to call multiple times.
   * 
   * @param interviewId - The interview to evaluate
   * @param options - Optional configuration
   * @returns The evaluation if it was created/completed by this call, null if already running/completed
   */
  async requestEvaluation(
    interviewId: string,
    options: { background?: boolean } = {}
  ): Promise<{ evaluationId: string | null; status: EvaluationStatus }> {
    // Attempt atomic transition: PENDING → RUNNING
    const evaluation = await prisma.evaluation.findUnique({
      where: { interviewId },
    });

    if (!evaluation) {
      // No evaluation exists yet, create it in PENDING state
      await prisma.evaluation.create({
        data: {
          interviewId,
          status: "PENDING",
          overallScore: 0,
          dimensionScores: [] as Prisma.InputJsonValue,
          evidence: [] as Prisma.InputJsonValue,
          feedback: "",
        } as any,
      });
    } else if ((evaluation.status as any) === "RUNNING") {
      // Already running - another request is handling it
      logger.info(`Evaluation already running for interview ${interviewId}, skipping`);
      return { evaluationId: evaluation.id, status: "RUNNING" };
    } else if ((evaluation.status as any) === "COMPLETED") {
      // Already completed - no need to evaluate again
      logger.info(`Evaluation already completed for interview ${interviewId}, skipping`);
      return { evaluationId: evaluation.id, status: "COMPLETED" };
    } else if ((evaluation.status as any) === "FAILED") {
      // Previous evaluation failed - allow retry by transitioning PENDING → RUNNING
      logger.info(`Retrying failed evaluation for interview ${interviewId}`);
    }

    // Attempt atomic transition to RUNNING
    const updated = await prisma.evaluation.updateMany({
      where: {
        interviewId,
        status: { in: ["PENDING", "FAILED"] } as any,
      },
      data: {
        status: "RUNNING",
      } as any,
    });

    // If no rows were updated, another request won the race
    if (updated.count === 0) {
      const current = await prisma.evaluation.findUnique({
        where: { interviewId },
      });
      if (!current) {
        throw new Error(`Evaluation for interview ${interviewId} disappeared`);
      }
      logger.info(`Lost race to start evaluation for interview ${interviewId}, status: ${(current as any).status}`);
      return { evaluationId: current.id, status: (current as any).status as EvaluationStatus };
    }

    // We won the race - perform the evaluation
    const evaluationService = new EvaluationService(
      new AIService(),
      new PromptLoader(),
      logger
    );

    if (options.background) {
      // Run in background without blocking
      this.runEvaluationInBackground(interviewId, evaluationService);
      const current = await prisma.evaluation.findUnique({
        where: { interviewId },
      });
      return { evaluationId: current?.id || null, status: "RUNNING" };
    } else {
      // Run synchronously
      try {
        const result = await evaluationService.evaluateInterview(interviewId);
        return { evaluationId: result.id, status: "COMPLETED" };
      } catch (error) {
        // Mark as FAILED so retries are possible
        await prisma.evaluation.update({
          where: { interviewId },
          data: { status: "FAILED" } as any,
        });
        throw error;
      }
    }
  }

  private async runEvaluationInBackground(
    interviewId: string,
    evaluationService: EvaluationService
  ): Promise<void> {
    evaluationService
      .evaluateInterview(interviewId)
      .then(() => {
        logger.info(`Background evaluation completed for interview ${interviewId}`);
      })
      .catch((error: Error) => {
        logger.error(`Background evaluation failed for interview ${interviewId}`, { error });
        // Mark as FAILED so retries are possible
        prisma.evaluation
          .update({
            where: { interviewId },
            data: { status: "FAILED" } as any,
          })
          .catch((updateError: Error) => {
            logger.error(`Failed to mark evaluation as FAILED for interview ${interviewId}`, { error: updateError });
          });
      });
  }
}
