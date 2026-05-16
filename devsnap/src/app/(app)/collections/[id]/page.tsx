import { redirect, notFound } from "next/navigation";
import NextLink from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/auth";
import { getCollectionById } from "@/lib/db/collections";
import { getItemsByCollectionId } from "@/lib/db/items";
import { COLLECTIONS_PER_PAGE } from "@/lib/constants";
import ItemRow from "@/components/dashboard/ItemRow";
import ImageThumbnailCard from "@/components/items/ImageThumbnailCard";
import FileListRow from "@/components/items/FileListRow";
import { CollectionDetailActions } from "@/components/collection-detail/CollectionDetailActions";
import Pagination from "@/components/ui/Pagination";

export default async function CollectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [collection, { items, total }] = await Promise.all([
    getCollectionById(session.user.id, id),
    getItemsByCollectionId(session.user.id, id, page),
  ]);

  if (!collection) notFound();

  const totalPages = Math.ceil(total / COLLECTIONS_PER_PAGE);

  const fileItems = items.filter((i) => i.typeName.toLowerCase() === "file");
  const imageItems = items.filter((i) => i.typeName.toLowerCase() === "image");
  const otherItems = items.filter(
    (i) => i.typeName.toLowerCase() !== "file" && i.typeName.toLowerCase() !== "image"
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <NextLink
          href="/collections"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-3" />
          All collections
        </NextLink>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">{collection.name}</h1>
            {collection.description && (
              <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              {total} {total === 1 ? "item" : "items"}
            </p>
          </div>
          <CollectionDetailActions
            collectionId={collection.id}
            collectionName={collection.name}
            collectionDescription={collection.description}
          />
        </div>
      </div>

      {items.length === 0 && page === 1 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No items in this collection yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {fileItems.length > 0 && (
            <div className="flex flex-col gap-2">
              {fileItems.map((item) => (
                <FileListRow key={item.id} item={item} />
              ))}
            </div>
          )}
          {imageItems.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {imageItems.map((item) => (
                <ImageThumbnailCard key={item.id} item={item} />
              ))}
            </div>
          )}
          {otherItems.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {otherItems.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath={`/collections/${id}`} />
    </div>
  );
}
