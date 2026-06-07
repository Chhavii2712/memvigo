export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/db";

const Schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// Called by the Java engine on first run to get the user's API key
export async function POST(request) {
  try {
    const body   = await request.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    const match = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.compare(password, "$2b$10$invalidhashpadding000000000000000");

    if (!user || !match) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Return only the API key — engine saves it locally
    return NextResponse.json({ apiKey: user.apiKey, email: user.email });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
