import { prisma } from "@/shared/prisma/client";

import InterviewCard from "./InterviewCard";

export default async function InterviewCatalog() {
  const problems = await prisma.problem.findMany({
    orderBy: {
      interviewCount: "desc",
    },
  });

  return (
    <section id="interviews" className="py-20">
      <h2 className="text-4xl font-bold">
        Practice Interviews
      </h2>

      <p className="mt-3 text-zinc-400">
        Choose a problem and start practicing.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
          <InterviewCard
            key={problem.id}
            interview={{
              id: problem.id,
              title: problem.title,
              description: problem.description ?? "",
              duration: 45,
              difficulty:
                problem.difficulty === "EASY"
                  ? "Easy"
                  : problem.difficulty === "HARD"
                    ? "Hard"
                    : "Medium",
              category: problem.category,
            }}
          />
        ))}
      </div>
    </section>
  );
}