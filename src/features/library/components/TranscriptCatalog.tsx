"use client";

import { useState, useMemo } from "react";
import { Search } from "@/components/ui/Search";
import { getAllTranscripts, getCategories, getCategoryLabel } from "@/content/transcripts";
import type { TranscriptCategory } from "@/content/transcripts/types";
import TranscriptCard from "./TranscriptCard";
import EmptyState from "./EmptyState";

export default function TranscriptCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TranscriptCategory | "all">("all");

  const allTranscripts = getAllTranscripts();

  const filteredTranscripts = useMemo(() => {
    return allTranscripts.filter((transcript) => {
      const matchesCategory = selectedCategory === "all" || transcript.summary.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        transcript.summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transcript.summary.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transcript.summary.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        transcript.summary.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, allTranscripts]);

  const categories = getCategories();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allTranscripts.length,
    };
    categories.forEach(cat => {
      counts[cat] = allTranscripts.filter(t => t.summary.category === cat).length;
    });
    return counts as Record<TranscriptCategory | "all", number>;
  }, [allTranscripts, categories]);

  if (allTranscripts.length === 0) {
    return (
      <EmptyState message="No transcripts available yet." />
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <Search
        placeholder="Search by title, company, topic..."
        className="w-full max-w-md"
        onSearch={setSearchQuery}
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-[var(--ink)] text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All ({categoryCounts.all})
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-[var(--ink)] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {getCategoryLabel(category)} ({categoryCounts[category]})
          </button>
        ))}
      </div>

      {/* Transcript Grid */}
      {filteredTranscripts.length === 0 ? (
        <EmptyState message="No transcripts match your search." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTranscripts.map((transcript) => (
            <TranscriptCard
              key={transcript.summary.slug}
              transcript={transcript}
            />
          ))}
        </div>
      )}
    </div>
  );
}