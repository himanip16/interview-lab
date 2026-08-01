// src/features/landing/components/LandingPage.tsx

'use client';

import Link from 'next/link';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          interview<span>.</span>lab
        </div>
        <div className={styles.navLinks}>
          <Link href="/learn">Learn</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <div className={styles.navRight}>
          <Link href="/login" className={styles.signin}>Sign in</Link>
          <Link href="/register" className={styles.btnDark}>Start free</Link>
        </div>
      </nav>

      <div className={styles.hero}>
        <div className={`${styles.glow} ${styles.glow1}`}></div>
        <div className={`${styles.glow} ${styles.glow2}`}></div>
        <div className={`${styles.glow} ${styles.glow3}`}></div>

        <div className={styles.pill}>
          ✓ Learn from real Staff Engineer conversations
        </div>

        <h1>
          Interview prep that sounds like a{' '}
          <span className={styles.gradCoral}>Staff</span>{' '}
          <span className={styles.gradViolet}>Engineer</span>, not a textbook.
        </h1>

        <p>
          Deep dives, unedited transcripts, and adaptive AI mock interviews — built from how engineers actually explain trade-offs and solve problems.
        </p>

        <div className={styles.heroActions}>
          <Link href="/interview-setup" className={styles.btnPrimary}>
            Start practicing free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </Link>
          <Link href="/learn" className={styles.btnOutline}>
            Explore deep dives
          </Link>
        </div>

        {/* PREVIEW SHELF */}
        <div className={styles.shelf}>
          <div className={`${styles.win} ${styles.left}`}>
            <div className={styles.winBar}>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <span className={styles.winUrl}>kafka-consumer-groups.dev</span>
            </div>
            <div className={styles.winBody}>
              <div className={styles.winKicker} style={{ color: 'var(--violet)' }}>Deep dive</div>
              <div className={styles.winTitle}>Kafka Consumer Groups</div>
              <div className={styles.miniDiagram}>
                <div className={styles.mnode} style={{ background: 'var(--violet)', top: '12px', left: '14px' }}></div>
                <div className={styles.mnode} style={{ background: 'var(--mint-deep)', top: '44px', left: '60px' }}></div>
                <div className={styles.mnode} style={{ background: 'var(--coral)', top: '12px', right: '14px' }}></div>
                <div className={styles.mline} style={{ width: '52px', top: '22px', left: '44px', transform: 'rotate(18deg)' }}></div>
                <div className={styles.mline} style={{ width: '52px', top: '22px', right: '44px', transform: 'rotate(-18deg)' }}></div>
              </div>
              <div className={styles.stars}>★★★★★</div>
              <div className={styles.winMeta} style={{ marginTop: '4px' }}>45 min read</div>
              <div className={styles.tags}>
                <span className={styles.tag}>Interactive diagrams</span>
                <span className={styles.tag}>Production examples</span>
              </div>
            </div>
          </div>

          <div className={`${styles.win} ${styles.center}`}>
            <div className={styles.winBar}>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <span className={styles.winUrl}>transcript · google-l5.log</span>
            </div>
            <div className={styles.winBody}>
              <div className={styles.winKicker} style={{ color: 'var(--mint-deep)' }}>Transcript</div>
              <div className={styles.winTitle}>Google L5 · System Design</div>
              <div style={{ margin: '12px 0' }}>
                <div className={styles.tLine}>Interviewer: How would you handle a hot partition?</div>
                <div className={styles.tLine}>
                  Candidate: I'd <span className={styles.tHl}>split the key space with a random suffix</span> to spread writes — the tradeoff is <span className={styles.tHl2}>reads now need to fan out</span> across all suffixes.
                </div>
              </div>
              <div className={styles.winMeta}>67 min · Annotated</div>
              <div className={styles.tags}>
                <span className={styles.tag}>Evidence-highlighted</span>
                <span className={styles.tag}>Full session</span>
              </div>
            </div>
          </div>

          <div className={`${styles.win} ${styles.right}`}>
            <div className={styles.winBar}>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <div className={styles.winDot} style={{ background: '#E5E1D6' }}></div>
              <span className={styles.winUrl}>session.live</span>
            </div>
            <div className={styles.winBody}>
              <div className={styles.winKicker} style={{ color: 'var(--coral)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={styles.liveDot}></span>
                AI interview
              </div>
              <div className={styles.winTitle}>Amazon · Coding</div>
              <div style={{ margin: '12px 0' }}>
                <div className={styles.cBubble} style={{ background: 'var(--paper)', borderBottomLeftRadius: '3px' }}>
                  What's the time complexity of your approach, and can we do better?
                </div>
                <div className={styles.cBubble} style={{ background: 'var(--ink)', color: '#fff', marginLeft: 'auto', borderBottomRightRadius: '3px' }}>
                  O(n log n) from the sort — I think we can drop to O(n) with a hash map instead.
                </div>
              </div>
              <div className={styles.winMeta}>Adaptive follow-up questions</div>
              <div className={styles.tags}>
                <span className={styles.tag}>Real-time</span>
                <span className={styles.tag}>45 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* CREDIBILITY STATS */}
        <div className={styles.statStrip}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>800+</div>
            <div className={styles.statLabel}>Interview questions</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>120</div>
            <div className={styles.statLabel}>Deep dives</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>65</div>
            <div className={styles.statLabel}>Companies covered</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>2,000+</div>
            <div className={styles.statLabel}>Transcript pages</div>
          </div>
        </div>

        <div className={styles.trusted}>
          <div className={styles.trustedLabel}>Interview patterns sourced from</div>
          <div className={styles.brandRow}>
            <span>Google</span>
            <span>Uber</span>
            <span>Meta</span>
            <span>Amazon</span>
            <span>Stripe</span>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        interview.lab · Practice like it's real.
      </footer>
    </div>
  );
}
