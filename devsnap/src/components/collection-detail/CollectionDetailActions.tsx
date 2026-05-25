"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EditCollectionDialog } from "@/components/collection-edit/EditCollectionDialog";
import { DeleteCollectionDialog } from "@/components/collection-delete/DeleteCollectionDialog";
import { toggleFavoriteCollection } from "@/actions/collections";

interface Props {
  collectionId: string;
  collectionName: string;
  collectionDescription: string;
  isFavorite: boolean;
}

export function CollectionDetailActions({
  collectionId,
  collectionName,
  collectionDescription,
  isFavorite: initialFavorite,
}: Props) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isFav, setIsFav] = useState(initialFavorite);
  const [togglingFav, setTogglingFav] = useState(false);

  async function handleToggleFavorite() {
    setTogglingFav(true);
    const next = !isFav;
    setIsFav(next);
    const result = await toggleFavoriteCollection(collectionId);
    setTogglingFav(false);
    if (!result.success) {
      setIsFav(!next);
      toast.error("Failed to update favorite");
    } else {
      router.refresh();
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="size-3.5 mr-1.5" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="size-3.5 mr-1.5" />
          Delete
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleToggleFavorite}
          disabled={togglingFav}
          className={isFav ? "text-amber-400 border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400" : ""}
          title={isFav ? "Unfavorite" : "Favorite"}
        >
          <Star className={`size-3.5 ${isFav ? "fill-amber-400" : ""}`} />
        </Button>
      </div>

      <EditCollectionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        collectionId={collectionId}
        initialName={collectionName}
        initialDescription={collectionDescription}
      />

      <DeleteCollectionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        collectionId={collectionId}
        collectionName={collectionName}
        redirectOnDelete="/collections"
      />
    </>
  );
}
