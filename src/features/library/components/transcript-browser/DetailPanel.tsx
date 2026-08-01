// src/features/library/components/transcript-browser/DetailPanel.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TranscriptEntry } from "./types";
import "./animations.css";

type Props = {
  transcript: TranscriptEntry | null;
  categories: Record<string, { label: string; color: string }>;
  diffColor: Record<string, string>;
};

export default function DetailPanel({ transcript, categories, diffColor }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!transcript) return;
    setSaving(true);
    try {
      if (saved) {
        await fetch('/api/transcripts/unsave', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcriptSlug: transcript.slug }),
        });
        setSaved(false);
      } else {
        await fetch('/api/transcripts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcriptSlug: transcript.slug }),
        });
        setSaved(true);
      }
    } catch (error) {
      console.error('Error saving transcript:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleStartReading = async () => {
    if (!transcript) return;

    try {
      await fetch('/api/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: 'article_read',
          xpEarned: 50,
          metadata: { transcriptSlug: transcript.slug, transcriptTitle: transcript.title }
        }),
      });
    } catch (error) {
      console.error('Error awarding XP:', error);
    }

    router.push(`/learn/transcript/${transcript.slug}`);
  };

  if (!transcript) {
    return (
      // was missing "desktop-detail" — meant this placeholder ignored the
      // mobile-collapse rule entirely and always took up column width,
      // even on narrow screens. That's the empty panel visible in the screenshot.
      <div className="desktop-detail overflow-y-auto" style={{
        flex: '0 0 320px',
        padding: '24px 22px',
        fontFamily: "'Inter', sans-serif",
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#5A5B66',
        fontSize: '13.75px'
      }}>
        Select a transcript to preview it here.
      </div>
    );
  }

  const catKey = transcript.category as keyof typeof categories;
  const catInfo = categories[catKey];
  const diffColorValue = diffColor[transcript.difficulty.toLowerCase()] || '#15161C';

  return (
    <div className="desktop-detail overflow-y-auto" style={{
      flex: '0 0 380px',
      padding: '32px 28px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        animation: 'fadeIn 0.35s ease'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          marginBottom: '16px',
          color: diffColorValue,
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          {transcript.difficulty}
        </div>

        <div style={{
          fontSize: '24px',
          fontWeight: 700,
          lineHeight: 1.2,
          color: '#15161C',
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}>
          {transcript.title}
        </div>

        <div style={{
          fontSize: '13px',
          color: '#5A5B66',
          fontWeight: 500,
          marginBottom: '24px'
        }}>
          {transcript.duration} min read
        </div>

        <div style={{
          fontSize: '14px',
          color: '#5A5B66',
          lineHeight: 1.7,
          marginBottom: '32px'
        }}>
          {transcript.summaryData?.description || transcript.summary || ''}
        </div>

        {transcript.summaryData?.tags && transcript.summaryData.tags.length > 0 && (
          <div style={{
            marginBottom: '32px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#5A5B66',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Topics
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {transcript.summaryData.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#15161C'
                  }}
                >
                  {tag}
                </span>
              ))}
              {transcript.summaryData.tags.length > 4 && (
                <span style={{
                  fontSize: '12px',
                  color: '#5A5B66'
                }}>
                  +{transcript.summaryData.tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '8px'
        }}>
          <button
            onClick={handleStartReading}
            style={{
              flex: 1,
              background: '#00A87E',
              color: '#fff',
              border: 'none',
              padding: '11px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '13.75px',
              cursor: 'pointer'
            }}
          >
            Start reading
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '11px 16px',
              borderRadius: '999px',
              border: saved ? '1px solid #00A87E' : '1px solid rgba(21,22,28,0.08)',
              background: saved ? 'rgba(0,168,126,0.1)' : 'none',
              color: saved ? '#00A87E' : '#15161C',
              fontWeight: 600,
              fontSize: '13.75px',
              cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? '...' : saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}