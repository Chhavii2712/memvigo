export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(request) {
  const { user, error } = getAuthUser(request);
  if (error) return error;

  try {
    await prisma.telemetry.deleteMany({ where: { userId: user.id } });
    await prisma.alert.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ message: "Telemetry data cleared successfully" });
  } catch (err) {
    console.error("[user/telemetry/delete]", err);
    return NextResponse.json({ error: "Failed to clear telemetry" }, { status: 500 });
  }
}