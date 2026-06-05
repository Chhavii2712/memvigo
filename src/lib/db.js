import { PrismaClient } from "@prisma/client";

// In development, Next.js hot-reloads the server on every save.
// Without this pattern, each reload creates a NEW DB connection pool,
// eventually exhausting your database's connection limit.
// We store one PrismaClient on the global object so it survives reloads.

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
