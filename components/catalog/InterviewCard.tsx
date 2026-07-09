import { Interview } from "@/types/interview";
import Link from "next/link";
type Props = {
  interview: Interview;
};

export default function InterviewCard({
  interview,
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500">

      <h3 className="text-xl font-semibold">
        {interview.title}
      </h3>

      <p className="mt-2 text-sm text-zinc-400">
        {interview.description}
      </p>

      <div className="mt-6 flex items-center justify-between">

        <span className="text-sm text-zinc-500">
          {interview.duration} min • {interview.difficulty}
        </span>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500">
            <Link
    href={`/interview/new?type=${interview.id}`}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
>
    Start →
</Link>
        
        </button>

      </div>

    </div>
  );
}