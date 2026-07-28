// src/content/deep-dive/illustrations/CyclicSortIllustration.tsx

export function CyclicSortIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* circular path */}
      <circle
        cx="28"
        cy="28"
        r="18"
        stroke="#00D9A3"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity=".4"
      />
      
      {/* numbered positions in circle */}
      <circle cx="28" cy="10" r="4" fill="#FF5A3C" />
      <text x="28" y="13" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">1</text>
      
      <circle cx="46" cy="28" r="4" fill="#6A5AE0" />
      <text x="46" y="31" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">2</text>
      
      <circle cx="28" cy="46" r="4" fill="#00A87E" />
      <text x="28" y="49" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">3</text>
      
      <circle cx="10" cy="28" r="4" fill="#FFB84D" />
      <text x="10" y="31" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">4</text>
      
      {/* center element */}
      <circle cx="28" cy="28" r="5" fill="#15161C" opacity=".2" />
    </svg>
  );
}
