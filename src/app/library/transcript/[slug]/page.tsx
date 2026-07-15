import { notFound } from "next/navigation";

import { getTranscript } from "@/content/transcripts";

import TranscriptDetail from "@/features/library/components/TranscriptDetail";

type Props = {
  params: {
    slug: string;
  };
};

export default function TranscriptPage({ params }: Props) {
  const transcript = getTranscript(params.slug);

  if (!transcript) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <TranscriptDetail
        transcript={transcript.transcript}
        summary={transcript.summary}
        showBackButton
      />
    </main>
  );
}

export async function generateStaticParams() {
  const { getAllTranscripts } = await import("@/content/transcripts");

  return getAllTranscripts().map((transcript) => ({
    slug: transcript.summary.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const transcript = getTranscript(params.slug);

  if (!transcript) {
    return {
      title: "Transcript Not Found",
    };
  }

  return {
    title: transcript.summary.title,
    description: transcript.summary.description,
  };
}