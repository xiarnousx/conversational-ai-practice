import { redirect } from "next/navigation";
import NextLink from "next/link";
import {
  Code,
  Sparkles,
  Terminal,
  FileText,
  File,
  ImageIcon,
  Link,
  Star,
  LucideIcon,
} from "lucide-react";
import { auth } from "@/auth";
import { getCollectionsForUser } from "@/lib/db/collections";

const typeIconMap: Record<string, LucideIcon> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: FileText,
  file: File,
  image: ImageIcon,
  link: Link,
};

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
            <NextLink
              key={col.id}
              href={`/collections/${col.id}`}
              style={{ borderColor: col.borderColor }}
              className="group rounded-lg border bg-card p-4 cursor-pointer transition-colors block"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate font-medium text-sm text-foreground">{col.name}</span>
                  {col.isFavorite && (
                    <Star className="size-3 shrink-0 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">{col.itemCount} items</p>
              <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{col.description}</p>
              <div className="flex items-center gap-1.5">
                {col.icons.map((iconName, i) => {
                  const Icon = typeIconMap[iconName];
                  if (!Icon) return null;
                  return (
                    <div
                      key={i}
                      className="flex size-6 items-center justify-center rounded bg-muted"
                    >
                      <Icon className="size-3 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
}
