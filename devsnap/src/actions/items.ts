"use server";

import { auth } from "@/auth";
import { updateItem as dbUpdateItem, deleteItemById, createItemInDb, toggleItemFavorite } from "@/lib/db/items";
import type { ItemDetail } from "@/lib/db/items";
import { updateItemSchema, createItemSchema } from "@/lib/validations/items";
import type { UpdateItemInput, CreateItemInput } from "@/lib/validations/items";
import { deleteFromS3, keyFromUrl } from "@/lib/s3";

export type UpdateItemResult =
  | { success: true; data: ItemDetail }
  | { success: false; error: string };

export async function updateItem(
  itemId: string,
  input: UpdateItemInput
): Promise<UpdateItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const updated = await dbUpdateItem(session.user.id, itemId, {
    ...parsed.data,
    collectionIds: parsed.data.collectionIds ?? [],
  });
  if (!updated) {
    return { success: false, error: "Item not found" };
  }

  return { success: true, data: updated };
}

export type CreateItemResult =
  | { success: true; data: ItemDetail }
  | { success: false; error: string };

export async function createItem(input: CreateItemInput): Promise<CreateItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = createItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (parsed.data.fileUrl) {
    const expectedPrefix = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/uploads/${session.user.id}/`;
    if (!parsed.data.fileUrl.startsWith(expectedPrefix)) {
      return { success: false, error: "Invalid file URL" };
    }
  }

  const item = await createItemInDb(session.user.id, {
    ...parsed.data,
    collectionIds: parsed.data.collectionIds ?? [],
  });
  if (!item) {
    return { success: false, error: "Failed to create item" };
  }

  return { success: true, data: item };
}

export type ToggleFavoriteItemResult =
  | { success: true; isFavorite: boolean }
  | { success: false; error: string };

export async function toggleFavoriteItem(itemId: string): Promise<ToggleFavoriteItemResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const result = await toggleItemFavorite(session.user.id, itemId);
  if (result === null) return { success: false, error: "Item not found" };

  return { success: true, isFavorite: result };
}

export type DeleteItemResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteItem(itemId: string): Promise<DeleteItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await deleteItemById(session.user.id, itemId);
  if (!result.deleted) {
    return { success: false, error: "Item not found" };
  }

  if (result.fileUrl) {
    try {
      await deleteFromS3(keyFromUrl(result.fileUrl));
    } catch {
      // best-effort — item is already deleted from DB
    }
  }

  return { success: true };
}
