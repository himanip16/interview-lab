// src/features/interview/transcript/application/TranscriptService.ts

import { prisma } from "shared/prisma/client";
import { TranscriptNode } from "../domain/TranscriptNode";

export class TranscriptService {
  static async getBySessionId(sessionId: string): Promise<TranscriptNode[]> {
    const session = await prisma.interview.findUnique({
      where: { id: sessionId },
      select: { transcript: true }
    });

    if (!session) throw new Error("Session not found");

    // Map Prisma JSON to Domain Entity
    return (session.transcript as any[]).sort((a, b) => a.order - b.order);
  }
}