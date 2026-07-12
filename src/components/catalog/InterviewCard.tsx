import Link from "next/link";

import { Interview } from "@/src/features/interview/types/interview";

type Props = {
  interview: Interview;
};

export default function InterviewCard({
  interview,
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-400">
      <h3 className="text-xl font-semibold text-zinc-900">
        {interview.title}
      </h3>

      <p className="mt-2 text-sm text-zinc-600">
        {interview.description}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          {interview.duration} min •{" "}
          {interview.difficulty}
        </span>

        <Link
          href={`/interview/setup?problemId=${interview.id}&type=hld`}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Start →
        </Link>
      </div>
    </div>
  );
}