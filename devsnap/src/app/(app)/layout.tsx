import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSystemItemTypes, getItemsForSearch } from "@/lib/db/items";
import { getSidebarCollections, getCollectionsForSearch } from "@/lib/db/collections";
import AppLayoutClient from "@/components/dashboard/AppLayoutClient";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const [itemTypes, collections, searchItems, searchCollections] = await Promise.all([
    getSystemItemTypes(userId),
    getSidebarCollections(userId),
    getItemsForSearch(userId),
    getCollectionsForSearch(userId),
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
      searchItems={searchItems}
      searchCollections={searchCollections}
    >
      {children}
    </AppLayoutClient>
  );
}
