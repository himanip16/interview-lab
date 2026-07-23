// src/features/deep-dive/components/ProgressBar.tsx

"use client";

import { useEffect, useState } from 'react';

export function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: `${scrollProgress}%` }} />
    </div>
  );
}
