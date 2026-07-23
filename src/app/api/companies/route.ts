import { NextResponse } from "next/server";

import { prisma } from "shared/prisma/client";

export async function GET(request: Request) {
  try {
    const companies = await prisma.company.findMany({
      include: {
        problems: {
          select: {
            frequency: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Sort by total problem frequency (descending)
    const sortedCompanies = companies
      .map((company) => ({
        id: company.id,
        name: company.name,
        problemCount: company.problems.length,
        totalFrequency: company.problems.reduce(
          (sum, p) => sum + (p.frequency || 0),
          0
        ),
      }))
      .sort((a, b) => b.totalFrequency - a.totalFrequency);

    return NextResponse.json({ companies: sortedCompanies }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
