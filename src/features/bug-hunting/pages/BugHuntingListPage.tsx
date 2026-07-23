// src/features/bug-hunting/pages/BugHuntingListPage.tsx

import { Panel } from "@/shared/ui/Panel";
import { getBugHuntingService } from "@/features/bug-hunting";

export async function BugHuntingListPage() {
  const service = getBugHuntingService();
  const scenarioData = await service.listScenarios();

  return (
    <div className="min-h-screen bg-[var(--paper)] py-12 px-6">
      <Panel variant="default" className="max-w-[1500px] mx-auto p-[36px_40px_44px]">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[var(--ink)] mb-3">
            Bug Hunting
          </h1>
          <p className="text-lg text-[var(--ink-400)]">
            Find production bugs from real backend systems.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {scenarioData.map((scenario) => (
            <a
              key={scenario.id}
              href={`/bug-hunting/${scenario.id}`}
              className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:border-[var(--mint)] hover:shadow-lg transition-all duration-300"
              style={{ minHeight: "240px" }}
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--mint)] transition-colors">
                  {scenario.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                    {scenario.service}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-full">
                    {scenario.severity}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {Math.floor(scenario.timerSeconds / 60)} min
                  </span>
                </div>

                <p className="text-sm text-[var(--ink-400)] leading-relaxed mb-6 flex-1">
                  {scenario.symptom}
                </p>

                <div className="flex items-center justify-end">
                  <span className="text-sm font-semibold text-[var(--mint)] group-hover:translate-x-1 transition-transform">
                    Start →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Panel>
    </div>
  );
}