import {
  Difficulty,
  PrismaClient,
  ProblemCategory,
} from "@prisma/client";

const prisma = new PrismaClient();

const problems = [
  {
    slug: "url-shortener",
    title: "Design a URL Shortener",
    description:
      "Design a scalable URL shortening service like TinyURL.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
  },
  {
    slug: "rate-limiter",
    title: "Design a Rate Limiter",
    description:
      "Design a distributed rate limiting system.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
  },
  {
    slug: "news-feed",
    title: "Design a News Feed",
    description:
      "Design a scalable social media news feed.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
  },
  {
    slug: "chat-system",
    title: "Design a Chat System",
    description:
      "Design a real-time messaging platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
  },
  {
    slug: "file-storage",
    title: "Design File Storage",
    description:
      "Design a distributed cloud file storage system.",
    category: ProblemCategory.DISTRIBUTED_SYSTEMS,
    difficulty: Difficulty.HARD,
  },
  {
    slug: "design-uber",
    title: "Design Uber",
    description:
      "Design a large-scale ride sharing platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
  },
  {
    slug: "design-youtube",
    title: "Design YouTube",
    description:
      "Design a global video streaming platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
  },
];

async function main() {
  for (const problem of problems) {
    await prisma.problem.upsert({
      where: {
        slug: problem.slug,
      },
      update: problem,
      create: problem,
    });
  }

  console.log(`Seeded ${problems.length} problems.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });