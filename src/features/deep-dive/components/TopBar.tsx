// src/features/deep-dive/components/TopBar.tsx

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  bold?: boolean;
}

interface TopBarProps {
  breadcrumbs: BreadcrumbItem[];
  searchPlaceholder?: string;
  xp?: number;
  showThemeToggle?: boolean;
  loginText?: string;
  rightContent?: ReactNode;
  className?: string;
}

export function TopBar({
  breadcrumbs,
  searchPlaceholder = 'Search...',
  xp,
  showThemeToggle = true,
  loginText = 'Log in',
  rightContent,
  className = '',
}: TopBarProps) {
  const router = useRouter();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setIsDarkTheme(initialTheme === 'dark');
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <div className={`topbar ${className}`}>
      <div className="crumb">
        <button className="back" onClick={handleBack} aria-label="Go back">
          ←
        </button>
        {breadcrumbs.map((item, index) => (
          <span key={index}>
            {index > 0 && ' / '}
            {item.bold ? <b>{item.label}</b> : item.label}
          </span>
        ))}
      </div>
      <div className="top-right">
        <div className="search-mini">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          {searchPlaceholder}
        </div>
        {xp !== undefined && (
          <div className="xp-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
            </svg>
            {xp} XP
          </div>
        )}
        {showThemeToggle && (
          <div
            className={`theme-switch ${isDarkTheme ? 'dark' : ''}`}
            onClick={handleThemeToggle}
            role="button"
            tabIndex={0}
            aria-label="Toggle theme"
          >
            <div className="thumb" />
          </div>
        )}
        <span className="login-link">
          {loginText}
        </span>
        {rightContent}
      </div>
    </div>
  );
}
