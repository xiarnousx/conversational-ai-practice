import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { getItemsByType } from "@/lib/db/items";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import ItemRow from "@/components/dashboard/ItemRow";
import ImageThumbnailCard from "@/components/items/ImageThumbnailCard";
import FileListRow from "@/components/items/FileListRow";
import Pagination from "@/components/ui/Pagination";
import ProGate from "@/components/items/ProGate";

const PRO_ONLY_TYPES = new Set(["file", "image"]);

const SLUG_TO_TYPE: Record<string, string> = {
  snippets: "snippet",
  prompts: "prompt",
  commands: "command",
  notes: "note",
  links: "link",
  files: "file",
  images: "image",
};

function slugToLabel(typeName: string): string {
  return typeName.charAt(0).toUpperCase() + typeName.slice(1) + "s";
}

export default async function ItemsTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { type } = await params;
  const typeName = SLUG_TO_TYPE[type];
  if (!typeName) notFound();

  if (PRO_ONLY_TYPES.has(typeName) && !session.user.isPro) {
    const label = slugToLabel(typeName);
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{label}</h1>
        </div>
        <ProGate typeName={typeName} />
      </div>
    );
  }

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { items, total } = await getItemsByType(session.user.id, typeName, page);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const label = slugToLabel(typeName);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} {total === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No {label.toLowerCase()} yet.</p>
        </div>
      ) : typeName === "file" ? (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <FileListRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) =>
            typeName === "image" ? (
              <ImageThumbnailCard key={item.id} item={item} />
            ) : (
              <ItemRow key={item.id} item={item} />
            )
          )}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath={`/items/${type}`} />
    </div>
  );
}
