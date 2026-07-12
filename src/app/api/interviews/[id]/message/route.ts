import { NextResponse } from "next/server";
import logger from "@/src/shared/logger/logger";

import { InterviewMessageService } from "@/src/modules/interview/services/interview/InterviewMessageService";


export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  

  try {
    const { id } = await params;

    const body = await req.json();
    const { message } = body;
    console.log({
  params: await params,
  body,
});

    if (!message?.trim()) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }


    if (!id || !message?.trim()) {

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
        id,
        message
      );


    return NextResponse.json(
      result,
      {
        status:200,
      }
    );


  } catch(error) {


    if (error instanceof Error) {
  logger.error(
    {
      err: error,
      message: error.message,
      stack: error.stack,
    },
    "Failed to process interview message"
  );
} else {
  logger.error(
    { error },
    "Failed to process interview message"
  );
}


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