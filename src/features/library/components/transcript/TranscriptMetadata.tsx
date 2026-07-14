// src/features/library/components/transcript/TranscriptMetadata.tsx
import { Difficulty } from "@prisma/client";

type Props = {
  title: string;
  difficulty: Difficulty;
  duration: number;
  template: string;
};

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EASY: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HARD: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function TranscriptMetadata({
  title,
  difficulty,
  duration,
  template,
}: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide border border-gray-200">
          {template}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${
            DIFFICULTY_STYLES[difficulty]
          }`}
        >
          {difficulty}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide border border-gray-200">
          {duration} min
        </span>
      </div>
    </div>
  );
}
