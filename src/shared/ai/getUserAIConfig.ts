import { prisma } from "@/shared/prisma/client";
import type { UserAIConfig } from "./config/modelRouting";

export async function getUserAIConfig(userId: string): Promise<UserAIConfig | undefined> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      aiProvider: true,
      aiApiKey: true,
      aiModel: true,
      aiBaseUrl: true,
    },
  });

  if (!user || !user.aiProvider) {
    return undefined;
  }

  return {
    provider: user.aiProvider,
    apiKey: user.aiApiKey || undefined,
    model: user.aiModel || undefined,
    baseUrl: user.aiBaseUrl || undefined,
  };
}
