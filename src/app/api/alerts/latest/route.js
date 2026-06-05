export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  const { user, error } = getAuthUser(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const n = Math.min(20, parseInt(searchParams.get("n")) || 10);

    const alerts = await prisma.alert.findMany({
      where:   { userId: user.id },
      orderBy: { createdAt: "desc" },
      take:    n,
    });

    return NextResponse.json({ alerts });

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch latest alerts" }, { status: 500 });
  }
}

