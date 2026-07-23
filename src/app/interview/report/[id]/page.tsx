import { prisma } from "shared/prisma/client";
import ConversationCard from "@/features/interview/report/components/ConversationCard";
import OverallScoreCard from "@/features/interview/report/components/OverallScoreCard";
import WhatHappenedCard from "@/features/interview/report/components/WhatHappenedCard";
import type {
  DimensionScore,
  EvidenceItem,
} from "@/features/interview/domain/evaluation/types";
import {
  mapEvidence,
  mapDimensionScores,
} from "@/features/interview/reporting/mappers/EvaluationMapper";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type EvaluationMetadata = {
  strengths?: string[];
  weaknesses?: string[];
  observations?: Array<{ type: "OBSERVATION" | "ADVISORY"; text: string }>;
};

export default async function ReportPage({ params }: Props) {
  const { id } = await params;

  const interview = await prisma.interview.findUnique({
    where: { id },
    select: { 
      metadata: true, 
      status: true,
      whiteboardState: true,
    },
  });

  // Check if evaluation failed
  const interviewMetadata = interview?.metadata as { evaluationError?: string; evaluationFailedAt?: string } | null;
  if (interviewMetadata?.evaluationError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Evaluation Failed</h2>
          <p className="text-muted-foreground mb-4">
            We encountered an error while generating your feedback. This has been logged and our team will investigate.
          </p>
          <p className="text-sm text-muted-foreground">
            Error: {interviewMetadata.evaluationError}
          </p>
        </div>
      </div>
    );
  }

  const evaluation = await prisma.evaluation.findUnique({
    where: {
      interviewId: id,
    },
  });

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Generating your detailed feedback... Please refresh in a moment.</p>
        </div>
      </div>
    );
  }

  const metadata: EvaluationMetadata =
    (evaluation.metadata as EvaluationMetadata | null) ?? {};

  const dimensionScores = mapDimensionScores(evaluation.dimensionScores);

  const evidence = mapEvidence(evaluation.evidence);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <ConversationCard evidence={evidence} />

        <OverallScoreCard score={evaluation.overallScore} />

        <WhatHappenedCard
          observations={metadata.observations ?? []}
          strengths={metadata.strengths ?? []}
          weaknesses={metadata.weaknesses ?? []}
        />
      </div>
    </div>
  );
}