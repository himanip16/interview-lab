import { NextResponse } from "next/server";

import { prisma } from "@/shared/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    const scenario = await prisma.learningScenario.findUnique({
      where: {
        slug: slug,
        isActive: true,
      },
      include: {
        segments: {
          orderBy: {
            order: "asc",
          },
          include: {
            actions: {
              where: {
                isActive: true,
              },
              include: {
                concepts: {
                  include: {
                    concept: true,
                  },
                },
              },
            },
            concepts: {
              include: {
                concept: true,
              },
            },
          },
        },
      },
    });

    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ scenario }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
