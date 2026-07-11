import { NextResponse } from "next/server";

import { InterviewMessageService } from "@/modules/interview/services/InterviewMessageService";
import logger from "@/lib/logger";


export async function POST(
  req: Request
) {

  try {

    const body = await req.json();

    const {
      interviewId,
      message,
    } = body;


    if (!interviewId || !message?.trim()) {

      return NextResponse.json(
        {
          error: "Invalid request",
        },
        {
          status:400,
        }
      );
    }


    const service =
      new InterviewMessageService();


    const result =
      await service.processMessage(
        interviewId,
        message
      );


    return NextResponse.json(
      result,
      {
        status:200,
      }
    );


  } catch(error) {


    logger.error(
      {
        error,
      },
      "Failed to process interview message"
    );


    return NextResponse.json(
      {
        error:"Internal server error",
      },
      {
        status:500,
      }
    );

  }
}