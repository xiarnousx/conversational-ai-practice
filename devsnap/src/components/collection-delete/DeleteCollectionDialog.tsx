"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteCollection } from "@/actions/collections";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  collectionName: string;
  redirectOnDelete?: string;
}

export function DeleteCollectionDialog({
  open,
  onOpenChange,
  collectionId,
  collectionName,
  redirectOnDelete,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteCollection(collectionId);
    setDeleting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Collection deleted");
    onOpenChange(false);
    if (redirectOnDelete) {
      router.push(redirectOnDelete);
    } else {
      router.refresh();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{collectionName}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            The collection will be deleted. Items inside it will not be deleted — they will
            simply be removed from this collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
