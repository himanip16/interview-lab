import { NextResponse } from "next/server";

import { ollama } from "@/modules/ai/providers/ollama";

import { getInterview } from "@/lib/interview/state";

import { getPhasePrompt } from "@/lib/interview/prompts";

export async function POST(request: Request) {

  const { messages } = await request.json();


  const interview = getInterview();


  if (!interview) {

    return NextResponse.json(
      {
        error:"Interview not started"
      },
      {
        status:400
      }
    );

  }


  const systemPrompt =
    getPhasePrompt(interview.phase);


  const response = await ollama.chat({

    model:"qwen2.5:7b",

    messages:[

      {
        role:"system",
        content:systemPrompt
      },

      ...messages

    ],

    options:{
      num_predict:150
    }

  });


  return NextResponse.json({

    reply:response.message.content

  });

}