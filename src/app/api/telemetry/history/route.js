export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  const { user, error } = getAuthUser(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(100, parseInt(searchParams.get("limit")) || 50);

    const records = await prisma.telemetry.findMany({
      where:   { userId: user.id },
      orderBy: { createdAt: "desc" },
      take:    limit,
    });

    // Reverse so charts get oldest → newest
    return NextResponse.json({ telemetry: records.reverse() });

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch telemetry history" }, { status: 500 });
  }
}

