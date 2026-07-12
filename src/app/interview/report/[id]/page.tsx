import { prisma } from "@/shared/prisma/client";
import ScoreCard from "@/src/features/interview/report/components/ScoreCard";
import FeedbackCard from "@/src/features/interview/report/components/FeedbackCard";
import EvidenceTimeline from "@/src/features/interview/report/components/EvidenceTimeline";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type EvaluationMetadata = {
  strengths?: string[];
  weaknesses?: string[];
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
      <div className="p-20 text-center">
        Generating your detailed feedback... Please refresh in a moment.
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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">
        Interview Performance Report
      </h1>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <ScoreCard score={evaluation.overallScore} />

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-bold">Expert Feedback</h3>

          <p className="leading-relaxed text-slate-600">
            {evaluation.feedback}
          </p>
        </div>
      </div>

      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dimensionScores.map((dimension) => (
          <ScoreCard
            key={dimension.dimension}
            score={Math.round(dimension.score * 10)}
            label={dimension.dimension.replace(/_/g, " ")}
          />
        ))}
      </div>

      <div className="mb-12">
        <EvidenceTimeline evidence={evidence} />
      </div>

      <FeedbackCard
        strengths={metadata.strengths ?? []}
        weaknesses={metadata.weaknesses ?? []}
      />
    </div>
  );
}