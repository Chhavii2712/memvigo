export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request) {
  const token = request.cookies.get("refreshToken")?.value;

  if (token) {
    try {
      await prisma.revokedToken.create({ data: { token } });
    } catch (_) {
      // Token already revoked — that's fine
    }
  }

  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
  return response;
}

