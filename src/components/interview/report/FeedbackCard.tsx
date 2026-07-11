interface FeedbackCardProps {
  strengths: string[];
  weaknesses: string[];
}

export default function FeedbackCard({
  strengths,
  weaknesses,
}: FeedbackCardProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-green-600">
          Strengths
        </h2>

        {strengths.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            {strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">
            No strengths were identified.
          </p>
        )}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-red-600">
          Areas for Improvement
        </h2>

        {weaknesses.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            {weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">
            No improvement areas were identified.
          </p>
        )}
      </div>
    </div>
  );
}