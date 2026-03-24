import { getSystemItemTypes } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";
import { getDemoUser } from "@/lib/db/user";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDemoUser();

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
