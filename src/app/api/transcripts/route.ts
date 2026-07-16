import { NextResponse } from "next/server";
import { prisma } from "@/shared/prisma/client";

export async function GET() {
    const transcripts = await prisma.transcript.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return NextResponse.json(transcripts);
}