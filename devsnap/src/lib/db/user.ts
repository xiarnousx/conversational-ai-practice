import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { DEMO_USER_EMAIL } from "@/lib/constants";

export const getDemoUser = cache(async () => {
  return prisma.user.findUniqueOrThrow({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
});
