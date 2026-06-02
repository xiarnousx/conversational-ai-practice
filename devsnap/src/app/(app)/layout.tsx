import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSystemItemTypes, getItemsForSearch } from "@/lib/db/items";
import { getSidebarCollections, getCollectionsForSearch } from "@/lib/db/collections";
import { prisma } from "@/lib/prisma";
import { parseEditorPreferences } from "@/types/editor-preferences";
import AppLayoutClient from "@/components/dashboard/AppLayoutClient";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const [itemTypes, collections, searchItems, searchCollections, userRow] = await Promise.all([
    getSystemItemTypes(userId),
    getSidebarCollections(userId),
    getItemsForSearch(userId),
    getCollectionsForSearch(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { editorPreferences: true, isPro: true } }),
  ]);

  if (!userRow) redirect("/sign-in");

  const editorPreferences = parseEditorPreferences(userRow.editorPreferences);

  return (
    <AppLayoutClient
      itemTypes={itemTypes}
      collections={collections}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        isPro: userRow.isPro,
      }}
      searchItems={searchItems}
      searchCollections={searchCollections}
      editorPreferences={editorPreferences}
    >
      {children}
    </AppLayoutClient>
  );
}
