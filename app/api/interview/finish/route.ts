// app/api/interview/finish/route.ts
import { NextResponse } from 'next/server';
import { EvaluationService } from '@/modules/interview/services/EvaluationService';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { interviewId } = await req.json();
  const evaluationService = new EvaluationService();

  try {
    // 1. Mark interview as completed
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'COMPLETED' }
    });

    // 2. Generate feedback
    const evaluation = await evaluationService.evaluateInterview(interviewId);

    return NextResponse.json({ success: true, evaluationId: evaluation.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}