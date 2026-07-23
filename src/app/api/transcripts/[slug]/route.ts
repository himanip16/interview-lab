import { NextResponse } from "next/server";
import { prisma } from "shared/prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const transcript = await prisma.transcript.findUnique({
        where: {
            slug
        }
    });

    if (!transcript) {
        return NextResponse.json(
            { error: "Transcript not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(transcript);
}