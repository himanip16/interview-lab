import Link from 'next/link';

interface BottomNavigationProps {
  previous?: { name: string; slug: string };
  next?: { name: string; slug: string };
}

export function BottomNavigation({ previous, next }: BottomNavigationProps) {
  return (
    <div className="bottom">
      {previous && (
        <Link href={`/deep-dive/${previous.slug}`} className="nav-tool">
          <div className="circ">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </div>
          {previous.name}
        </Link>
      )}
      {next && (
        <Link href={`/deep-dive/${next.slug}`} className="nav-tool">
          {next.name}
          <div className="circ">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        </Link>
      )}
    </div>
  );
}
