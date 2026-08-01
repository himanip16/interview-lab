// src/features/library/components/transcript/TranscriptHeader.tsx
import Link from "next/link";
import { type TranscriptMetadata } from "../../types/transcript";
import { Difficulty } from "@prisma/client";

type Props = {
  metadata: TranscriptMetadata;
};

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EASY: "bg-green-50 text-green-700 border-green-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HARD: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function TranscriptHeader({ metadata }: Props) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-3">
        <Link 
          href="/library" 
          className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          Library
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 font-medium">Read Transcript</span>
      </nav>

      {/* Title with inline metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {metadata.title}
        </h1>
        
        {/* Compact metadata chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
            DIFFICULTY_STYLES[metadata.difficulty]
          }`}>
            {metadata.difficulty}
          </span>
          <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200">
            {metadata.company || metadata.template}
          </span>
          <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200">
            ⏱ {metadata.duration} min
          </span>
        </div>
      </div>
    </div>
  );
}
