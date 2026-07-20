import { MessageRole } from "@prisma/client";

import { ConversationHistoryBuilder } from "./ConversationHistoryBuilder";
import type { ChatMessage } from "@/shared/ai";
import { expect, describe, it } from "vitest";

describe("ConversationHistoryBuilder", () => {
  const builder = new ConversationHistoryBuilder();

  it("includes only user and assistant messages", () => {
    const history = builder.build(
      [
        {
          role: MessageRole.user,
          content: "Hello",
        },
        {
          role: MessageRole.assistant,
          content: "Hi",
        },
        {
          role: MessageRole.system,
          content: "Ignored",
        },
      ],
      "Next question"
    );

    expect(history).toEqual([
      {
        role: "user",
        content: "Hello",
      },
      {
        role: "assistant",
        content: "Hi",
      },
      {
        role: "user",
        content: "Next question",
      },
    ]);
  });

  it("appends the latest user message", () => {
    const history = builder.build([], "New message");

    expect(history).toEqual([
      {
        role: "user",
        content: "New message",
      },
    ]);
  });
});