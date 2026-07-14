"use client";

import Link from "next/link";

const CATEGORIES = [
  { id: "SYSTEM_DESIGN", label: "System Design", color: "bg-violet-500", icon: "🏗️", duration: "45 min" },
  { id: "LOW_LEVEL_DESIGN", label: "Low Level Design", color: "bg-blue-500", icon: "⚙️", duration: "30 min" },
  { id: "DATABASES", label: "Databases", color: "bg-emerald-500", icon: "🗄️", duration: "30 min" },
  { id: "KAFKA", label: "Kafka & Streaming", color: "bg-yellow-500", icon: "📨", duration: "45 min" },
  { id: "BACKEND", label: "Backend Engineering", color: "bg-orange-500", icon: "🔧", duration: "30 min" },
];

export default function ActionCards() {
  return (
    <section className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Choose Your Challenge</h2>
        <p className="text-muted-foreground mt-2">Pick a topic and start practicing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/problems?category=${cat.id}`}
            className={`${cat.color} rounded-xl p-6 text-white cursor-pointer transition-transform hover:scale-105 hover:shadow-lg`}
          >
            <div className="text-4xl mb-4">{cat.icon}</div>
            <h3 className="font-bold text-lg">{cat.label}</h3>
            <p className="text-sm opacity-90 mt-2">Practice • {cat.duration}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}