"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TranscriptEntry } from "./types";

type Props = {
  isOpen: boolean;
  transcript: TranscriptEntry | null;
  categories: Record<string, { label: string; color: string }>;
  diffColor: Record<string, string>;
  onClose: () => void;
};

export default function MobileSheet({ isOpen, transcript, categories, diffColor, onClose }: Props) {
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
    
    // Award XP for starting to read
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
    
    // Navigate to learn page with transcript ID
    router.push(`/learn/transcript/${transcript.slug}`);
  };
  if (!transcript) {
    return null;
  }

  const catKey = transcript.category as keyof typeof categories;
  const catInfo = categories[catKey];
  const diffColorValue = diffColor[transcript.difficulty.toLowerCase()] || '#15161C';

  return (
    <div
      className="mobile-sheet fixed inset-0 flex flex-col"
      style={{
        background: '#FFFFFF',
        zIndex: 20,
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        fontFamily: "'Inter', sans-serif",
        display: 'none'
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '14px',
          right: '16px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid rgba(21,22,28,0.08)',
          background: 'none',
          color: '#15161C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        ×
      </button>

      {/* Handle */}
      <div style={{
        width: '36px',
        height: '4px',
        borderRadius: '2px',
        background: 'rgba(21,22,28,0.08)',
        margin: '10px auto 4px',
        flexShrink: 0
      }} />

      {/* Body */}
      <div className="overflow-y-auto" style={{
        flex: 1,
        padding: '20px'
      }}>
        {/* Meta row */}
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            background: `${diffColorValue}22`,
            color: diffColorValue
          }}>
            {transcript.difficulty}
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            background: `${catInfo?.color}22`,
            color: catInfo?.color
          }}>
            {catInfo?.label}
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: '20.9px',
          fontWeight: 700,
          lineHeight: 1.25,
          color: '#15161C',
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: '-0.02em'
        }}>
          {transcript.title}
        </div>

        {/* Meta info */}
        <div style={{
          fontSize: '11.55px',
          color: '#5A5B66',
          fontWeight: 500,
          marginTop: '8px'
        }}>
          {transcript.company || 'Unknown'} • {transcript.duration} min read
        </div>

        {/* Description */}
        <div style={{
          fontSize: '13.75px',
          color: '#5A5B66',
          lineHeight: 1.7,
          marginTop: '14px'
        }}>
          {transcript.summaryData?.description || transcript.summary || ''}
        </div>

        {/* Tags */}
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          marginTop: '16px'
        }}>
          {transcript.summaryData?.tags?.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'rgba(21,22,28,0.06)',
                color: '#5A5B66'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '22px'
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
