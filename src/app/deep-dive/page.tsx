import Link from 'next/link';
import { SplitBackground } from '@/features/deep-dive/components/SplitBackground';
import { BackgroundBlobs } from '@/features/deep-dive/components/BackgroundBlobs';
import { DeepDiveHero } from '@/features/deep-dive/components/DeepDiveHero';
import { CassandraIllustration } from '@/features/deep-dive/illustrations/Cassandra';
import { BottomNavigation } from '@/features/deep-dive/components/BottomNavigation';
import { deepDiveData } from '@/features/deep-dive/data';
import '@/features/deep-dive/styles/deep-dive.css';

export default function DeepDiveLandingPage() {
  const featured = deepDiveData[0]; // Cassandra as featured
  const { previous, next } = {
    previous: deepDiveData[deepDiveData.length - 1], // Last item
    next: deepDiveData[1] // Second item
  };

  return (
    <div className="stage">
      <SplitBackground />
      <BackgroundBlobs />

      <div className="top">
        <div className="navlinks">
          <span>About Learn</span>
          <b>Deep Dives</b>
          <span>Library</span>
        </div>
        <button className="ham">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <div className="content">
        <DeepDiveHero
          eyebrow={featured.eyebrow}
          title={featured.name}
          slug={featured.slug}
          description={featured.description}
          tags={featured.tags}
          credit={featured.credit}
          creditOrg={featured.creditOrg}
          illustration={<CassandraIllustration />}
          docsUrl={featured.docsUrl}
        />
      </div>

      <BottomNavigation
        previous={previous ? { name: previous.name, slug: previous.slug } : undefined}
        next={next ? { name: next.name, slug: next.slug } : undefined}
      />
    </div>
  );
}
