import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCollectionsForUser } from "@/lib/db/collections";
import { CollectionCard } from "@/components/collection-card/CollectionCard";

export default async function CollectionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const collections = await getCollectionsForUser(session.user.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Collections</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {collections.length} {collections.length === 1 ? "collection" : "collections"}
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No collections yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      )}
    </div>
  );
}
