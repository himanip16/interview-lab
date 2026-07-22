"use client";

import TranscriptBrowser from "@/features/library/components/transcript-browser/TranscriptBrowser";

export default function TranscriptsPage() {
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
            background:'#FAF9F6',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <TranscriptBrowser />
        </div>
      </div>
    </div>
  );
}
