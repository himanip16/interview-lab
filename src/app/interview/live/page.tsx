"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/features/interview/components/LiveInterview.module.css';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  isTyping?: boolean;
  requestId?: string;
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
      const requestId = crypto.randomUUID();
      const userMessageId = crypto.randomUUID();
      
      setMessages(prev => [
        ...prev,
        { id: userMessageId, role: 'user', content: inputValue, requestId },
        { id: crypto.randomUUID(), role: 'ai', content: '', isTyping: true, requestId }
      ]);
      setInputValue('');

      // Simulate AI response after delay
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.requestId === requestId && msg.isTyping
              ? { ...msg, id: crypto.randomUUID(), role: 'ai', content: 'Reasonable. How would you generate the short code itself, and how do you avoid collisions?', isTyping: false }
              : msg
          )
        );
      }, 1600);
    }
  };

  const handleStepChange = (stepId: string) => {
    setSteps(prev => prev.map(step => ({
      ...step,
      status: step.id === stepId ? 'active' : 
             prev.findIndex(s => s.id === stepId) < prev.findIndex(s => s.id === stepId) ? 'done' : 'upcoming'
    })));
  };

  return (
    <div style={{ background: 'var(--landing-bg)', padding: '40px 24px', minHeight: '100vh' }}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.head}>
          <div className={styles.crumb}>
            <button className={styles.back} onClick={() => router.back()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M15 6l-6 6 6 6"/>
              </svg>
            </button>
            <div className={styles.crumbText}>
              Live interview &nbsp;/&nbsp; <b>Design a URL shortener</b>
            </div>
          </div>
          <div className={styles.headRight}>
            <div className={styles.liveBadge}>
              <span className={styles.dot}></span>
              Live
            </div>
            <div className={styles.timer}>
              <div className={styles.aura}></div>
              <div className={styles.ring}>
                <div className={styles.t}>{formatTime(timeLeft)}</div>
                <div className={styles.l}>LEFT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Stepper */}
        <div className={styles.stepper}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`${styles.step} ${styles[step.status]}`} onClick={() => handleStepChange(step.id)}>
                <div className={styles.node}></div>
                <span>{step.label}</span>
              </div>
              {index < steps.length - 1 && <div className={styles.stepLine}></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Chat Area */}
          <div className={styles.chat}>
            <div className={styles.messages}>
              {messages.map((message) => (
                <div key={message.id} className={`${styles.msg} ${styles[message.role]}`}>
                  <div className={styles.who}>
                    {message.role === 'ai' ? 'Interviewer' : 'Candidate'}
                  </div>
                  {message.isTyping ? (
                    <div className={styles.typing}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <div className={styles.bubble}>{message.content}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className={styles.inputRow}>
              <button className={styles.micBtn}>
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
                className={styles.field}
              />
              <button onClick={handleSendMessage} className={styles.sendBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sideLabel}>Current phase</div>
            <div className={styles.phasePill}>Requirements</div>

            <div className={styles.sideLabel}>Design summary</div>
            <div className={styles.summaryItem}>Read-heavy workload assumed, ~100:1 read/write ratio.</div>
            <div className={styles.summaryItem}>Custom aliases scoped out of v1.</div>
            <div className={styles.summaryItem}>Candidate is leaning key-value store + cache over relational.</div>
            <div className={styles.summaryItem}>Not yet discussed: uniqueness strategy for short codes.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
