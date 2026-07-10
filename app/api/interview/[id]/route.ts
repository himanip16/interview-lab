import { NextResponse } from "next/server";

import { InterviewRepository } from "@/modules/interview/repository/InterviewRepository";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Props
) {
  const { id } = await params;

  const repository =
    new InterviewRepository();

  const interview =
    await repository.getWithMessages(id);

  if (!interview) {
    return NextResponse.json(
      {
        error: "Interview not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    interview
  );
}