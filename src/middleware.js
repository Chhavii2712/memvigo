import { NextResponse } from "next/server";

export function middleware(request) {
  // Allow all routes — auth is handled client-side via AuthContext
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
