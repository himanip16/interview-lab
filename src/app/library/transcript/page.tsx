"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Bubble } from '@/components/ui/Bubble';
import { cn } from '@/lib/utils';

interface Evidence {
  id: string;
  type: 'strength' | 'weakness';
  text: string;
  annotation: string;
  tag: string;
  category: string;
}

const EVIDENCE: Evidence[] = [
  {
    id: 'e1',
    type: 'strength',
    text: 'separate payment state from event delivery',
    annotation: 'Correctly identifies that the external side effect and our system\'s awareness of it are two different failure surfaces — this is the crux of the whole problem.',
    tag: 'Strength · Architecture',
    category: 'Architecture'
  },
  {
    id: 'e2',
    type: 'weakness',
    text: 'Kafka because Kafka guarantees message delivery and makes the system eventually consistent',
    annotation: 'Names a technology instead of the mechanism. The actual gap — what happens between the DB commit and the publish — is never addressed here.',
    tag: 'Gap · Consistency',
    category: 'Consistency'
  },
  {
    id: 'e3',
    type: 'strength',
    text: 'outbox table in the same transaction as the payment record, then have a relay process publish from that table',
    annotation: 'Takes the follow-up seriously and lands on the actual pattern (transactional outbox) instead of repeating the earlier hand-wave.',
    tag: 'Strength · Recovers well',
    category: 'Recovers well'
  }
];

