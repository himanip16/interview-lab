// src/content/deep-dive/illustrations/Postgres.tsx

export function PostgresIllustration() {
  return (
    <svg className="mark" viewBox="0 0 220 220" fill="none">
      <circle cx="110" cy="110" r="88" stroke="#15161C" strokeWidth="2" strokeDasharray="4 7" opacity=".25"/>
      <circle cx="110" cy="30" r="11" fill="#00D9A3"/>
      <circle cx="182" cy="70" r="11" fill="#00A87E"/>
      <circle cx="182" cy="150" r="11" fill="#15161C"/>
      <circle cx="110" cy="190" r="11" fill="#00A87E"/>
      <circle cx="38" cy="150" r="11" fill="#00D9A3"/>
      <circle cx="38" cy="70" r="11" fill="#15161C"/>
      <circle cx="110" cy="110" r="16" fill="#FF5A3C"/>
      <path d="M110 30L182 70M182 70L182 150M182 150L110 190M110 190L38 150M38 150L38 70M38 70L110 30" stroke="#15161C" strokeWidth="1.5" opacity=".3"/>
      <path d="M110 110L110 30M110 110L182 70M110 110L182 150M110 110L110 190M110 110L38 150M110 110L38 70" stroke="#FF5A3C" strokeWidth="1.5" opacity=".35"/>
    </svg>
  );
}
