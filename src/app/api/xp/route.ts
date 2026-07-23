// src/app/api/xp/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/auth";
import { prisma } from "shared/prisma/client";

// XP thresholds for levels
const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];

function calculateLevel(totalXP: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userXP = await prisma.userXP.findUnique({
      where: { userId: session.user.id },
    });

    if (!userXP) {
      userXP = await prisma.userXP.create({
        data: {
          userId: session.user.id,
          totalXP: 0,
          level: 1,
        },
      });
    }

    return NextResponse.json({ 
      totalXP: userXP.totalXP, 
      level: userXP.level 
    });
  } catch (error) {
    console.error("Error fetching XP:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { activityType, xpEarned, metadata } = body;

    if (!activityType || typeof xpEarned !== "number") {
      return NextResponse.json({ error: "activityType and xpEarned are required" }, { status: 400 });
    }

    // Get or create UserXP record
    let userXP = await prisma.userXP.findUnique({
      where: { userId: session.user.id },
    });

    if (!userXP) {
      userXP = await prisma.userXP.create({
        data: {
          userId: session.user.id,
          totalXP: 0,
          level: 1,
        },
      });
    }

    // Update total XP
    const newTotalXP = userXP.totalXP + xpEarned;
    const newLevel = calculateLevel(newTotalXP);

    userXP = await prisma.userXP.update({
      where: { userId: session.user.id },
      data: {
        totalXP: newTotalXP,
        level: newLevel,
      },
    });

    // Log XP activity
    await prisma.xPActivity.create({
      data: {
        userId: session.user.id,
        activityType,
        xpEarned,
        metadata: metadata || {},
      },
    });

    return NextResponse.json({ 
      totalXP: userXP.totalXP, 
      level: userXP.level,
      xpEarned 
    });
  } catch (error) {
    console.error("Error awarding XP:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
