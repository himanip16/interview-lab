// src/features/interview/report/components/EvidenceTimeline.tsx

interface EvidenceItem {
  dimension: string;
  timestampSeconds: number;
  quote: string;
  comment: string;
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

type Props = {
  evidence: EvidenceItem[];
};

export default function EvidenceTimeline({ evidence }: Props) {
  const sorted = [...evidence].sort(
    (a, b) => a.timestampSeconds - b.timestampSeconds
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold">
          Evidence Timeline
        </h2>
        <p className="text-slate-500">
          No evidence was captured for this interview.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        Evidence Timeline
      </h2>

      <ol className="space-y-5 border-l-2 border-slate-200 pl-5">
        {sorted.map((item, index) => (
          <li key={index} className="relative">
            <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500" />

            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wide text-slate-400">
              <span>{formatTimestamp(item.timestampSeconds)}</span>
              <span>·</span>
              <span>{item.dimension.replace(/_/g, " ")}</span>
            </div>

            <p className="mt-1 text-sm italic leading-relaxed text-slate-700">
              &ldquo;{item.quote}&rdquo;
            </p>

            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {item.comment}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}