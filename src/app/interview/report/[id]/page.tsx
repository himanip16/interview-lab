import { prisma } from "src/shared/prisma/client";
import ScoreCard from "@/src/components/interview/report/ScoreCard";
import FeedbackCard from "@/src/components/interview/report/FeedbackCard";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type EvaluationMetadata = {
  strengths?: string[];
  weaknesses?: string[];
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

  const metadata =
    (evaluation.metadata as EvaluationMetadata | null) ?? {};

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">
        Interview Performance Report
      </h1>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <ScoreCard score={evaluation.score} />

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-bold">Expert Feedback</h3>

          <p className="leading-relaxed text-slate-600">
            {evaluation.feedback}
          </p>
        </div>
      </div>

      <FeedbackCard
        strengths={metadata.strengths ?? []}
        weaknesses={metadata.weaknesses ?? []}
      />
    </div>
  );
}