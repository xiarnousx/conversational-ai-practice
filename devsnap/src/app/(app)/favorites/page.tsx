import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { auth } from "@/auth";
import { getFavoriteItems } from "@/lib/db/items";
import { getFavoriteCollections } from "@/lib/db/collections";
import FavoriteItemRow from "@/components/favorites/FavoriteItemRow";
import FavoriteCollectionRow from "@/components/favorites/FavoriteCollectionRow";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const [items, collections] = await Promise.all([
    getFavoriteItems(session.user.id),
    getFavoriteCollections(session.user.id),
  ]);

  const isEmpty = items.length === 0 && collections.length === 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Star className="size-5 text-amber-400" />
        <h1 className="text-xl font-semibold text-foreground">Favorites</h1>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Star className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No favorites yet.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Star items and collections to find them here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {items.length > 0 && (
            <section>
              <div className="mb-1 flex items-center gap-2 px-3 pb-1 border-b border-border">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Items
                </span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="flex flex-col">
                {items.map((item) => (
                  <FavoriteItemRow key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {collections.length > 0 && (
            <section>
              <div className="mb-1 flex items-center gap-2 px-3 pb-1 border-b border-border">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Collections
                </span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {collections.length}
                </span>
              </div>
              <div className="flex flex-col">
                {collections.map((col) => (
                  <FavoriteCollectionRow key={col.id} collection={col} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
