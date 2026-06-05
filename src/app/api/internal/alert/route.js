export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { checkInternalSecret } from "@/lib/auth";
import { zScoreAnalysis } from "@/lib/ml";

const Schema = z.object({
  state:   z.number().int().min(0).max(2),
  label:   z.string(),
  message: z.string(),
  details: z.record(z.any()),
  userId:  z.string().optional(),
});

export async function POST(request) {
  const forbidden = checkInternalSecret(request);
  if (forbidden) return forbidden;

  try {
    const body   = await request.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { state, label, message, details, userId } = parsed.data;

    // Resolve target user
    let targetUserId = userId;
    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
      if (!firstUser) {
        return NextResponse.json(
          { error: "No users registered yet" },
          { status: 422 }
        );
      }
      targetUserId = firstUser.id;
    }

    // Save telemetry snapshot
    const telemetry = await prisma.telemetry.create({
      data: {
        userId:          targetUserId,
        fragRatio:       parseFloat(details.frag_ratio       ?? 0),
        ioWaitMs:        parseFloat(details.io_wait_time_ms  ?? 0),
        pageFaultRate:   parseFloat(details.page_fault_rate  ?? 0),
        activeProcesses: parseInt(details.active_processes   ?? 0),
      },
    });

    // Fetch last 50 readings for ML analysis
    const recentReadings = await prisma.telemetry.findMany({
      where:   { userId: targetUserId },
      orderBy: { createdAt: "desc" },
      take:    50,
    });

    // Run ML Z-score analysis
    const mlResult = zScoreAnalysis(recentReadings, telemetry);

    // Determine final alert state (take worst of rule-based and ML)
    let finalState = state;
    let finalMessage = message;

    if (mlResult && mlResult.isCritical && finalState < 2) {
      finalState = 2;
      finalMessage = `ML CRITICAL: Anomaly detected in ${mlResult.anomalousMetric} (z-score: ${mlResult.zScore.toFixed(2)})`;
    } else if (mlResult && mlResult.isAnomaly && finalState < 1) {
      finalState = 1;
      finalMessage = `ML WARNING: Unusual ${mlResult.anomalousMetric} detected (z-score: ${mlResult.zScore.toFixed(2)})`;
    }

    // Save alert
    const alert = await prisma.alert.create({
      data: { 
        userId: targetUserId, 
        state: finalState, 
        message: finalMessage, 
        details: { ...details, mlResult } 
      },
    });

    return NextResponse.json({ alert }, { status: 201 });

  } catch (err) {
    console.error("[internal/alert]", err);
    return NextResponse.json({ error: "Failed to save alert" }, { status: 500 });
  }
}