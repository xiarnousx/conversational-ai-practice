import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSystemItemTypes } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";
import AppLayoutClient from "@/components/dashboard/AppLayoutClient";

export default async function AppLayout({
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
    <AppLayoutClient
      itemTypes={itemTypes}
      collections={collections}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      {children}
    </AppLayoutClient>
  );
}
