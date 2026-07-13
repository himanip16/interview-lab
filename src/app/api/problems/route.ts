import { NextResponse } from "next/server";

import { prisma } from "@/shared/prisma/client";
import { Difficulty, InterviewStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const company = searchParams.get("company");
    const interviewType = searchParams.get("interviewType");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "interviewCount";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const userId = searchParams.get("userId");

    const where: any = {};
    
    if (difficulty && Object.values(Difficulty).includes(difficulty as Difficulty)) {
      where.difficulty = difficulty as Difficulty;
    }

    if (company) {
      where.companies = {
        some: {
          company: {
            name: company,
          },
        },
      };
    }

    if (interviewType) {
      where.interviewType = interviewType;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    const orderBy: any = {};
    switch (sort) {
      case "title":
        orderBy.title = "asc";
        break;
      case "difficulty":
        orderBy.difficulty = "asc";
        break;
      case "estimatedMinutes":
        orderBy.estimatedMinutes = "asc";
        break;
      case "interviewCount":
      default:
        orderBy.interviewCount = "desc";
        break;
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        include: {
          companies: {
            include: {
              company: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    // Add completion history if userId is provided
    let problemsWithHistory = problems;
    if (userId) {
      const problemIds = problems.map((p) => p.id);
      const interviews = await prisma.interview.findMany({
        where: {
          userId,
          problemId: { in: problemIds },
          status: InterviewStatus.COMPLETED,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const historyMap = new Map<string, { completed: boolean; timesCompleted: number; lastCompletedAt: Date | null }>();
      interviews.forEach((interview) => {
        const existing = historyMap.get(interview.problemId);
        if (existing) {
          existing.timesCompleted += 1;
        } else {
          historyMap.set(interview.problemId, {
            completed: true,
            timesCompleted: 1,
            lastCompletedAt: interview.updatedAt,
          });
        }
      });

      problemsWithHistory = problems.map((problem) => ({
        ...problem,
        completionHistory: historyMap.get(problem.id) || {
          completed: false,
          timesCompleted: 0,
          lastCompletedAt: null,
        },
      }));
    }

    return NextResponse.json(
      { problems: problemsWithHistory, total, page, limit, totalPages: Math.ceil(total / limit) },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
