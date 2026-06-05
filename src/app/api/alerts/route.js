import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  const { user, error } = getAuthUser(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get("page"))  || 1);
    const limit = Math.min(50, parseInt(searchParams.get("limit")) || 20);
    const skip  = (page - 1) * limit;

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where:   { userId: user.id, dismissed: false },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.alert.count({ where: { userId: user.id, dismissed: false } }),
    ]);

    return NextResponse.json({ alerts, total, page, pages: Math.ceil(total / limit) });

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
