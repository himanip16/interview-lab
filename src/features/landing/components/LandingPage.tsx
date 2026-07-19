'use client';

import Link from 'next/link';
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
  const [stats, setStats] = useState({ modes: 7, problems: 0, dimensions: 6 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch problems
      const problemsRes = await fetch('/api/problems?limit=2');
      const problemsData = await problemsRes.json();
      if (problemsData.problems) {
        setProblems(problemsData.problems);
        setStats(prev => ({ ...prev, problems: problemsData.total || 50 }));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
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
          <Link href="/problems">Problems</Link>
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
          <div className={styles.eyebrow}>Practice like top tech companies</div>
          <h1>Interviews that actually prepare you.</h1>
          <p>
            An AI interviewer that adapts to what you say, evidence-backed feedback
            instead of a vague score.
          </p>
          <div className={styles.heroActions}>
            <Link href="/interview/live" className={styles.btnPrimary}>
              Start an interview
            </Link>
            <Link href="/learn" className={styles.btnGhost}>
              See how it works
            </Link>
          </div>
        </div>
        <div className={styles.mascotWrap}>
          <svg className={styles.mascot} viewBox="0 0 200 260" fill="none">
            <circle cx="100" cy="60" r="38" fill="#F4E4D4" />
            <path d="M62 56a38 38 0 0176 0v6H62z" fill="var(--text)" />
            <circle cx="86" cy="62" r="4" fill="var(--text)" />
            <circle cx="114" cy="62" r="4" fill="var(--text)" />
            <path
              d="M88 76q12 8 24 0"
              stroke="var(--text)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M60 108q40-22 80 0v70q-40 16-80 0z" fill="#00D9A3" />
            <rect x="80" y="130" width="40" height="30" rx="4" fill="var(--surface)" />
            <path
              d="M86 142h28M86 150h20"
              stroke="#00A87E"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect x="70" y="212" width="24" height="34" rx="10" fill="var(--text)" />
            <rect x="106" y="212" width="24" height="34" rx="10" fill="var(--text)" />
          </svg>
        </div>
      </section>

      <div className={styles.statbar}>
        <div className={styles.stat}>
          <div className={styles.n}>{stats.modes}</div>
          <div className={styles.k}>Practice modes</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.n}>{loading ? '...' : stats.problems + '+'}</div>
          <div className={styles.k}>Problems</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.n}>{stats.dimensions}</div>
          <div className={styles.k}>Dimensions scored</div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.secLabel}>A taste of what&apos;s inside</div>
        <div className={styles.modeRow}>
          <Link href="/interview/live" className={`${styles.modeCard} ${styles.m1}`}>
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
          problems.slice(0, 2).map((problem, index) => (
            <Link key={problem.id} href={`/problems`} className={styles.row}>
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
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
