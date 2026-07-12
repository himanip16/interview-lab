"use client";

import Link from "next/link";
import Card from "@/src/components/ui/Card";
import Heading from "@/src/components/ui/Heading";
import Text from "@/src/components/ui/Text";

const notebooks = [
  {
    title: "Dropbox System Design",
    description: "File sync architecture, block storage, metadata service",
    readTime: "25 min read",
    type: "HLD"
  },
  {
    title: "URL Shortener Deep Dive",
    description: "Base62 encoding, key generation, cache invalidation",
    readTime: "20 min read",
    type: "HLD"
  },
  {
    title: "Rate Limiter Implementation",
    description: "Token bucket, sliding window, distributed algorithms",
    readTime: "15 min read",
    type: "LLD"
  },
  {
    title: "Chat System Architecture",
    description: "WebSockets, message queues, presence service",
    readTime: "30 min read",
    type: "HLD"
  },
];

export default function PersonalNotebooks() {
  return (
    <section className="py-16">
      <div className="mb-8">
        <Heading level="h2" className="mb-2">
          System Design Library
        </Heading>
        <Text variant="muted">Master distributed system architectures</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {notebooks.map((notebook, index) => (
          <Card
            key={index}
            className="hover:border-border transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-mono rounded">
                {notebook.type}
              </span>
            </div>
            <h3 className="text-card-foreground font-medium mb-2 group-hover:text-foreground transition-colors">
              {notebook.title}
            </h3>
            <Text variant="small" className="mb-3 line-clamp-2">
              {notebook.description}
            </Text>
            <div className="flex items-center justify-between">
              <Text variant="small">{notebook.readTime}</Text>
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
