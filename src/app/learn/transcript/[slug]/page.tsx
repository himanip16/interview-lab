"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function TranscriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTranscript() {
      try {
        const response = await fetch('/api/transcripts');
        const data = await response.json();
        const found = data.find((t: any) => t.slug === slug);
        setTranscript(found || null);
      } catch (error) {
        console.error('Error fetching transcript:', error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchTranscript();
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)',
        color: '#5A5B66',
        fontSize: '16px'
      }}>
        Loading transcript...
      </div>
    );
  }

  if (!transcript) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)',
        color: '#5A5B66',
        gap: '16px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 600 }}>Transcript not found</div>
        <button
          onClick={() => router.push('/learn/transcripts')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(21,22,28,0.08)',
            background: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Back to Transcripts
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#EAE7DF',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden'
    }}>
      <div className="max-w-[1400px] mx-auto h-full" style={{ padding: '16px' }}>
        <div 
          className="rounded-lg overflow-hidden h-full"
          style={{ 
            background: '#FAF9F6',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}
        >
          <button
            onClick={() => router.push('/learn/transcripts')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(21,22,28,0.08)',
              background: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '20px'
            }}
          >
            ← Back to Transcripts
          </button>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '12px',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.02em'
          }}>
            {transcript.title}
          </h1>

          <div style={{
            fontSize: '14px',
            color: '#5A5B66',
            marginBottom: '24px'
          }}>
            {transcript.company || 'Unknown'} • {transcript.difficulty} • {transcript.duration} min
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            minHeight: '400px',
            border: '1px solid rgba(21,22,28,0.08)'
          }}>
            <div style={{ fontSize: '16px', lineHeight: 1.7, color: '#15161C' }}>
              {transcript.summary || transcript.summaryData?.description || 'No description available.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
