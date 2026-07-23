// src/app/api/learning-scenarios/route.ts

import { NextResponse } from "next/server";

import { prisma } from "shared/prisma/client";

export async function GET(request: Request) {
  try {
    const scenarios = await prisma.learningScenario.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            segments: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    return NextResponse.json({ scenarios }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
