import { Difficulty } from "@prisma/client";

export interface CandidatePersona {
  name: string;
  seniority: "junior" | "mid" | "senior";
  background: string;
  weaknesses: string[];
}

export const CANDIDATE_PERSONAS: CandidatePersona[] = [
  {
    name: "Priya",
    seniority: "mid",
    background: "3 years backend experience, mostly CRUD services, limited distributed systems exposure",
    weaknesses: ["consistency tradeoffs", "capacity estimation"],
  },
  {
    name: "Daniel",
    seniority: "senior",
    background: "7 years, strong on architecture, tends to over-engineer and skip requirements gathering",
    weaknesses: ["scope discipline", "asking clarifying questions before designing"],
  },
  {
    name: "Wei",
    seniority: "junior",
    background: "1 year experience, confident communicator but shallow technical depth",
    weaknesses: ["technical depth under follow-up", "complexity analysis"],
  },
];

export function pickPersona(difficulty: "EASY" | "MEDIUM" | "HARD" | Difficulty): CandidatePersona {
  const pool =
    difficulty === "EASY" ? CANDIDATE_PERSONAS.filter((p) => p.seniority !== "senior") :
    difficulty === "HARD" ? CANDIDATE_PERSONAS.filter((p) => p.seniority !== "junior") :
    CANDIDATE_PERSONAS;
  return pool[Math.floor(Math.random() * pool.length)];
}
