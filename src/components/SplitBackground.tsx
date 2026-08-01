'use client';

import React, { useEffect, useState } from 'react';

export function SplitBackground() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(160deg, #1a1a1a, #222222)'
            : 'linear-gradient(160deg, #F5F3EF, #F0EDE8)',
        }}
      />
      <div
        className="absolute rounded-full blur-[50px]"
        style={{
          width: '260px',
          height: '260px',
          top: '10%',
          left: '8%',
          background: isDark
            ? 'rgba(0, 217, 163, 0.02)'
            : 'rgba(0, 217, 163, 0.06)',
          animation: 'breathe 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-[50px]"
        style={{
          width: '300px',
          height: '300px',
          bottom: '-5%',
          right: '10%',
          background: isDark
            ? 'rgba(255, 90, 60, 0.015)'
            : 'rgba(255, 90, 60, 0.05)',
          animation: 'breathe 8s ease-in-out infinite 1.5s',
        }}
      />
      <style jsx global>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
        }
      `}</style>
    </div>
  );
}
