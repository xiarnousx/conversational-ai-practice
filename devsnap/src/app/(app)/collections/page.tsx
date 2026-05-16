import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCollectionsForUserPaginated } from "@/lib/db/collections";
import { COLLECTIONS_PER_PAGE } from "@/lib/constants";
import { CollectionCard } from "@/components/collection-card/CollectionCard";
import Pagination from "@/components/ui/Pagination";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { collections, total } = await getCollectionsForUserPaginated(session.user.id, page);
  const totalPages = Math.ceil(total / COLLECTIONS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Collections</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} {total === 1 ? "collection" : "collections"}
        </p>
      </div>

      {collections.length === 0 && page === 1 ? (
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

      <Pagination page={page} totalPages={totalPages} basePath="/collections" />
    </div>
  );
}
