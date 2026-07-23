// src/features/deep-dive/components/VideoBlock.tsx

interface VideoBlockProps {
  caption: string;
  duration?: string;
}

export function VideoBlock({ caption, duration }: VideoBlockProps) {
  return (
    <div className="video-block">
      <div className="video-play">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div className="video-cap">{caption}</div>
      {duration && <div className="video-dur">{duration}</div>}
    </div>
  );
}
