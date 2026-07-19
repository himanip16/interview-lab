"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Timeline } from '@/components/layout/Timeline';
import { Sidebar } from '@/components/layout/Sidebar';
import { Bubble } from '@/components/ui/Bubble';
import { Timer } from '@/components/ui/Timer';
import { Stepper } from '@/components/ui/Stepper';
import { Panel } from '@/components/ui/Panel';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  isTyping?: boolean;
}

const INITIAL_STEPS = [
  { id: 'intro', label: 'Intro', status: 'done' as const },
  { id: 'requirements', label: 'Requirements', status: 'active' as const },
  { id: 'high-level', label: 'High-level design', status: 'upcoming' as const },
  { id: 'deep-dive', label: 'Deep dive', status: 'upcoming' as const },
  { id: 'scalability', label: 'Scalability', status: 'upcoming' as const },
  { id: 'closing', label: 'Closing', status: 'upcoming' as const },
];

export default function LiveInterviewPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Welcome! Today we\'ll design a URL shortener. Start by asking clarifying questions before you propose anything.' },
    { id: '2', role: 'user', content: 'Sure — what\'s the expected read to write ratio, and do we need custom aliases?' },
    { id: '3', role: 'ai', content: 'Good question. Assume reads outnumber writes heavily, maybe 100 to 1. Custom aliases are a nice-to-have, not required for v1.' },
    { id: '4', role: 'user', content: 'Got it. Given that read-heavy pattern, I\'d lean toward a key-value store with a cache in front rather than a relational database.' },
    { id: '5', role: 'ai', content: '', isTyping: true },
  ]);
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(28 * 60 + 14); // 28:14 in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages(prev => [
        ...prev.filter(m => !m.isTyping),
        { id: Date.now().toString(), role: 'user', content: inputValue },
        { id: (Date.now() + 1).toString(), role: 'ai', content: '', isTyping: true }
      ]);
      setInputValue('');

      // Simulate AI response after delay
      setTimeout(() => {
        setMessages(prev => [
          ...prev.filter(m => !m.isTyping),
          { id: Date.now().toString(), role: 'ai', content: 'Reasonable. How would you generate the short code itself, and how do you avoid collisions?' }
        ]);
      }, 1600);
    }
  };

  const handleStepChange = (stepId: string) => {
    setSteps(prev => prev.map(step => ({
      ...step,
      status: step.id === stepId ? 'active' : 
             prev.findIndex(s => s.id === stepId) < prev.findIndex(s => s.id === step.id) ? 'done' : 'upcoming'
    })));
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] py-10 px-6">
      <Panel variant="default" className="max-w-[1080px] mx-auto radius-panel overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-[22px_30px] border-b border-[var(--border)]">
          <Breadcrumb
            items={[
              { label: 'Live interview', href: '/interview' },
              { label: 'Design a URL shortener', active: true }
            ]}
            onBack={() => router.back()}
          />
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 caption font-semibold text-[var(--coral)] p-[6px_13px] radius-pill bg-[rgba(255,90,60,0.1)]">
              <span className="w-1.5 h-1.5 radius-full bg-[var(--coral)] animate-pulse" />
              Live
            </div>
            <div className="relative w-[58px] h-[58px]">
              <div className="absolute inset-[-10px] radius-full bg-[radial-gradient(circle,rgba(0,217,163,0.28),transparent_70%)] animate-breathe" />
              <div className="absolute inset-0 radius-full bg-[var(--ink)] flex items-center justify-center flex-col border-[1.5px] border-[rgba(0,217,163,0.4)]">
                <div className="heading-s font-semibold text-[var(--mint)]">{formatTime(timeLeft)}</div>
                <div className="caption text-white/50 tracking-[0.05em] mt-0.25">LEFT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Stepper */}
        <div className="p-[16px_30px] border-b border-[var(--border)] overflow-x-auto">
          <Timeline
            steps={steps}
            onStepChange={handleStepChange}
          />
        </div>

        {/* Body */}
        <div className="flex h-[520px]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-[26px_30px] flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-col gap-1 max-w-[70%]',
                    message.role === 'ai' ? 'self-start' : 'self-end items-end'
                  )}
                >
                  <div className="caption font-semibold text-[var(--ink-400)] p-0 4px">
                    {message.role === 'ai' ? 'Interviewer' : 'Candidate'}
                  </div>
                  {message.isTyping ? (
                    <div className="flex gap-1 p-[13px_16px] radius-card bg-[var(--bubble)] border-b-l-radius-[4px]">
                      <span className="w-1.5 h-1.5 radius-full bg-[var(--ink-400)] animate-tbounce" />
                      <span className="w-1.5 h-1.5 radius-full bg-[var(--ink-400)] animate-tbounce" style={{ animationDelay: '0.15s' }} />
                      <span className="w-1.5 h-1.5 radius-full bg-[var(--ink-400)] animate-tbounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  ) : (
                    <Bubble
                      variant={message.role === 'ai' ? 'received' : 'sent'}
                      className="p-[13px_16px] radius-bubble"
                    >
                      {message.content}
                    </Bubble>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2.5 p-[18px_24px] border-t border-[var(--border)]">
              <button className="w-[42px] h-[42px] radius-pill border border-[var(--border)] bg-none text-[var(--ink-400)] flex items-center justify-center cursor-pointer flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0014 0M12 19v3"/>
                </svg>
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Explain your design…"
                className="flex-1 border border-[var(--border)] radius-pill p-[12px_18px] body-s outline-none focus:border-[var(--mint-deep)]"
              />
              <button
                onClick={handleSendMessage}
                className="w-[42px] h-[42px] radius-pill border-none bg-[var(--mint-deep)] text-white flex items-center justify-center cursor-pointer flex-shrink-0 transition-transform duration-200 ease hover:scale-[1.06]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar width={260} className="p-[24px_22px]">
            <div className="label text-[var(--mint-deep)] mb-2.5">Current phase</div>
            <div className="inline-block body-s font-semibold bg-[var(--ink)] text-white p-[5px_13px] radius-pill mb-5.5">
              Requirements
            </div>

            <div className="label text-[var(--mint-deep)] mb-2.5">Design summary</div>
            <div className="body-s text-[var(--ink-400)] leading-relaxed pl-3.5 relative mb-2.5">
              <div className="absolute left-0 top-1.5 w-1.5 h-1.5 radius-full bg-[var(--mint)]" />
              Read-heavy workload assumed, ~100:1 read/write ratio.
            </div>
            <div className="body-s text-[var(--ink-400)] leading-relaxed pl-3.5 relative mb-2.5">
              <div className="absolute left-0 top-1.5 w-1.5 h-1.5 radius-full bg-[var(--mint)]" />
              Custom aliases scoped out of v1.
            </div>
            <div className="body-s text-[var(--ink-400)] leading-relaxed pl-3.5 relative mb-2.5">
              <div className="absolute left-0 top-1.5 w-1.5 h-1.5 radius-full bg-[var(--mint)]" />
              Candidate is leaning key-value store + cache over relational.
            </div>
            <div className="body-s text-[var(--ink-400)] leading-relaxed pl-3.5 relative">
              <div className="absolute left-0 top-1.5 w-1.5 h-1.5 radius-full bg-[var(--mint)]" />
              Not yet discussed: uniqueness strategy for short codes.
            </div>
          </Sidebar>
        </div>
      </Panel>
    </div>
  );
}
