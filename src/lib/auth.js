import { verifyAccessToken } from "./jwt.js";
import { NextResponse } from "next/server";

/**
 * Call this at the top of any protected API route handler.
 *
 * Usage:
 *   const { user, error } = getAuthUser(request);
 *   if (error) return error; // returns a 401 NextResponse automatically
 *
 * @param {Request} request
 * @returns {{ user: {id, email} } | { error: NextResponse }}
 */
export function getAuthUser(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json({ error: "Unauthorized — no token provided" }, { status: 401 }),
    };
  }

  const token = authHeader.split(" ")[1];
  try {
    const user = verifyAccessToken(token);
    return { user };
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return {
      error: NextResponse.json({ error: message }, { status: 401 }),
    };
  }
}

/**
 * Validate the internal secret header for Java engine requests.
 * Returns a 403 NextResponse if invalid, or null if valid.
 */
export function checkInternalSecret(request) {
  const secret = request.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
