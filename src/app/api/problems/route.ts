import { NextResponse } from "next/server";

import { prisma } from "@/shared/prisma/client";
import { Difficulty } from "@prisma/client";

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

    return NextResponse.json(
      { problems, total, page, limit, totalPages: Math.ceil(total / limit) },
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
