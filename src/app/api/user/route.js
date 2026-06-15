export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  const { user, error } = getAuthUser(request);
  if (error) return error;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, apiKey: true, createdAt: true },
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user: dbUser });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
export async function DELETE(request) {
  const { user, error } = getAuthUser(request);
  if (error) return error;

  try {
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("[user/delete]", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}