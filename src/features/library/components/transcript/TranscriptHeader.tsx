// src/features/library/components/transcript/TranscriptHeader.tsx
import Link from "next/link";
import { type TranscriptMetadata } from "../../types/transcript";

type Props = {
  metadata: TranscriptMetadata;
};

export default function TranscriptHeader({ metadata }: Props) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-4">
        <Link 
          href="/library" 
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Library
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600 font-medium">Read Transcript</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {metadata.title}
      </h1>

      {/* Metadata Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide border border-gray-200">
          {metadata.template}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide border border-gray-200">
          {metadata.category}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide border border-gray-200">
          {metadata.difficulty}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide border border-gray-200">
          {metadata.duration} min
        </span>
      </div>
    </div>
  );
}
