"use client";

import { useState } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditCollectionDialog } from "@/components/collection-edit/EditCollectionDialog";
import { DeleteCollectionDialog } from "@/components/collection-delete/DeleteCollectionDialog";

interface Props {
  collectionId: string;
  collectionName: string;
  collectionDescription: string;
}

export function CollectionDetailActions({
  collectionId,
  collectionName,
  collectionDescription,
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
        <Button size="sm" variant="outline" disabled title="Favorite (coming soon)">
          <Star className="size-3.5" />
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
