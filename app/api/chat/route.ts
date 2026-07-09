import { NextResponse } from "next/server";

import { ollama } from "@/modules/ai/providers/ollama";
import { PromptLoader } from "@/modules/prompt/PromptLoader";
import { PromptRenderer } from "@/modules/prompt/PromptRenderer";
import { getInterview } from "@/lib/interview/state";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const interview = getInterview();

  if (!interview) {
    return NextResponse.json(
      {
        error: "Interview not started",
      },
      {
        status: 400,
      }
    );
  }

  const promptLoader = new PromptLoader();
  const promptRenderer = new PromptRenderer();

  const template = await promptLoader.load("judge.md");

  const latestUserMessage =
    [...messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content ?? "";

  const systemPrompt = promptRenderer.render(template, {
    candidate: "Candidate",
    question: interview.question ?? "System Design Interview",
    answer: latestUserMessage,
  });

  const response = await ollama.chat({
    model: "qwen2.5:7b",

    messages: [
      {
        role: "system",
        content: systemPrompt,
      },

      ...messages,
    ],

    options: {
      num_predict: 150,
    },
  });

  return NextResponse.json({
    reply: response.message.content,
  });
}