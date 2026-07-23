// src/features/deep-dive/components/ReadMoreButton.tsx

export function ReadMoreButton() {
  return (
    <button className="read-more">
      <div className="ic">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>
      READ MORE
    </button>
  );
}
