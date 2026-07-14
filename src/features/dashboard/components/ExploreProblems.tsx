// src/features/dashboard/components/ExploreProblems.tsx
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import type { Difficulty } from "@prisma/client";

export type ExploreProblem = {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string | null;
};

type Props = {
  exploreProblems: ExploreProblem[];
};

export default function ExploreProblems({ exploreProblems }: Props) {
  return (
    <div className="mt-12 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            04. Explore
          </span>
          <Heading level="h3" className="mt-1">
            More problems to try
          </Heading>
        </div>

        <Link
          href="/#interviews"
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          Browse all →
        </Link>
      </div>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 pt-1">
        {exploreProblems.map((problem) => (
          <Link
            key={problem.id}
            href={`/interview/setup?problemId=${problem.id}&type=${problem.slug}`}
            className="flex h-[140px] w-64 flex-shrink-0 flex-col justify-between rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40"
          >
            <div>
              <span className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">
                {problem.difficulty}
              </span>
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                {problem.title}
              </h3>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-2 text-[10px] font-mono text-muted-foreground">
              <span className="line-clamp-1">
                {problem.description ?? "System Design"}
              </span>
              <span className="flex-shrink-0 text-foreground">Start →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
