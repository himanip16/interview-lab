// src/app/learn/transcript/[slug]/page.tsx

"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TranscriptReader } from "@/features/library/components/transcript-detail/TranscriptReader";

export default function TranscriptDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTranscript() {
      try {
        const response = await fetch("/api/transcripts");
        const data = await response.json();
        const found = data.find((t: any) => t.slug === slug);
        setTranscript(found || null);
      } catch (error) {
        console.error("Error fetching transcript:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchTranscript();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[15px] sm:text-[16px]" style={{ color: "#5A5B66" }}>
        Loading transcript...
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center" style={{ color: "#5A5B66" }}>
        <div className="text-[17px] sm:text-[18px] font-semibold">Transcript not found</div>
      </div>
    );
  }

  return (
    <div
      style={{ background: "#EAE7DF" }}
      className="min-h-[calc(100dvh-64px)] pb-24 sm:h-[calc(100dvh-64px)] sm:overflow-hidden sm:pb-0"
    >
      <div className="mx-auto h-full max-w-[900px] p-2 sm:p-4">
        <TranscriptReader
          title={transcript.title}
          company={transcript.company}
          difficulty={transcript.difficulty}
          duration={transcript.duration}
          transcript={transcript.transcript}
        />
      </div>
    </div>
  );
}