import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

let prisma: PrismaClient;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ["query", "info", "warn", "error"],
      });
    }

    prisma = global.prisma;
  }
}

export default prisma;
