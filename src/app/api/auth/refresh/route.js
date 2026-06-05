export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";

export async function POST(request) {
  try {
    const token = request.cookies.get("refreshToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // Check revocation list
    const revoked = await prisma.revokedToken.findUnique({ where: { token } });
    if (revoked) {
      return NextResponse.json({ error: "Refresh token revoked" }, { status: 401 });
    }

    const decoded = verifyRefreshToken(token);

    // Rotate — revoke old, issue new
    await prisma.revokedToken.create({ data: { token } });

    const payload         = { id: decoded.id, email: decoded.email };
    const newAccessToken  = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    const response = NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   7 * 24 * 60 * 60,
      path:     "/",
    });
    return response;

  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }
}

