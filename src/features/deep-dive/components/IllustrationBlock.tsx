type IllustrationWidth = 'full' | 'half' | 'third' | 'quarter' | 'fixed' | 'auto';

interface IllustrationBlockProps {
  illustration: React.ReactNode;
  caption: string;
  children?: React.ReactNode;
  width?: IllustrationWidth;
}

export function IllustrationBlock({ illustration, caption, children, width = 'fixed' }: IllustrationBlockProps) {
  const isFullWidth = width === 'full';
  
  return (
    <div className={`illust-row ${isFullWidth ? 'full-width' : ''}`}>
      <div className={`illust-box ${width}`}>
        {illustration}
        <div className="illust-cap">{caption}</div>
      </div>
      {children && !isFullWidth && <div className="illust-text">{children}</div>}
    </div>
  );
}
