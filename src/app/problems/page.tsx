"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "@/features/problems/components/ProblemsPage.module.css";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  interviewType: string;
  estimatedMinutes: number;
  completionHistory?: {
    completed: boolean;
    timesCompleted: number;
    lastCompletedAt: string | null;
  };
  tags?: string[];
}

export default function ProblemsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    difficulty: "all",
    status: "all",
  });
  const [sort, setSort] = useState("popularity");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch("/api/problems");
      const data = await res.json();
      if (data.problems) {
        setProblems(data.problems);
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      // Search filtering is done client-side
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchInput]);

  const getFilteredProblems = () => {
    let filtered = problems.filter((p) => {
      const matchesSearch =
        searchInput === "" ||
        p.title.toLowerCase().includes(searchInput.toLowerCase());
      const matchesType =
        filters.type === "all" ||
        p.interviewType?.toLowerCase() === filters.type;
      const matchesDifficulty =
        filters.difficulty === "all" ||
        p.difficulty?.toLowerCase() === filters.difficulty;
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "done" ? p.completionHistory?.completed : !p.completionHistory?.completed);

      return matchesSearch && matchesType && matchesDifficulty && matchesStatus;
    });

    // Sort
    const DIFF_ORDER = { easy: 0, medium: 1, hard: 2 };
    if (sort === "popularity") {
      filtered.sort((a, b) => (b.completionHistory?.timesCompleted || 0) - (a.completionHistory?.timesCompleted || 0));
    } else if (sort === "alpha") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "difficulty") {
      filtered.sort((a, b) => DIFF_ORDER[a.difficulty?.toLowerCase() as keyof typeof DIFF_ORDER] - DIFF_ORDER[b.difficulty?.toLowerCase() as keyof typeof DIFF_ORDER]);
    } else if (sort === "time") {
      filtered.sort((a, b) => (a.estimatedMinutes || 0) - (b.estimatedMinutes || 0));
    }

    return filtered;
  };

  const filteredProblems = getFilteredProblems();

  const getTypeClass = (type: string) => {
    const t = type?.toLowerCase() || "hld";
    return t === "hld" ? "hld" : t === "lld" ? "lld" : "dsa";
  };

  const getDifficultyClass = (diff: string) => {
    const d = diff?.toLowerCase() || "medium";
    return d === "easy" ? "easy" : d === "medium" ? "medium" : "hard";
  };

  const startInterview = async (problemId: string) => {
    try {
      const res = await fetch("/api/interviews/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hld",
          difficulty: "MEDIUM",
          duration: 45,
          company: "General",
          problemId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Failed to start interview: ${data.error}`);
        return;
      }

      if (data.id) {
        router.push(`/interview/live/${data.id}`);
      }
    } catch (err) {
      console.error("Network error starting interview:", err);
    }
  };

  return (
    <div style={{ background: "#FAF9F6", minHeight: "100vh" }}>
      <div className={styles.panel}>
        <div className={styles.top}>
          <h2>Problem library</h2>
          <div className={styles.search}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Type</span>
            <div className={styles.pillgroup}>
              <button
                className={`${styles.fpill} ${filters.type === "all" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, type: "all" })}
              >
                All
              </button>
              <button
                className={`${styles.fpill} ${styles.typeHld} ${filters.type === "hld" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, type: "hld" })}
              >
                HLD
              </button>
              <button
                className={`${styles.fpill} ${styles.typeLld} ${filters.type === "lld" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, type: "lld" })}
              >
                LLD
              </button>
              <button
                className={`${styles.fpill} ${styles.typeDsa} ${filters.type === "dsa" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, type: "dsa" })}
              >
                DSA
              </button>
            </div>
          </div>
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Difficulty</span>
            <div className={styles.pillgroup}>
              <button
                className={`${styles.fpill} ${filters.difficulty === "all" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, difficulty: "all" })}
              >
                All
              </button>
              <button
                className={`${styles.fpill} ${filters.difficulty === "easy" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, difficulty: "easy" })}
              >
                Easy
              </button>
              <button
                className={`${styles.fpill} ${filters.difficulty === "medium" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, difficulty: "medium" })}
              >
                Medium
              </button>
              <button
                className={`${styles.fpill} ${filters.difficulty === "hard" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, difficulty: "hard" })}
              >
                Hard
              </button>
            </div>
            <span className={styles.filterLabel} style={{ marginLeft: "8px" }}>
              Status
            </span>
            <div className={styles.pillgroup}>
              <button
                className={`${styles.fpill} ${filters.status === "all" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, status: "all" })}
              >
                All
              </button>
              <button
                className={`${styles.fpill} ${filters.status === "done" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, status: "done" })}
              >
                Completed
              </button>
              <button
                className={`${styles.fpill} ${filters.status === "pending" ? styles.active : ""}`}
                onClick={() => setFilters({ ...filters, status: "pending" })}
              >
                Not started
              </button>
            </div>
          </div>

          <div className={styles.barBottom}>
            <div className={styles.count}>
              <b>{filteredProblems.length}</b> problem{filteredProblems.length !== 1 ? "s" : ""}
            </div>
            <div className={styles.sortWrap}>
              <button
                className={styles.sortBtn}
                onClick={() => setSortMenuOpen(!sortMenuOpen)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 7h10M4 12h7M4 17h4" />
                  <path d="M16 6v13M16 19l-3-3M16 19l3-3" />
                </svg>
                <span>
                  {sort === "popularity" ? "Popularity" : sort === "alpha" ? "Alphabetical" : sort === "difficulty" ? "Difficulty" : "Time estimate"}
                </span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={`${styles.sortMenu} ${sortMenuOpen ? styles.open : ""}`}>
                <div
                  className={`${styles.sortOpt} ${sort === "popularity" ? styles.active : ""}`}
                  onClick={() => {
                    setSort("popularity");
                    setSortMenuOpen(false);
                  }}
                >
                  Popularity
                </div>
                <div
                  className={`${styles.sortOpt} ${sort === "alpha" ? styles.active : ""}`}
                  onClick={() => {
                    setSort("alpha");
                    setSortMenuOpen(false);
                  }}
                >
                  Alphabetical
                </div>
                <div
                  className={`${styles.sortOpt} ${sort === "difficulty" ? styles.active : ""}`}
                  onClick={() => {
                    setSort("difficulty");
                    setSortMenuOpen(false);
                  }}
                >
                  Difficulty
                </div>
                <div
                  className={`${styles.sortOpt} ${sort === "time" ? styles.active : ""}`}
                  onClick={() => {
                    setSort("time");
                    setSortMenuOpen(false);
                  }}
                >
                  Time estimate
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.list}>
          {loading ? (
            <div className={styles.emptyState}>Loading problems...</div>
          ) : filteredProblems.length === 0 ? (
            <div className={styles.emptyState}>No problems match these filters.</div>
          ) : (
            filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className={styles.row}
                onClick={() => startInterview(problem.id)}
              >
                <div className={`bar ${getTypeClass(problem.interviewType)}`}></div>
                <div className={styles['row-main']}>
                  <div className={styles['row-title']}>
                    <h3>{problem.title}</h3>
                    <span className={`type-tag ${getTypeClass(problem.interviewType)}`}>
                      {problem.interviewType?.toUpperCase() || "HLD"}
                    </span>
                  </div>
                  <div className="row-crux" style={{fontSize: '12.5px', color: '#5A5B66', marginTop: '3px'}}>
                    {problem.tags?.join(" · ") || problem.category || 'Design concepts'}
                  </div>
                </div>
                <div className={styles['row-right']}>
                  <span className={`${styles.diff} ${styles[getDifficultyClass(problem.difficulty)]}`}>
                    {problem.difficulty}
                  </span>
                  <span className={styles.mins}>{problem.estimatedMinutes}m</span>
                  <div className={`${styles.check} ${problem.completionHistory?.completed ? styles.done : styles.pending}`}>
                    {problem.completionHistory?.completed ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}