export default function TranscriptPage() {
  const router = useRouter();
  const [openAnnotations, setOpenAnnotations] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleAnnotation = (id: string) => {
    const newSet = new Set(openAnnotations);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setOpenAnnotations(newSet);
  };

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / h) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Progress Bar */}
      <div className="sticky top-0 h-[3px] bg-[rgba(21,22,28,0.06)] z-10">
        <div 
          className="h-full bg-[var(--mint-deep)] transition-all duration-100 linear"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-[680px] mx-auto p-[36px_24px_90px]">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Library', href: '/library' },
            { label: 'Read a transcript', active: true }
          ]}
          onBack={() => router.back()}
          className="mb-4.5"
        />

        {/* Header */}
        <div className="mb-2">
          <h1 className="heading-l font-bold">Design a Payment System</h1>
          <div className="flex items-center gap-2 flex-wrap mt-2.5">
            <div className="caption font-semibold p-[5px_12px] radius-pill bg-[var(--paper)] text-[var(--ink-400)] border border-[var(--border)]">
              HLD
            </div>
            <div className="caption font-semibold p-[5px_12px] radius-pill bg-[var(--paper)] text-[var(--ink-400)] border border-[var(--border)]">
              Hard
            </div>
            <div className="caption font-semibold p-[5px_12px] radius-pill bg-[var(--paper)] text-[var(--ink-400)] border border-[var(--border)]">
              45 min
            </div>
            <div className="caption font-semibold p-[5px_12px] radius-pill bg-[var(--paper)] text-[var(--ink-400)] border border-[var(--border)]">
              Scored 82
            </div>
          </div>
          <div className="flex items-center gap-1.75 body-s text-[var(--mint-deep)] font-semibold mt-4 p-[10px_14px] radius-card bg-[rgba(0,217,163,0.08)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            This is a full past session. Just read — nothing to answer.
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-5.5 mb-2 caption text-[var(--ink-400)]">
          <span className="flex items-center gap-1.5">
            <span className="w-[18px] h-2 radius-small" style={{ background: 'rgba(0,217,163,0.35)' }} />
            Strong moment
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-[18px] h-2 radius-small" style={{ background: 'rgba(255,90,60,0.28)' }} />
            Missed something
          </span>
          <span className="text-[var(--ink-400)] opacity-80">tap a highlight to see why</span>
        </div>

        {/* Conversation */}
        <div className="flex flex-col gap-5.5 mt-5">
          <div className="flex flex-col gap-1.25 max-w-[88%] self-start">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Interviewer</div>
            <Bubble variant="received" className="p-[15px_18px] radius-bubble border-b-l-radius-[6px]">
              Let's say the payment succeeded, but our order service never received the event. What happens?
            </Bubble>
          </div>

          <div className="flex flex-col gap-1.25 max-w-[88%] self-end items-end">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Candidate</div>
            <Bubble variant="sent" className="p-[15px_18px] radius-bubble border-b-r-radius-[6px]">
              I wouldn't retry the payment itself. I'd first{' '}
              <span 
                className={cn(
                  'radius-small p-0 2px cursor-pointer box-decoration-break-clone -webkit-box-decoration-break-clone',
                  'bg-[rgba(0,217,163,0.22)] border-b-2 border-[var(--mint-deep)]'
                )}
                onClick={() => toggleAnnotation('e1')}
              >
                separate payment state from event delivery
              </span>
              .
            </Bubble>
          </div>
          
          {openAnnotations.has('e1') && (
            <div className="max-w-[88%] self-end mt-[-8px] overflow-hidden max-h-[120px] opacity-100 mt-0.5 transition-all duration-300 ease">
              <div className="p-[11px_15px] radius-card leading-relaxed bg-[rgba(0,217,163,0.08)] text-[var(--mint-deep)] body-s">
                <span className="font-bold uppercase tracking-[0.05em] text-[9.5px] mr-1.5">{EVIDENCE[0].tag}</span>
                {EVIDENCE[0].annotation}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.25 max-w-[88%] self-start">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Interviewer</div>
            <Bubble variant="received" className="p-[15px_18px] radius-bubble border-b-l-radius-[6px]">
              Why?
            </Bubble>
          </div>

          <div className="flex flex-col gap-1.25 max-w-[88%] self-end items-end">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Candidate</div>
            <Bubble variant="sent" className="p-[15px_18px] radius-bubble border-b-r-radius-[6px]">
              Because the external side effect may already have happened. My uncertainty is whether our system observed it — not whether the charge occurred.
            </Bubble>
          </div>

          {/* Takeaway */}
          <div className="m-2 1 p-[20px_22px] radius-card bg-gradient-to-br from-white to-[var(--paper)] border-l-3 border-[var(--mint-deep)]">
            <div className="label text-[var(--mint-deep)] mb-1.5">Takeaway</div>
            <p className="body-s italic text-[var(--ink)] leading-relaxed">
              "Separate payment state from event delivery; use the outbox pattern with idempotent consumers."
            </p>
          </div>

          <div className="flex flex-col gap-1.25 max-w-[88%] self-start">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Interviewer</div>
            <Bubble variant="received" className="p-[15px_18px] radius-bubble border-b-l-radius-[6px]">
              The client times out and retries the same payment request. What could go wrong?
            </Bubble>
          </div>

          <div className="flex flex-col gap-1.25 max-w-[88%] self-end items-end">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Candidate</div>
            <Bubble variant="sent" className="p-[15px_18px] radius-bubble border-b-r-radius-[6px]">
              If we're not careful, we'd charge the customer twice — the retry looks like a brand new request unless we can recognize it as the same one.
            </Bubble>
          </div>

          <div className="flex flex-col gap-1.25 max-w-[88%] self-start">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Interviewer</div>
            <Bubble variant="received" className="p-[15px_18px] radius-bubble border-b-l-radius-[6px]">
              The database write succeeds. The service crashes before publishing to Kafka. How do you maintain consistency between services?
            </Bubble>
          </div>

          <div className="flex flex-col gap-1.25 max-w-[88%] self-end items-end">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Candidate</div>
            <Bubble variant="sent" className="p-[15px_18px] radius-bubble border-b-r-radius-[6px]">
              I'd use{' '}
              <span 
                className={cn(
                  'radius-small p-0 2px cursor-pointer box-decoration-break-clone -webkit-box-decoration-break-clone',
                  'bg-[rgba(255,90,60,0.16)] border-b-2 border-[var(--coral)]'
                )}
                onClick={() => toggleAnnotation('e2')}
              >
                Kafka because Kafka guarantees message delivery and makes the system eventually consistent
              </span>
              .
            </Bubble>
          </div>

          {openAnnotations.has('e2') && (
            <div className="max-w-[88%] self-end mt-[-8px] overflow-hidden max-h-[120px] opacity-100 mt-0.5 transition-all duration-300 ease">
              <div className="p-[11px_15px] radius-card leading-relaxed bg-[rgba(255,90,60,0.08)] text-[#C9432B] body-s">
                <span className="font-bold uppercase tracking-[0.05em] text-[9.5px] mr-1.5">{EVIDENCE[1].tag}</span>
                {EVIDENCE[1].annotation}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.25 max-w-[88%] self-start">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Interviewer</div>
            <Bubble variant="received" className="p-[15px_18px] radius-bubble border-b-l-radius-[6px]">
              Right, but what happens in that specific gap — between the write succeeding and the event actually going out?
            </Bubble>
          </div>

          <div className="flex flex-col gap-1.25 max-w-[88%] self-end items-end">
            <div className="caption font-semibold text-[var(--ink-400)] p-0 3px">Candidate</div>
            <Bubble variant="sent" className="p-[15px_18px] radius-bubble border-b-r-radius-[6px]">
              Good point. I'd write the event to an{' '}
              <span 
                className={cn(
                  'radius-small p-0 2px cursor-pointer box-decoration-break-clone -webkit-box-decoration-break-clone',
                  'bg-[rgba(0,217,163,0.22)] border-b-2 border-[var(--mint-deep)]'
                )}
                onClick={() => toggleAnnotation('e3')}
              >
                outbox table in the same transaction as the payment record, then have a relay process publish from that table
              </span>
              {' '}— so a crash before publishing just means the relay catches up later, nothing is lost.
            </Bubble>
          </div>

          {openAnnotations.has('e3') && (
            <div className="max-w-[88%] self-end mt-[-8px] overflow-hidden max-h-[120px] opacity-100 mt-0.5 transition-all duration-300 ease">
              <div className="p-[11px_15px] radius-card leading-relaxed bg-[rgba(0,217,163,0.08)] text-[var(--mint-deep)] body-s">
                <span className="font-bold uppercase tracking-[0.05em] text-[9.5px] mr-1.5">{EVIDENCE[2].tag}</span>
                {EVIDENCE[2].annotation}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-9 p-[26px] radius-card bg-[var(--ink)] text-white">
          <h3 className="body-s font-semibold mb-3.5">How this session went</h3>
          <div className="flex gap-3.5">
            <div className="flex-1 p-3.5 radius-card bg-[rgba(255,255,255,0.06)]">
              <div className="caption font-bold uppercase tracking-[0.05em] text-[var(--mint)] mb-1.5">Strength</div>
              <p className="caption text-white/70 leading-relaxed">
                Recovered well after being pushed — found the outbox pattern once challenged on the vague answer.
              </p>
            </div>
            <div className="flex-1 p-3.5 radius-card bg-[rgba(255,255,255,0.06)]">
              <div className="caption font-bold uppercase tracking-[0.05em] text-[#FF8A6E] mb-1.5">To work on</div>
              <p className="caption text-white/70 leading-relaxed">
                First instinct was to name a technology rather than explain the mechanism. Worth practicing leading with the "why."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
