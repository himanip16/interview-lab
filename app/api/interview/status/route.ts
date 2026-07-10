import { NextResponse } from "next/server";
import { SummaryService } from "@/modules/interview/services/SummaryService";

import { InterviewRepository } from "@/modules/interview/repository/InterviewRepository";

export async function GET(
    request: Request
) {

    const id =
        new URL(request.url)
            .searchParams
            .get("id");

    if (!id) {

        return NextResponse.json(
            {
                error: "Missing id"
            },
            {
                status: 400
            }
        );

    }

    const repository =
        new InterviewRepository();

    const interview =
        await repository.get(id);

    return NextResponse.json(interview);

}