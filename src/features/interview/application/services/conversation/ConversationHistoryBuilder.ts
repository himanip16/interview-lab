// src/features/interview/application/services/conversation/ConversationHistoryBuilder.ts

import { MessageRole } from "@prisma/client";

import type { ChatMessage } from "@/shared/ai";

export class ConversationHistoryBuilder {
  build(
    transcript: Array<{
      role: MessageRole;
      content: string;
    }>,
    userMessage: string
  ): ChatMessage[] {
    const history: ChatMessage[] = transcript
      .filter(
        (message) =>
          message.role === MessageRole.user ||
          message.role === MessageRole.assistant
      )
      .map((message) => ({
        role:
          message.role === MessageRole.user
            ? "user"
            : "assistant",
        content: message.content,
      }));

    history.push({
      role: "user",
      content: userMessage,
    });

    return history;
  }
}