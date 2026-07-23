import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "shared/prisma/client";
import { getCurrentUserId } from "@/features/auth/getCurrentUserId";
import { encrypt } from "@/shared/security/encryption";

const aiConfigSchema = z.object({
  provider: z.enum(["openai", "ollama", "custom"]).optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  baseUrl: z.string().url().optional(),
});

// GET /api/user/ai-config
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        aiProvider: true,
        aiApiKey: true,
        aiModel: true,
        aiBaseUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      provider: user.aiProvider,
      hasApiKey: Boolean(user.aiApiKey),
      model: user.aiModel,
      baseUrl: user.aiBaseUrl,
    });
  } catch (error) {
    console.error("Error fetching AI config:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/ai-config
export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();

    const validatedData = aiConfigSchema.parse(body);

    const encryptedApiKey = validatedData.apiKey
      ? encrypt(validatedData.apiKey)
      : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        aiProvider: validatedData.provider,
        aiApiKey: encryptedApiKey,
        aiModel: validatedData.model,
        aiBaseUrl: validatedData.baseUrl,
      },
      select: {
        aiProvider: true,
        aiModel: true,
        aiBaseUrl: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error updating AI config:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}