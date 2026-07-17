import { notFound } from "next/navigation";

import {
  getTranscript,
  getAllTranscripts,
} from "@/content/transcripts";

import TranscriptDetail from "@/features/library/components/TranscriptDetail";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TranscriptPage({
  params,
}: Props) {
  const { slug } = await params;

  const transcript = getTranscript(slug);

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
  return getAllTranscripts().map((transcript) => ({
    slug: transcript.summary.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props) {
  const { slug } = await params;

  const transcript = getTranscript(slug);

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