"use client";

import { useRouter } from "next/navigation";
import { Panel } from "@/components/ui/Panel";
import { Search } from "@/components/ui/Search";
import { useProblems } from "@/features/problems/hooks/useProblems";
import { useProblemFilters } from "@/features/problems/hooks/useProblemFilters";
import { filterByStatus, filterBySearch } from "@/features/problems/utils/filterProblems";
import ProblemFilters from "@/features/problems/components/ProblemFilters";
import ProblemList from "@/features/problems/components/ProblemList";

export default function ProblemsPage({ userId }: { userId: string | null }) {
  const router = useRouter();
  const { filters, setFilters } = useProblemFilters();
  const { problems, totalPages, loading, error, refetch } = useProblems(filters, userId);

  const visible = filterBySearch(filterByStatus(problems, filters.status), filters.search);

  return (
    <div className="min-h-screen bg-[var(--paper)] py-10 px-6">
      <Panel variant="default" className="max-w-[960px] mx-auto p-[32px_36px_40px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-m text-[var(--ink)]">Problem library</h2>
          <Search placeholder="Search problems..." className="w-[220px]" onSearch={(search) => setFilters({ search })} />
        </div>

        <ProblemFilters filters={filters} onChange={setFilters} count={visible.length} />

        <ProblemList
          problems={visible}
          loading={loading}
          error={error}
          onRetry={refetch}
          onSelect={async (problemId) => {
            try {
              const res = await fetch("/api/interviews/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: filters.type === "all" ? "hld" : filters.type,
                  difficulty: filters.difficulty === "ALL" ? "MEDIUM" : filters.difficulty,
                  duration: 45,
                  company: "General",
                  problemId,
                }),
              });

              const data = await res.json();

              if (!res.ok) {
                alert(`Failed to start interview: ${data.error}`);
                return;
              }

              if (data.id) {
                router.push(`/interview/live/${data.id}`);
              } else {
                console.error("No ID returned from API", data);
              }
            } catch (err) {
              console.error("Network error starting interview:", err);
            }
          }}
        />
      </Panel>
    </div>
  );
}