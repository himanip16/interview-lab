'use client';

import { LiveInterview } from '@/features/interview/live/components/LiveInterview';
export default async function LiveInterviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return <LiveInterview sessionId={sessionId} />;
}