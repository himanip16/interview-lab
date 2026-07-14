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
          company: { name: company },
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
      case "title": orderBy.title = "asc"; break;
      case "difficulty": orderBy.difficulty = "asc"; break;
      case "estimatedMinutes": orderBy.estimatedMinutes = "asc"; break;
      case "interviewCount":
      default: orderBy.interviewCount = "desc"; break;
    }

    // 1. Define include options once at the top
    const includeOptions = {
      companies: {
        include: { company: true },
      },
      tags: {
        include: { tag: true }
      }
    };

    let problems, total;

    // First attempt
    [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        include: includeOptions, // USE THE INCLUDE HERE
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    // Fallback logic
    if (problems.length === 0 && page === 1) {
      if (where.companies) {
        const { companies: _, ...fallbackWhere } = where;
        [problems, total] = await Promise.all([
          prisma.problem.findMany({
            where: fallbackWhere,
            include: includeOptions, // USE THE INCLUDE HERE
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.problem.count({ where: fallbackWhere }),
        ]);
      } else if (where.category) {
        const { category: _, ...fallbackWhere } = where;
        [problems, total] = await Promise.all([
          prisma.problem.findMany({
            where: fallbackWhere,
            include: includeOptions, // USE THE INCLUDE HERE
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.problem.count({ where: fallbackWhere }),
        ]);
      }
    }

    // 2. Fetch history if needed
    const historyMap = new Map<string, any>();
    if (userId && problems.length > 0) {
      const problemIds = problems.map((p) => p.id);
      const interviews = await prisma.interview.findMany({
        where: {
          userId,
          problemId: { in: problemIds },
          status: InterviewStatus.COMPLETED,
        },
        orderBy: { updatedAt: "desc" },
      });

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
    }

    // 3. TRANSFORM DATA (Crucial step to fix Zod errors)
    const transformedProblems = problems.map((p: any) => ({
      ...p,
      // Flatten the tags relation into a simple array of strings
      tags: p.tags?.map((t: any) => t.tag.name) || [],
      // Ensure interviewType is never null for Zod (or use .nullable() in schema)
      interviewType: p.interviewType || "general",
      completionHistory: historyMap.get(p.id) || {
        completed: false,
        timesCompleted: 0,
        lastCompletedAt: null,
      },
    }));

    return NextResponse.json(
      { 
        problems: transformedProblems, 
        total, 
        page, 
        limit, 
        totalPages: Math.ceil(total / limit) 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}