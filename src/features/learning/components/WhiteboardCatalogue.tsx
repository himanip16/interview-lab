"use client";

import { WHITEBOARD_SYSTEMS } from "../data/whiteboardSystems";
import Link from "next/link";

export default function WhiteboardCatalogue() {
  const systems = Object.values(WHITEBOARD_SYSTEMS);

  return (
    <>
      <style jsx global>{`
        :root {
          --paper: #FAF9F6;
          --ink: #15161C;
          --ink-soft: #5A5B66;
          --mint: #00D9A3;
          --mint-deep: #00A87E;
          --coral: #FF5A3C;
          --violet: #6A5AE0;
          --amber: #E8940A;
        }
      `}</style>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          color: '#15161C',
          background: '#FAF9F6',
          minHeight: '100vh',
          padding: '0 24px 80px',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '30px 0',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '30px',
                fontSize: '13.5px',
                color: '#5A5B66',
                fontWeight: 500,
              }}
            >
              <span>About Learn</span>
              <span style={{ color: '#15161C', fontWeight: 600, borderBottom: '2px solid #15161C', paddingBottom: '2px' }}>
                Whiteboarding
              </span>
              <span>Deep Dives</span>
              <span>Library</span>
            </div>
            <button
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(21,22,28,0.14)',
                background: 'none',
                color: '#15161C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 7h16M4 12h16M4 17h16"/>
              </svg>
            </button>
          </nav>

          {/* Header */}
          <div style={{ padding: '20px 0 30px' }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '.1em',
                color: '#00A87E',
              }}
            >
              LEARN WHITEBOARDING
            </div>
            <h1
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '38px',
                fontWeight: 800,
                marginTop: '10px',
                maxWidth: '520px',
                letterSpacing: '-0.02em',
              }}
            >
              Pick a system to explore
            </h1>
            <p
              style={{
                fontSize: '14.5px',
                color: '#5A5B66',
                marginTop: '12px',
                maxWidth: '460px',
                lineHeight: 1.6,
              }}
            >
              Click into any component to see its role, who calls it, what it fails to, and how it stays resilient — or walk through a real user flow step by step.
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {systems.map((system) => (
              <Link
                key={system.slug}
                href={`/learn/whiteboard/${system.slug}`}
                style={{
                  background: '#fff',
                  borderRadius: '22px',
                  padding: '22px',
                  border: '1px solid rgba(21,22,28,0.07)',
                  cursor: 'pointer',
                  transition: 'transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(21,22,28,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg
                  style={{ width: '64px', height: '64px', marginBottom: '14px' }}
                  viewBox="0 0 64 64"
                  fill="none"
                  dangerouslySetInnerHTML={{ __html: system.mark }}
                />
                <h3
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {system.title}
                </h3>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: '#5A5B66',
                    marginTop: '6px',
                    lineHeight: 1.55,
                    minHeight: '38px',
                  }}
                >
                  {system.oneLiner}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(21,22,28,0.06)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: '#FAF9F6',
                      color: '#5A5B66',
                      textTransform: 'uppercase',
                    }}
                  >
                    HLD
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#5A5B66',
                    }}
                  >
                    {system.comps} components · {system.flows} flows
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
