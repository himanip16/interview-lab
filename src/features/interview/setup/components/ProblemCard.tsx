"use client";

import { Difficulty, ProblemCategory } from "@prisma/client";
import { Button } from "@/src/components/ui/Button";
import type { Problem } from "./problemSchema";
import { cn } from "@/src/lib/utils";
import { ChevronRight, Clock, CheckCircle2 } from "lucide-react";

const CATEGORY_LABELS: Record<ProblemCategory, string> = {
  SYSTEM_DESIGN: "System Design",
  LOW_LEVEL_DESIGN: "Low Level Design",
  DATABASES: "Databases",
  BACKEND: "Backend",
  DISTRIBUTED_SYSTEMS: "Distributed Systems",
  JAVA: "Java",
  KAFKA: "Kafka",
  REDIS: "Redis",
  OPERATING_SYSTEMS: "Operating Systems",
  NETWORKING: "Networking",
};

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EASY: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  MEDIUM: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  HARD: "text-rose-400 border-red-500/20 bg-red-500/5",
};

type Props = {
  problem: Problem;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
  onSelect: () => void;
};

export default function ProblemCard({
  problem,
  isSelected,
  isExpanded,
  onClick,
  onSelect,
}: Props) {
  return (
    <div
      className={cn(
        "group rounded-xl border transition-all duration-300 overflow-hidden",
        isSelected
          ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20"
          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80"
      )}
    >
      <button
        onClick={onClick}
        className="w-full p-5 text-left outline-none transition-transform active:scale-[0.99]"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold tracking-tight text-zinc-100">
                {problem.title}
              </h3>
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider",
                  DIFFICULTY_STYLES[problem.difficulty]
                )}
              >
                {problem.difficulty}
              </span>
              {isSelected && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary text-white font-bold uppercase tracking-wider">
                  Selected
                </span>
              )}
            </div>
            
            <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
              {problem.cruxOfProblem}
            </p>

            {problem.tags && problem.tags.length > 0 && (
              <div className="flex gap-2 pt-1">
                {problem.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] text-zinc-500 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Clock size={14} />
                <span className="text-xs font-mono">{problem.estimatedMinutes}m</span>
              </div>
              <ChevronRight 
                size={18} 
                className={cn(
                  "text-zinc-600 transition-transform duration-300", 
                  isExpanded && "rotate-90 text-zinc-400"
                )} 
              />
            </div>
            
            {problem.completionHistory?.completed && (
              <div className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Completed
                </span>
              </div>
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                Problem Context
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {problem.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                  Category
                </h4>
                <p className="text-sm text-zinc-200 font-medium">
                  {CATEGORY_LABELS[problem.category]}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                  Template
                </h4>
                <p className="text-sm text-zinc-200 font-medium uppercase">
                  {problem.interviewType}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Launch Interview Session
          </Button>
        </div>
      )}
    </div>
  );
}