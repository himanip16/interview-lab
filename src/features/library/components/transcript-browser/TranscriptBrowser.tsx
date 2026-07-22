"use client";

import { useState, useMemo, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import type { TranscriptEntry } from "./types";
import Sidebar from "./Sidebar";
import ListPanel from "./ListPanel";
import DetailPanel from "./DetailPanel";
import MobileFilterBar from "./MobileFilterBar";
import MobileSheet from "./MobileSheet";

const CATS = {
  behavioral: { label: 'Behavioral', color: '#E8940A' },
  dsa: { label: 'Data Structures & Algorithms', color: '#00A87E' },
  hld: { label: 'High Level Design', color: '#6A5AE0' },
  lld: { label: 'Low Level Design', color: '#FF5A3C' },
  'machine-coding': { label: 'Machine Coding', color: '#6A5AE0' },
} as const;

const DIFF_RANK: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2, easy: 0, medium: 1, hard: 2 };
const DIFF_COLOR = { easy: '#00A87E', medium: '#E8940A', hard: '#FF5A3C' };

const PAGE_SIZE = 8;

type Category = keyof typeof CATS | 'all';

export default function TranscriptBrowser() {
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'recent' | 'company' | 'duration' | 'difficulty'>('recent');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transcripts from API
  useEffect(() => {
    async function fetchTranscripts() {
      try {
        const response = await fetch('/api/transcripts');
        const data = await response.json();
        setTranscripts(data);
      } catch (error) {
        console.error('Error fetching transcripts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTranscripts();
  }, []);

  const filteredTranscripts = useMemo(() => {
    let items = transcripts.filter((t: TranscriptEntry) => {
      const catKey = t.category as keyof typeof CATS;
      const matchesCategory = category === 'all' || catKey === category;
      const matchesSearch = query === '' ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        (t.company?.toLowerCase().includes(query.toLowerCase())) ||
        (t.summaryData?.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) ||
        (t.summaryData?.description?.toLowerCase().includes(query.toLowerCase())) ||
        (t.summary?.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sort === 'company') {
      items = [...items].sort((a, b) => (a.company || '').localeCompare(b.company || ''));
    }
    if (sort === 'duration') {
      items = [...items].sort((a, b) => (a.duration || 0) - (b.duration || 0));
    }
    if (sort === 'difficulty') {
      items = [...items].sort((a, b) => DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty]);
    }

    return items;
  }, [category, query, sort, transcripts]);

  const totalPages = Math.max(1, Math.ceil(filteredTranscripts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredTranscripts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const categories = useMemo(() => {
    const counts: Record<string, number> = { all: transcripts.length };
    Object.entries(CATS).forEach(([key]) => {
      counts[key] = transcripts.filter(t => t.category === key).length;
    });
    return counts;
  }, [transcripts]);

  const featured = transcripts[0] || null;

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSelectTranscript = (slug: string) => {
    setSelected(slug);
    setMobileSheetOpen(true);
  };

  const selectedTranscript = selected ? transcripts.find(t => t.slug === selected) ?? null : null;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#5A5B66',
        fontSize: '16px'
      }}>
        Loading transcripts...
      </div>
    );
  }

  return (
    <> 
      <style jsx global>{`
        @container device (max-width: 480px) {
          .desktop-sidebar { display: none !important; }
          .desktop-detail { display: none !important; }
          .mobile-filter-bar { display: flex !important; }
          .mobile-sheet { display: flex !important; }
          .list-col { border-right: none !important; }
        }
      `}</style>
      <div 
        className="flex flex-col h-full"
        style={{ 
          fontFamily: "'Inter', sans-serif",
          color: '#15161C',
          background: '#FAF9F6',
          containerType: 'inline-size',
          containerName: 'device'
        }}
      >
      {/* Topbar */}
      <div className="flex items-center justify-between px-[22px] py-4 border-b" style={{ 
        borderColor: 'rgba(21,22,28,0.08)',
        flexShrink: 0 
      }}>
        <h1 className="font-bold" style={{ 
          fontFamily: "'Poppins', sans-serif",
          fontSize: '18px',
          letterSpacing: '-0.02em'
        }}>
          Transcripts
        </h1>
        <div className="flex items-center gap-[7px] px-[13px] py-[7px] rounded-full" style={{
          background: '#FFFFFF',
          border: '1px solid rgba(21,22,28,0.08)',
          fontSize: '12px',
          color: '#5A5B66'
        }}>
          <SearchIcon width={12} height={12} />
          <input
            type="text"
            placeholder="Search…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="border-none outline-none bg-transparent w-[100px]"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#15161C' }}
          />
        </div>
      </div>

      {/* Mobile Filter Bar */}
      <MobileFilterBar
        categories={CATS}
        counts={categories}
        selected={category}
        onSelect={handleCategoryChange}
      />

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          categories={CATS}
          counts={categories}
          selected={category}
          sort={sort}
          featured={featured}
          onCategoryChange={handleCategoryChange}
          onSortChange={setSort}
        />

        {/* List Panel */}
        <ListPanel
          items={pageItems}
          selected={selected}
          categories={CATS}
          currentPage={currentPage}
          totalPages={totalPages}
          onSelect={handleSelectTranscript}
          onPageChange={setPage}
        />

        {/* Detail Panel */}
        <DetailPanel
          transcript={selectedTranscript}
          categories={CATS}
          diffColor={DIFF_COLOR}
        />
      </div>

      {/* Mobile Sheet */}
      <MobileSheet
        isOpen={mobileSheetOpen}
        transcript={selectedTranscript}
        categories={CATS}
        diffColor={DIFF_COLOR}
        onClose={() => setMobileSheetOpen(false)}
      />
      </div>
    </>
  );
}
