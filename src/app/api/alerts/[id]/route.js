import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function GET(request, { params }) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { user, error } = getAuthUser(request);
  if (error) return error;

  try {
    const alert = await prisma.alert.findUnique({ where: { id: params.id } });
    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }
    if (alert.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.alert.update({
      where: { id: params.id },
      data: { dismissed: true },
    });

    return NextResponse.json({ message: "Alert dismissed" });

  } catch (err) {
    return NextResponse.json({ error: "Failed to dismiss alert" }, { status: 500 });
  }
}