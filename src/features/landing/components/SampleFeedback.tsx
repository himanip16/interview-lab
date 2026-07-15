"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const sampleTranscript = [
  {
    role: "assistant" as const,
    content: "Let's design a URL shortening service like bit.ly. What are the key requirements?",
    timestamp: "0:00",
  },
  {
    role: "user" as const,
    content: "We need to generate short unique URLs, handle redirects, and track click analytics. The system should be highly available.",
    timestamp: "0:30",
  },
  {
    role: "assistant" as const,
    content: "Good start. How would you generate unique short URLs? What about collisions?",
    timestamp: "1:00",
  },
  {
    role: "user" as const,
    content: "I'd use base62 encoding with a counter. For collisions, we can use a hash function with random salt and retry on collision.",
    timestamp: "1:45",
  },
];

const sampleEvaluation = {
  overallScore: 78,
  strengths: [
    "Clear identification of core requirements",
    "Good understanding of availability concerns",
    "Reasonable approach to URL generation",
  ],
  weaknesses: [
    "Didn't discuss database schema design",
    "Missed caching strategy for redirects",
    "No mention of rate limiting",
  ],
  dimensionScores: [
    { dimension: "Requirements Gathering", score: 85 },
    { dimension: "System Design", score: 72 },
    { dimension: "Scalability", score: 75 },
    { dimension: "Data Modeling", score: 65 },
  ],
};

export default function SampleFeedback() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-foreground">
          See What Feedback Looks Like
        </h2>

        <p className="mt-3 text-muted-foreground">
          Every interview ends with detailed, actionable feedback across multiple dimensions.
        </p>

        <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card">
          {/* Header */}
          <div className="border-b border-border bg-muted p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Sample: Design a URL Shortener
                </h3>
                <p className="text-sm text-muted-foreground">
                  System Design Interview • 45 minutes
                </p>
              </div>
              <div className="rounded-lg bg-primary px-4 py-2 text-center">
                <div className="text-3xl font-bold text-primary-foreground">
                  {sampleEvaluation.overallScore}
                </div>
                <div className="text-xs text-primary-foreground/80">
                  Overall Score
                </div>
              </div>
            </div>
          </div>

          {/* Transcript Preview */}
          <div className="p-6">
            <h4 className="mb-4 font-semibold text-foreground">
              Interview Transcript
            </h4>
            <div className="space-y-3">
              {sampleTranscript.slice(0, expanded ? undefined : 2).map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === "assistant" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {msg.timestamp}
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold">
                      {msg.role === "assistant" ? "Interviewer:" : "You:"}
                    </span>{" "}
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>

            {!expanded && (
              <Button
                variant="secondary"
                onClick={() => setExpanded(true)}
                className="mt-4"
              >
                Show Full Transcript
              </Button>
            )}
          </div>

          {/* Evaluation Preview */}
          <div className="border-t border-border p-6">
            <h4 className="mb-4 font-semibold text-foreground">
              Evaluation Summary
            </h4>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Strengths */}
              <div>
                <h5 className="mb-2 text-sm font-semibold text-green-500">
                  Strengths
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {sampleEvaluation.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <h5 className="mb-2 text-sm font-semibold text-red-500">
                  Areas to Improve
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {sampleEvaluation.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500">!</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dimension Scores */}
            <div className="mt-6">
              <h5 className="mb-3 text-sm font-semibold text-foreground">
                Dimension Scores
              </h5>
              <div className="space-y-2">
                {sampleEvaluation.dimensionScores.map((dim) => (
                  <div key={dim.dimension} className="flex items-center gap-3">
                    <div className="w-40 text-sm text-muted-foreground">
                      {dim.dimension}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm font-semibold text-foreground">
                      {dim.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-border bg-muted p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Get this level of detailed feedback after every practice interview
            </p>
            <div className="mt-3 text-sm text-muted-foreground">
              Interview setup coming soon
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
