import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSystemItemTypes } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const [itemTypes, collections] = await Promise.all([
    getSystemItemTypes(userId),
    getSidebarCollections(userId),
  ]);

  return (
    <DashboardLayoutClient
      itemTypes={itemTypes}
      collections={collections}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      {children}
    </DashboardLayoutClient>
  );
}
