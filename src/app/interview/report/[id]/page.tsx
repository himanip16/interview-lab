import { prisma } from "@/shared/prisma/client";
import ConversationCard from "@/src/features/interview/report/components/ConversationCard";
import OverallScoreCard from "@/src/features/interview/report/components/OverallScoreCard";
import WhatHappenedCard from "@/src/features/interview/report/components/WhatHappenedCard";

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

type DimensionScore = {
  dimension: string;
  score: number;
  summary: string;
};

type EvidenceItem = {
  dimension: string;
  timestampSeconds: number;
  quote: string;
  comment: string;
};

export default async function ReportPage({ params }: Props) {
  const { id } = await params;

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

  const dimensionScores =
    (evaluation.dimensionScores as unknown as DimensionScore[]) ?? [];

  const evidence =
    (evaluation.evidence as unknown as EvidenceItem[]) ?? [];

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