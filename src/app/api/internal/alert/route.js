export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { checkInternalSecret } from "@/lib/auth";

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

    // Resolve target user — fall back to first registered user for demo
    let targetUserId = userId;
    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
      if (!firstUser) {
        return NextResponse.json(
          { error: "No users registered yet — register on the website first" },
          { status: 422 }
        );
      }
      targetUserId = firstUser.id;
    }

    // Save telemetry snapshot
    await prisma.telemetry.create({
      data: {
        userId:          targetUserId,
        fragRatio:       parseFloat(details.frag_ratio       ?? 0),
        ioWaitMs:        parseFloat(details.io_wait_time_ms  ?? 0),
        pageFaultRate:   parseFloat(details.page_fault_rate  ?? 0),
        activeProcesses: parseInt(details.active_processes   ?? 0),
      },
    });

    // Save alert
    const alert = await prisma.alert.create({
      data: { userId: targetUserId, state, message, details },
    });

    return NextResponse.json({ alert }, { status: 201 });

  } catch (err) {
    console.error("[internal/alert]", err);
    return NextResponse.json({ error: "Failed to save alert" }, { status: 500 });
  }
}

