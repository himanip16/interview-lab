import { NextResponse } from "next/server";

import { prisma } from "@/shared/prisma/client";
import { Difficulty } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const company = searchParams.get("company");

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

    const problems = await prisma.problem.findMany({
      where,
      include: {
        companies: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        interviewCount: "desc",
      },
    });

    return NextResponse.json({ problems }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
