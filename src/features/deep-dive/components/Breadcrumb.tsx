// src/features/deep-dive/components/Breadcrumb.tsx

interface BreadcrumbProps {
  current: string;
}

export function Breadcrumb({ current }: BreadcrumbProps) {
  return (
    <div className="crumb">
      <button className="back">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      Deep dives &nbsp;/&nbsp; <b>{current}</b>
    </div>
  );
}
