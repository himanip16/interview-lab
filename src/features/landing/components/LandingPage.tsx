// src/features/landing/components/LandingPage.tsx

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
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
  const carouselRef = useRef<HTMLDivElement>(null);
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

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const CAROUSEL_CARDS = [
    {
      id: 1,
      title: 'Bug hunting',
      meta: 'Practice · 15 min',
      gradient: 'linear-gradient(160deg,#FF6B4A,#E0432A)',
      href: '/bug-hunting',
      icon: (
        <svg viewBox="0 0 84 84" fill="none">
          <circle cx="42" cy="42" r="40" fill="#fff"/>
          <ellipse cx="42" cy="46" rx="14" ry="10" fill="#FF6B4A"/>
          <circle cx="35" cy="42" r="3" fill="#26282F"/>
          <circle cx="49" cy="42" r="3" fill="#26282F"/>
          <path d="M28 34 Q22 26 16 30" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M56 34 Q62 26 68 30" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Review a PR',
      meta: 'Practice · 30 min',
      gradient: 'linear-gradient(160deg,#3E6BFF,#213FCC)',
      href: '/pr-review',
      icon: (
        <svg viewBox="0 0 84 84" fill="none">
          <circle cx="42" cy="42" r="40" fill="#fff"/>
          <rect x="26" y="24" width="32" height="36" rx="4" fill="#3E6BFF"/>
          <path d="M32 44l6 6 12-14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Read a transcript',
      meta: 'Library · Full session',
      gradient: 'linear-gradient(160deg,#262832,#121319)',
      href: '/learn/transcripts',
      icon: (
        <svg viewBox="0 0 84 84" fill="none">
          <circle cx="42" cy="42" r="40" fill="#fff"/>
          <path d="M26 30h32v6H26z" fill="#262832"/>
          <path d="M26 42h24v5H26z" fill="#262832" opacity="0.7"/>
          <path d="M26 52h28v5H26z" fill="#262832" opacity="0.45"/>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Learn whiteboarding',
      meta: 'Learn · Guided',
      gradient: 'linear-gradient(160deg,#00E0AB,#00A87E)',
      href: '/learn/whiteboard',
      icon: (
        <svg viewBox="0 0 84 84" fill="none">
          <circle cx="42" cy="42" r="40" fill="#fff"/>
          <rect x="24" y="28" width="36" height="26" rx="3" fill="#00A87E"/>
          <path d="M30 40h10M30 46h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="24" y="58" width="36" height="4" rx="2" fill="#00A87E" opacity="0.4"/>
        </svg>
      )
    },
    {
      id: 5,
      title: 'Live interview with AI',
      meta: 'Live · 45 min',
      gradient: 'linear-gradient(160deg,#FFB930,#E8940A)',
      href: '/interview-setup',
      icon: (
        <svg viewBox="0 0 84 84" fill="none">
          <circle cx="42" cy="42" r="40" fill="#fff"/>
          <rect x="35" y="24" width="14" height="24" rx="7" fill="#E8940A"/>
          <path d="M28 40a14 14 0 0028 0" stroke="#E8940A" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <line x1="42" y1="54" x2="42" y2="60" stroke="#E8940A" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 6,
      title: 'Deep dives',
      meta: 'Learn · Topic-based',
      gradient: 'linear-gradient(160deg,#7A6BFF,#4C3FD6)',
      href: '/deep-dive',
      icon: (
        <svg viewBox="0 0 84 84" fill="none">
          <circle cx="42" cy="42" r="40" fill="#fff"/>
          <circle cx="42" cy="42" r="6" fill="#4C3FD6"/>
          <circle cx="42" cy="42" r="13" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity="0.55"/>
          <circle cx="42" cy="42" r="20" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity="0.3"/>
        </svg>
      )
    },
  ];

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
          <div className={styles.eyebrow}>Learn system design through real Staff Engineer conversations</div>
          <h1>Not textbooks. Real conversations.</h1>
          <p>
            Master system design through realistic engineering discussions—not static questions and solutions. Experience how Staff Engineers actually think and solve problems.
          </p>
          <div className={styles.heroActions}>
            <Link href="/interview-setup" className={styles.btnPrimary}>
              Start an interview
            </Link>
            <Link href="/learn" className={styles.btnGhost}>
              Explore content
            </Link>
          </div>
        </div>
        <div className={styles.mascotWrap}>
          <div className={styles.featureGrid}>
            <Link href="/interview-setup" className={`${styles.featureTile} ${styles.accentBlue}`}>
              <span className={styles.tileIcon}>🎤</span>
              <span className={styles.tileLabel}>AI Interview</span>
            </Link>
            <Link href="/bug-hunting" className={`${styles.featureTile} ${styles.accentRed}`}>
              <span className={styles.tileIcon}>🐞</span>
              <span className={styles.tileLabel}>Bug Hunt</span>
            </Link>
            <Link href="/deep-dive" className={`${styles.featureTile} ${styles.accentGreen}`}>
              <span className={styles.tileIcon}>📖</span>
              <span className={styles.tileLabel}>Deep Dive</span>
            </Link>
            <Link href="/learn/whiteboard" className={`${styles.featureTile} ${styles.accentCyan}`}>
              <span className={styles.tileIcon}>🧠</span>
              <span className={styles.tileLabel}>Whiteboard</span>
            </Link>
            <Link href="/pr-review" className={`${styles.featureTile} ${styles.accentOrange}`}>
              <span className={styles.tileIcon}>🔍</span>
              <span className={styles.tileLabel}>PR Review</span>
            </Link>
            <Link href="/learn/transcripts" className={`${styles.featureTile} ${styles.accentPurple}`}>
              <span className={styles.tileIcon}>💬</span>
              <span className={styles.tileLabel}>Conversations</span>
            </Link>
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
        <div className={styles.secLabel}>Explore Interview Lab</div>
        
        {/* Carousel */}
        <div className={styles.carouselWrap}>
          <div
            ref={carouselRef}
            className={styles.carouselRail}
          >
            {CAROUSEL_CARDS.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className={styles.carouselCard}
                style={{ background: card.gradient }}
              >
                <div className={styles.carouselIcon}>
                  {card.icon}
                </div>
                <h3 className={styles.carouselTitle}>{card.title}</h3>
                <div className={styles.carouselMeta}>
                  <span className={styles.carouselDot} />
                  {card.meta}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Carousel Navigation */}
          <div className={styles.carouselNav}>
            <button
              onClick={() => scrollCarousel('left')}
              className={styles.carouselBtn}
            >
              ← Prev
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className={`${styles.carouselBtn} ${styles.carouselBtnPrimary}`}
            >
              →
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.secLabel}>Recently Added</div>
          <div className={styles.contentRow}>
            <Link href="/pr-review" className={styles.contentCard}>
              <div className={styles.contentBadge}>PR Review</div>
              <h4>Optimize Notification Service</h4>
              <p>Review performance improvements</p>
            </Link>
            <Link href="/bug-hunting" className={styles.contentCard}>
              <div className={styles.contentBadge}>Bug Hunt</div>
              <h4>Memory Leak in Kafka Consumer</h4>
              <p>Debug production incident</p>
            </Link>
            <Link href="/deep-dive" className={styles.contentCard}>
              <div className={styles.contentBadge}>Deep Dive</div>
              <h4>How Redis Replication Works</h4>
              <p>Deep dive into caching</p>
            </Link>
            <Link href="/learn/transcripts" className={styles.contentCard}>
              <div className={styles.contentBadge}>Conversation</div>
              <h4>Staff Engineer explains CAP theorem</h4>
              <p>Real engineering discussion</p>
            </Link>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.todayLabel}>
            Today's Learning
            <span className={styles.todayTotal}>50 min</span>
          </div>
          <div className={styles.todayLearning}>
            <Link href="/bug-hunting" className={styles.todayItem}>
              <div className={styles.todayCheck}>✓</div>
              <div className={styles.todayTime}>15 min</div>
              <div className={styles.todayContent}>
                <div className={styles.todayTitle}>Bug Hunt</div>
              </div>
            </Link>
            <Link href="/interview-setup" className={styles.todayItem}>
              <div className={styles.todayCheck}>✓</div>
              <div className={styles.todayTime}>25 min</div>
              <div className={styles.todayContent}>
                <div className={styles.todayTitle}>System Design</div>
              </div>
            </Link>
            <Link href="/pr-review" className={styles.todayItem}>
              <div className={styles.todayCheck}>✓</div>
              <div className={styles.todayTime}>10 min</div>
              <div className={styles.todayContent}>
                <div className={styles.todayTitle}>PR Review</div>
              </div>
            </Link>
          </div>
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
