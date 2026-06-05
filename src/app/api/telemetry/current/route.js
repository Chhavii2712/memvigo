import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  const { user, error } = getAuthUser(request);
  if (error) return error;

  try {
    const latest = await prisma.telemetry.findFirst({
      where:   { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ telemetry: latest });

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch telemetry" }, { status: 500 });
  }
}
