"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/shared/layout/Breadcrumb';
import TranscriptCatalog from '@/features/library/components/TranscriptCatalog';

export default function TranscriptListPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="max-w-[1440px] mx-auto p-[36px_24px_90px]">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Library', href: '/library' },
            { label: 'Browse Transcripts', active: true }
          ]}
          onBack={() => router.push('/learn')}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-10">
          <h1 className="heading-l font-bold text-[var(--ink)]">Browse Transcripts</h1>
          <p className="body-m text-[var(--ink-400)] mt-2">
            Study real interview sessions from top companies. Learn how experienced engineers gather requirements, communicate trade-offs, and design scalable systems.
          </p>
        </div>

        {/* This component automatically fetches from src/content/transcripts/index.ts */}
        <TranscriptCatalog />
      </div>
    </div>
  );
}
