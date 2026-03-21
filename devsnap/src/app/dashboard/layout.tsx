import { prisma } from "@/lib/prisma";
import { getSystemItemTypes } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "demo@devstash.io" },
    select: { id: true },
  });

  const [itemTypes, collections] = await Promise.all([
    getSystemItemTypes(user.id),
    getSidebarCollections(user.id),
  ]);

  return (
    <DashboardLayoutClient itemTypes={itemTypes} collections={collections}>
      {children}
    </DashboardLayoutClient>
  );
}
