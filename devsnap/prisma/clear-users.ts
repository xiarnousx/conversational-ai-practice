/**
 * Deletes all users except the demo user (ihabarnus@gmail.com),
 * then re-seeds sample user data (mark@gmail.com).
 *
 * Usage: npm run db:clear-users
 */
import "dotenv/config";
import { execSync } from "child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const DEMO_EMAIL = "ihabarnus@gmail.com";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Clearing all users except ${DEMO_EMAIL}...`);

  const usersToDelete = await prisma.user.findMany({
    where: { email: { not: DEMO_EMAIL } },
    select: { id: true, email: true },
  });

  if (usersToDelete.length === 0) {
    console.log("No users to delete.");
  } else {
    for (const user of usersToDelete) {
      await prisma.itemTag.deleteMany({ where: { item: { userId: user.id } } });
      await prisma.itemCollection.deleteMany({ where: { item: { userId: user.id } } });
      await prisma.item.deleteMany({ where: { userId: user.id } });
      await prisma.collection.deleteMany({ where: { userId: user.id } });
      await prisma.tag.deleteMany({ where: { userId: user.id } });
      await prisma.account.deleteMany({ where: { userId: user.id } });
      await prisma.session.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
      console.log(`  Deleted user: ${user.email}`);
    }
  }

  console.log("Re-seeding sample users...");
  execSync("tsx prisma/seed-mark.ts", { stdio: "inherit" });
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
