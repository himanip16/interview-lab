"use client";

import { Difficulty, ProblemCategory } from "@prisma/client";
import type { Problem } from "./problemSchema";
import { cn } from "@/lib/utils";

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
  EASY: "text-[#00A87E] bg-[rgba(0,168,126,0.1)]",
  MEDIUM: "text-[#E8940A] bg-[rgba(232,148,10,0.1)]",
  HARD: "text-[#FF5A3C] bg-[rgba(255,90,60,0.1)]",
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
        "group flex items-center gap-4 p-4 rounded-[18px] border cursor-pointer transition-all duration-[0.25s] ease-out",
        "border-[rgba(21,22,28,0.07)] bg-white",
        "hover:translate-y-[-3px] hover:shadow-[0_14px_30px_rgba(21,22,28,0.07)]",
        isSelected && "border-[rgba(21,22,28,0.15)] shadow-[0_14px_30px_rgba(21,22,28,0.07)]"
      )}
      onClick={onClick}
    >
      <div className="w-[5px] self-stretch rounded-[3px] flex-shrink-0 bg-[#6A5AE0]" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[14.5px] font-semibold text-[#15161C] leading-tight">
            {problem.title}
          </h3>
          <span className="text-[10px] font-bold tracking-[0.03em] px-2 py-0.5 rounded-[6px] text-white uppercase bg-[#6A5AE0]">
            {CATEGORY_LABELS[problem.category].split(' ')[0]}
          </span>
        </div>
        <p className="text-[12.5px] text-[#5A5B66] mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {problem.cruxOfProblem}
        </p>
      </div>

      <div className="flex items-center gap-3.5 flex-shrink-0">
        <span className={cn(
          "text-[11px] font-semibold px-2.5 py-1 rounded-[999px]",
          DIFFICULTY_STYLES[problem.difficulty]
        )}>
          {problem.difficulty.toLowerCase()}
        </span>
        <span className="text-[12px] text-[#5A5B66] w-12 text-right">
          {problem.estimatedMinutes}m
        </span>
        <div className={cn(
          "w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0",
          problem.completionHistory?.completed 
            ? "bg-[#00A87E] text-white" 
            : "border-[1.5px] border-[rgba(21,22,28,0.15)]"
        )}>
          {problem.completionHistory?.completed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5L20 7"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}