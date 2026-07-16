import { NextResponse } from "next/server";
import { prisma } from "@/shared/prisma/client";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const transcript = await prisma.transcript.findUnique({
        where: {
            slug: params.slug
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