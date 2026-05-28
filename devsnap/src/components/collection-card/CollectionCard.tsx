"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Code,
  Sparkles,
  Terminal,
  FileText,
  File,
  ImageIcon,
  Link,
  Star,
  MoreHorizontal,
  Pencil,
  Trash2,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CollectionCardData } from "@/lib/db/collections";
import { EditCollectionDialog } from "@/components/collection-edit/EditCollectionDialog";
import { DeleteCollectionDialog } from "@/components/collection-delete/DeleteCollectionDialog";
import { toggleFavoriteCollection } from "@/actions/collections";

const typeIconMap: Record<string, LucideIcon> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: FileText,
  file: File,
  image: ImageIcon,
  link: Link,
};

interface CollectionCardProps {
  collection: CollectionCardData;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isFav, setIsFav] = useState(collection.isFavorite);

  async function handleToggleFavorite() {
    const next = !isFav;
    setIsFav(next);
    const result = await toggleFavoriteCollection(collection.id);
    if (!result.success) {
      setIsFav(!next);
      toast.error("Failed to update favorite");
    } else {
      router.refresh();
    }
  }

  function handleCardClick() {
    router.push(`/collections/${collection.id}`);
  }

  function stopPropagation(e: React.SyntheticEvent) {
    e.stopPropagation();
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
        style={{ borderColor: collection.borderColor }}
        className="group rounded-lg border bg-card p-4 cursor-pointer transition-colors"
      >
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="truncate font-medium text-sm text-foreground">{collection.name}</span>
            {isFav && (
              <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>

          <div onClick={stopPropagation} onKeyDown={stopPropagation}>
            <DropdownMenu>
              <DropdownMenuTrigger className="shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer bg-transparent border-0">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Collection actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="size-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="size-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleFavorite}>
                  <Star className={`size-3.5 mr-2 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                  {isFav ? "Unfavorite" : "Favorite"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">{collection.itemCount} items</p>
        <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{collection.description}</p>

        <div className="flex items-center gap-1.5">
          {collection.icons.map((iconName, i) => {
            const Icon = typeIconMap[iconName];
            if (!Icon) return null;
            return (
              <div key={i} className="flex size-6 items-center justify-center rounded bg-muted">
                <Icon className="size-3 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </div>

      <EditCollectionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        collectionId={collection.id}
        initialName={collection.name}
        initialDescription={collection.description}
      />

      <DeleteCollectionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        collectionId={collection.id}
        collectionName={collection.name}
      />
    </>
  );
}
