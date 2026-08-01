// src/features/landing/components/LandingPage.tsx

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './LandingPage.module.css';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  companies?: any[];
  tags?: string[];
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [stats, setStats] = useState({ interviewsCompleted: 4, readiness: 76, streak: 5, deepDives: 45, transcripts: 12 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const problemsRes = await fetch('/api/problems?limit=2');
      const problemsData = await problemsRes.json();
      if (problemsData.problems) {
        setProblems(problemsData.problems);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async (problemId: string) => {
    try {
      const res = await fetch('/api/interviews/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'hld',
          difficulty: 'MEDIUM',
          duration: 45,
          company: 'General',
          problemId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Failed to start interview: ${data.error}`);
        return;
      }

      if (data.id) {
        router.push(`/interview/live/${data.id}`);
      }
    } catch (err) {
      console.error('Network error starting interview:', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          interview<span>.</span>lab
        </Link>
        <div className={styles.navlinks}>
          <Link href="/learn">Learn</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <div className={styles.navRight}>
          <div className={styles.switch} onClick={toggleTheme}>
            <svg
              className={`${styles.ic} ${styles.sun}`}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg
              className={`${styles.ic} ${styles.moon}`}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <div className={styles.thumb}></div>
          </div>
          <Link href="/register" className={styles.ctaPill}>
            Start free
          </Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>{getGreeting()}</div>
          <h1>Ready to practice?</h1>
          <p>
            Continue where you left off or start something new.
          </p>
          <div className={styles.heroActions}>
            <Link href="/interview-setup" className={styles.btnPrimary}>
              Start an interview
            </Link>
            <Link href="/deep-dive" className={styles.btnGhost}>
              Browse deep dives
            </Link>
          </div>
        </div>
        <div className={styles.mascotWrap}>
          <div className={styles.quickActions}>
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 11l9-8 9 8M5 10v10h14V10" />
                </svg>
              </div>
              <div className={styles.actionContent}>
                <div className={styles.actionTitle}>Continue Learning</div>
                <div className={styles.actionSubtitle}>System Design Basics</div>
              </div>
            </div>
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className={styles.actionContent}>
                <div className={styles.actionTitle}>Daily Challenge</div>
                <div className={styles.actionSubtitle}>Load Balancing</div>
              </div>
            </div>
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
                </svg>
              </div>
              <div className={styles.actionContent}>
                <div className={styles.actionTitle}>Recent Transcript</div>
                <div className={styles.actionSubtitle}>Distributed Systems</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.statbar}>
        <div className={styles.stat}>
          <div className={styles.n}>{stats.interviewsCompleted}</div>
          <div className={styles.k}>Interviews completed</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.n}>{stats.readiness}%</div>
          <div className={styles.k}>Readiness score</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.n}>{stats.streak}</div>
          <div className={styles.k}>Day streak</div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.secLabel}>A taste of what&apos;s inside</div>
        <div className={styles.modeRow}>
          <Link href="/interview-setup" className={`${styles.modeCard} ${styles.m1}`}>
            <h4>Live interview</h4>
            <div className={styles.m}>45 min</div>
          </Link>
          <Link href="/bug-hunting" className={`${styles.modeCard} ${styles.m2}`}>
            <h4>Review a PR</h4>
            <div className={styles.m}>30 min</div>
          </Link>
          <Link href="/learn/whiteboard" className={`${styles.modeCard} ${styles.m3}`}>
            <h4>Whiteboarding</h4>
            <div className={styles.m}>Guided</div>
          </Link>
          <Link href="/deep-dive" className={`${styles.modeCard} ${styles.m4}`}>
            <h4>Deep dives</h4>
            <div className={styles.m}>Topic-based</div>
          </Link>
        </div>

        <div className={styles.proof}>
          <div className={styles.secLabel} style={{ marginBottom: '12px' }}>
            Not just a number
          </div>
          <div className={styles.proofLine}>
            &quot;I&apos;d first{' '}
            <span className={`${styles.ev} ${styles.strength}`}>
              separate payment state from event delivery
            </span>
            , using an{' '}
            <span className={`${styles.ev} ${styles.strength}`}>
              outbox table in the same transaction
            </span>{' '}
            &mdash; though I didn&apos;t consider{' '}
            <span className={`${styles.ev} ${styles.weakness}`}>
              what happens if the relay itself falls behind
            </span>
            .&quot;
          </div>
          <div className={styles.proofScore}>
            <div className={styles.sc}>82</div>
            <div className={styles.sl}>Overall score</div>
          </div>
        </div>

        <div className={styles.secLabel} style={{ marginTop: '36px' }}>
          Problem library
        </div>
        {loading ? (
          <div className={styles.row}>
            <div className={styles.rowMain}>
              <h3>Loading problems...</h3>
            </div>
          </div>
        ) : (
          <>
            {problems.slice(0, 2).map((problem, index) => (
              <div 
                key={problem.id} 
                className={styles.row}
                onClick={() => startInterview(problem.id)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className={styles.bar}
                  style={{ background: index === 0 ? 'var(--primitive-violet)' : 'var(--primitive-coral)' }}
                ></div>
                <div className={styles.rowMain}>
                  <h3>{problem.title}</h3>
                  <div className={styles.rc}>
                    {problem.category} {problem.tags?.join(', ')}
                  </div>
                </div>
                <span
                  className={styles.diff}
                  style={{
                    background:
                      problem.difficulty === 'Easy'
                        ? 'rgba(0, 168, 126, 0.12)'
                        : problem.difficulty === 'Medium'
                        ? 'rgba(232, 148, 10, 0.12)'
                        : 'rgba(255, 90, 60, 0.12)',
                    color:
                      problem.difficulty === 'Easy'
                        ? 'var(--mint-deep)'
                        : problem.difficulty === 'Medium'
                        ? 'var(--primitive-amber)'
                        : 'var(--primitive-coral)',
                  }}
                >
                  {problem.difficulty}
                </span>
                <div className={styles.check}>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Link href="/problems" className={styles.btnGhost} style={{ fontSize: '14px' }}>
                See more →
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
