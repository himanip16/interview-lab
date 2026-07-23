// src/content/deep-dive/illustrations/ModuloIllustration.tsx

export function ModuloIllustration() {
  return (
    <svg viewBox="0 0 160 100" width="100%">
      <rect width="160" height="100" fill="none"/>
      <text x="10" y="16" fontSize="8" fill="var(--text-soft)" fontFamily="Inter">3 servers</text>
      <circle cx="20" cy="40" r="5" fill="#00D9A3"/>
      <circle cx="80" cy="40" r="5" fill="#00A87E"/>
      <circle cx="140" cy="40" r="5" fill="#6A5AE0"/>
      <text x="10" y="66" fontSize="8" fill="var(--coral)" fontFamily="Inter">+1 server → ~75% of keys move</text>
      <circle cx="20" cy="86" r="5" fill="#00D9A3"/>
      <circle cx="65" cy="86" r="5" fill="#00A87E"/>
      <circle cx="110" cy="86" r="5" fill="#6A5AE0"/>
      <circle cx="150" cy="86" r="5" fill="#FF5A3C"/>
    </svg>
  );
}
