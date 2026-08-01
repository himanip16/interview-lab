// src/app/api/skill-tree/[track]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'shared/prisma/client';

/**
 * GET /api/skill-tree/[track]
 * 
 * Returns the skill tree data for a specific track (DSA, LLD, HLD)
 * with gatekeeper logic applied:
 * - Checks if previous level is 100% complete before unlocking next level
 * - Checks XP requirements for Pro level Bug Hunt access
 * - Returns user progress for each step
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { track: string } }
) {
  try {
    const { track } = params;
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // Fetch the study path with all levels and steps
    const studyPath = await prisma.studyPath.findUnique({
      where: { slug: track.toLowerCase(), isActive: true },
      include: {
        levels: {
          orderBy: { level: 'asc' },
          include: {
            steps: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!studyPath) {
      return NextResponse.json(
        { error: 'Study path not found' },
        { status: 404 }
      );
    }

    // Fetch user's XP
    const userXP = await prisma.userXP.findUnique({
      where: { userId },
    });

    const totalXP = userXP?.totalXP || 0;

    // Fetch user's progress for all steps in this path
    const stepIds = studyPath.levels.flatMap((level: any) =>
      level.steps.map((step: any) => step.id)
    );

    const userProgress = await prisma.userStepProgress.findMany({
      where: {
        userId,
        stepId: { in: stepIds },
      },
    });

    const progressMap = new Map(
      userProgress.map((p: any) => [p.stepId, p.completed])
    );

    // Apply gatekeeper logic
    const processedLevels = studyPath.levels.map((level: any, index: number) => {
      const previousLevel = studyPath.levels[index - 1];
      let isLocked = false;

      // Gatekeeper: Check if previous level is 100% complete
      if (previousLevel) {
        const previousLevelStepsComplete = previousLevel.steps.every(
          (step: any) => progressMap.get(step.id)
        );
        isLocked = !previousLevelStepsComplete;
      }

      // Process steps with status
      const processedSteps = level.steps.map((step: any) => {
        const isCompleted = progressMap.get(step.id) || false;
        let status: 'locked' | 'available' | 'in-progress' | 'completed' =
          'available';

        if (isLocked) {
          status = 'locked';
        } else if (isCompleted) {
          status = 'completed';
        } else if (step.isBossGate && level.minXpNeeded > totalXP) {
          // XP check for Pro level Bug Hunt
          status = 'locked';
        }

        return {
          id: step.id,
          title: step.title,
          description: step.description,
          contentType: step.contentType,
          contentSlug: step.contentSlug,
          order: step.order,
          isBossGate: step.isBossGate,
          status,
          isLocked: status === 'locked',
        };
      });

      // Separate regular steps and boss gate
      const regularSteps = processedSteps.filter((s: any) => !s.isBossGate);
      const bossGate = processedSteps.find((s: any) => s.isBossGate);

      return {
        id: level.id,
        level: level.level,
        title: level.title,
        description: level.description,
        minXpNeeded: level.minXpNeeded,
        isLocked,
        items: regularSteps,
        bossGate: bossGate
          ? {
              id: bossGate.id,
              title: bossGate.title,
              status: bossGate.status,
              isLocked: bossGate.isLocked,
            }
          : undefined,
      };
    });

    return NextResponse.json({
      path: {
        id: studyPath.id,
        slug: studyPath.slug,
        title: studyPath.title,
        description: studyPath.description,
      },
      levels: processedLevels,
      userXP: totalXP,
    });
  } catch (error) {
    console.error('Error fetching skill tree:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/skill-tree/[track]/progress
 * 
 * Updates user progress for a specific step
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { track: string } }
) {
  try {
    const { track } = params;
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { stepId, completed } = body;

    if (!stepId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'stepId and completed are required' },
        { status: 400 }
      );
    }

    // Verify the step belongs to the correct track
    const step = await prisma.studyStep.findUnique({
      where: { id: stepId },
      include: {
        level: {
          include: {
            path: true,
          },
        },
      },
    });

    if (!step || step.level.path.slug !== track.toLowerCase()) {
      return NextResponse.json(
        { error: 'Step not found in this track' },
        { status: 404 }
      );
    }

    // Upsert user progress
    const progress = await prisma.userStepProgress.upsert({
      where: {
        userId_stepId: {
          userId,
          stepId,
        },
      },
      update: {
        completed,
        lastReadAt: new Date(),
      },
      create: {
        userId,
        stepId,
        completed,
        lastReadAt: new Date(),
      },
    });

    // If completing a step, award XP (simple implementation)
    if (completed && !progress.completed) {
      const xpEarned = step.isBossGate ? 100 : 25; // Boss gates give more XP

      // Get current XP for level calculation
      const currentUserXP = await prisma.userXP.findUnique({
        where: { userId },
      });

      const currentTotalXP = currentUserXP?.totalXP || 0;

      await prisma.userXP.upsert({
        where: { userId },
        update: {
          totalXP: { increment: xpEarned },
          level: {
            increment: Math.floor((currentTotalXP + xpEarned) / 500), // Level up every 500 XP
          },
        },
        create: {
          userId,
          totalXP: xpEarned,
          level: 1,
        },
      });

      // Log XP activity
      await prisma.xPActivity.create({
        data: {
          userId,
          activityType: step.isBossGate ? 'bug_hunt' : 'article_read',
          xpEarned,
          metadata: {
            stepId,
            contentType: step.contentType,
            contentSlug: step.contentSlug,
          },
        },
      });
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
