// src/content/deep-dive/illustrations/MongoDB.tsx

export function MongoDBIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* leaf/document body - mongo shape is a "leaf" traditionally, but here doc-stack to stay consistent with document-store idea */}
      <rect x="14" y="8" width="28" height="36" rx="4" fill="#F6F6F4" stroke="#15161C" strokeWidth="1.5"/>
      <rect x="18" y="8" width="24" height="36" rx="4" fill="#00D9A3" opacity=".15"/>
      
      {/* folded corner, doc look */}
      <path d="M34 8V16H42L34 8Z" fill="#15161C" opacity=".08"/>

      {/* nested document lines - show schema-less/flexible shape */}
      <line x1="20" y1="18" x2="34" y2="18" stroke="#15161C" strokeWidth="1.5" opacity=".5"/>
      <line x1="20" y1="24" x2="30" y2="24" stroke="#15161C" strokeWidth="1.5" opacity=".5"/>
      <line x1="20" y1="30" x2="36" y2="30" stroke="#15161C" strokeWidth="1.5" opacity=".5"/>
      <line x1="20" y1="36" x2="26" y2="36" stroke="#15161C" strokeWidth="1.5" opacity=".5"/>

      {/* accent dot - represents nested/embedded field */}
      <circle cx="30" cy="24" r="5" fill="#00D9A3"/>
      <circle cx="30" cy="24" r="2" fill="#15161C"/>
    </svg>
  );
}