import { NextResponse } from "next/server";

import { InterviewRepository } from "@/src/modules/interview/repositories/InterviewRepository";
import { SkillGraphService } from "@/src/modules/interview/services/mastery/SkillGraphService";
import logger from "@/src/shared/logger/logger";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json(
        {
          error: "Missing interview id",
        },
        {
          status: 400,
        }
      );
    }

    const repository = new InterviewRepository();

    const interview = await repository.getById(id);

    if (!interview) {
      return NextResponse.json(
        {
          error: "Interview not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!interview.evaluation) {
      return NextResponse.json(
        {
          error: "Evaluation not found",
        },
        {
          status: 404,
        }
      );
    }

    // Fetch per-interview concept scores
    const skillGraphService = new SkillGraphService();
    const conceptMastery = await skillGraphService.getInterviewConceptScores(
      interview.evaluation.id
    );

    // Extract dimension scores from the dynamic dimensionScores JSON
    const dimensionScores = interview.evaluation.dimensionScores as Array<{
      dimension: string;
      score: number;
      summary: string;
      evidence: Array<{
        messageId: string;
        timestampSeconds: number;
        quote: string;
        comment: string;
        type: "strength" | "weakness";
        conceptSlugs: string[];
      }>;
    }> || [];

    // Format helper: convert seconds to "MM:SS" string
    const formatTimestamp = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Transform dimension scores to competency scores (convert 0-10 to 0-5 scale)
    const competencyScores = dimensionScores.map((ds) => ({
      dimension: ds.dimension,
      score: Math.round(ds.score / 2), // Convert 0-10 to 0-5
      summary: ds.summary,
      evidence: ds.evidence.map((ev) => ({
        ...ev,
        timestamp: formatTimestamp(ev.timestampSeconds),
      })),
    }));

    // Extract metadata fields
    const metadata = interview.evaluation.metadata as {
      strengths?: string[];
      weaknesses?: string[];
      missedConcepts?: string[];
      riskAssessment?: string[];
      hireRecommendation?: string;
      studyPlan?: Array<{
        topic: string;
        advice: string;
        resources: string[];
      }>;
    } || {};

    return NextResponse.json(
      {
        id: interview.evaluation.id,
        interviewId: interview.evaluation.interviewId,
        overallScore: interview.evaluation.overallScore,
        dimensionScores: competencyScores,
        feedback: interview.evaluation.feedback,
        metadata: {
          strengths: metadata.strengths || [],
          weaknesses: metadata.weaknesses || [],
          missedConcepts: metadata.missedConcepts || [],
          riskAssessment: metadata.riskAssessment || [],
          hireRecommendation: metadata.hireRecommendation || "NO_HIRE",
          studyPlan: metadata.studyPlan || [],
        },
        conceptMastery,
        createdAt: interview.evaluation.createdAt,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        {
          err: error,
          message: error.message,
          stack: error.stack,
        },
        "Failed to get interview report"
      );
    } else {
      logger.error(
        { error },
        "Failed to get interview report"
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
