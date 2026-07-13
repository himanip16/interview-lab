"use client";

import Navbar from "@/src/components/layout/Navbar";
import PageContainer from "@/src/components/layout/PageContainer";
import ProblemInventoryView from "@/src/features/interview/setup/components/ProblemInventoryView";

export default function ProblemsPage() {
  return (
    <PageContainer>
      <Navbar />

      <section className="py-20">
        <h1 className="text-4xl font-bold">
          Problem Library
        </h1>

        <p className="mt-3 text-zinc-400">
          Browse and select from our collection of interview problems.
        </p>

        <div className="mt-10">
          <ProblemInventoryView onSelectProblem={(problemId) => {
            window.location.href = `/interview/setup?problemId=${problemId}`;
          }} />
        </div>
      </section>
    </PageContainer>
  );
}
