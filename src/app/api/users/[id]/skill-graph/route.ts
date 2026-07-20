import { NextResponse } from "next/server";

import { SkillGraphService } from "@/features/interview/mastery/SkillGraphService";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing user id." },
        { status: 400 }
      );
    }

    const service = new SkillGraphService();
    const graph = await service.getSkillGraph(id);

    return NextResponse.json(graph, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}