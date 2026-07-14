// src/app/learn/page.tsx
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";

const LEARNING_PATHS = [
  {
    title: "System Design Diagrams",
    description: "Interactive architecture diagrams for real-world systems like Twitter, Netflix, and Uber.",
    href: "/learn/diagrams",
    color: "blue",
  },
  {
    title: "Learning Scenarios",
    description: "Guided learning scenarios to master distributed systems concepts step by step.",
    href: "/learn/scenarios",
    color: "green",
  },
  {
    title: "Whiteboard Practice",
    description: "Practice system design on an interactive whiteboard with preset components.",
    href: "/learn/whiteboard",
    color: "purple",
  },
  {
    title: "Action Carousel",
    description: "Interactive exercises to test your understanding of system design patterns.",
    href: "/learn/action-carousel",
    color: "orange",
  },
];

const COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-foreground">
      {/* Header */}
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Learning Center
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Learn System Design
        </h1>
        <Text variant="muted" className="mt-2">
          Master distributed systems through interactive diagrams, scenarios, and practice exercises.
        </Text>
      </div>

      {/* Learning Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEARNING_PATHS.map((path) => (
          <Link key={path.href} href={path.href}>
            <Card className="h-full hover:border-foreground/40 transition-colors cursor-pointer p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {path.title}
                  </h3>
                  <Text variant="muted" className="leading-relaxed">
                    {path.description}
                  </Text>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`inline-block rounded px-3 py-1 font-mono text-xs font-bold uppercase ${COLOR_CLASSES[path.color]} border`}
                >
                  Interactive
                </span>
                <span className="text-muted-foreground">→</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Getting Started Section */}
      <Card className="mt-8 p-6">
        <Heading level="h3" className="mb-3">
          Getting Started
        </Heading>
        <Text variant="body" className="leading-relaxed mb-4">
          Start with interactive diagrams to understand real-world system architectures, then move to learning scenarios for deeper understanding, and practice on the whiteboard to solidify your knowledge.
        </Text>
        <div className="flex flex-wrap gap-3">
          <Link href="/learn/diagrams">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              Browse Diagrams
            </button>
          </Link>
          <Link href="/interview/setup">
            <button className="px-4 py-2 border border-border bg-card rounded-lg font-medium hover:border-foreground/40 transition-colors">
              Start Practice Interview
            </button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
