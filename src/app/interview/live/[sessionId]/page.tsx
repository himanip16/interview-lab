'use client';

import { use } from "react";
import { LiveInterview } from '@/features/interview/live/components/LiveInterview';

export default function LiveInterviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);

  // CHANGE: Pass 'interviewId' instead of 'sessionId' to match the component's expected props
  return <LiveInterview interviewId={sessionId} />;
}