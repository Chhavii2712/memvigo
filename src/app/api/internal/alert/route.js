export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { checkInternalSecret } from "@/lib/auth";

const Schema = z.object({
  apiKey:  z.string().min(1, "apiKey is required"),
  state:   z.number().int().min(0).max(2),
  label:   z.string(),
  message: z.string(),
  details: z.record(z.any()),
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

    const { apiKey, state, label, message, details } = parsed.data;

    // Find user by their unique API key
    const user = await prisma.user.findUnique({ where: { apiKey } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid API key — register on the website first" },
        { status: 401 }
      );
    }

    // Save telemetry
    await prisma.telemetry.create({
      data: {
        userId:          user.id,
        fragRatio:       parseFloat(details.frag_ratio       ?? 0),
        ioWaitMs:        parseFloat(details.io_wait_time_ms  ?? 0),
        pageFaultRate:   parseFloat(details.page_fault_rate  ?? 0),
        activeProcesses: parseInt(details.active_processes   ?? 0),
      },
    });

    // Save alert
    const alert = await prisma.alert.create({
      data: { userId: user.id, state, message, details },
    });

    return NextResponse.json({ alert }, { status: 201 });

  } catch (err) {
    console.error("[internal/alert]", err);
    return NextResponse.json({ error: "Failed to save alert" }, { status: 500 });
  }
}
