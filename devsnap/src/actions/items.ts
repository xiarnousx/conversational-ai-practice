"use server";

import { requireUserId } from "@/lib/auth-guard";
import { updateItem as dbUpdateItem, deleteItemById, createItemInDb, toggleItemFavorite, toggleItemPin } from "@/lib/db/items";
import type { ItemDetail } from "@/lib/db/items";
import { updateItemSchema, createItemSchema } from "@/lib/validations/items";
import type { UpdateItemInput, CreateItemInput } from "@/lib/validations/items";
import { deleteFromS3, keyFromUrl } from "@/lib/s3";
import { getUserLimits } from "@/lib/db/limits";
import type { ActionResult } from "@/types/action-result";
import { fail } from "@/types/action-result";

export type UpdateItemResult = ActionResult<ItemDetail>;
export type CreateItemResult = ActionResult<ItemDetail>;
export type DeleteItemResult = ActionResult;

export type ToggleFavoriteItemResult =
  | { success: true; isFavorite: boolean }
  | { success: false; error: string };

export type TogglePinItemResult =
  | { success: true; isPinned: boolean }
  | { success: false; error: string };

export async function updateItem(
  itemId: string,
  input: UpdateItemInput
): Promise<UpdateItemResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  const parsed = updateItemSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const updated = await dbUpdateItem(guard.userId, itemId, {
      ...parsed.data,
      collectionIds: parsed.data.collectionIds ?? [],
    });
    if (!updated) return fail("Item not found");
    return { success: true, data: updated };
  } catch {
    return fail("Failed to update item. Please try again.");
  }
}

export async function createItem(input: CreateItemInput): Promise<CreateItemResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  const parsed = createItemSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const limits = await getUserLimits(guard.userId);
  if (limits.atItemLimit) {
    return fail("Free plan limit reached (50 items). Upgrade to Pro for unlimited items.");
  }

  if (parsed.data.fileUrl) {
    const expectedPrefix = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/uploads/${guard.userId}/`;
    if (!parsed.data.fileUrl.startsWith(expectedPrefix)) {
      return fail("Invalid file URL");
    }
  }

  try {
    const item = await createItemInDb(guard.userId, {
      ...parsed.data,
      collectionIds: parsed.data.collectionIds ?? [],
    });
    if (!item) return fail("Failed to create item");
    return { success: true, data: item };
  } catch {
    return fail("Failed to create item. Please try again.");
  }
}

export async function toggleFavoriteItem(itemId: string): Promise<ToggleFavoriteItemResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  const result = await toggleItemFavorite(guard.userId, itemId);
  if (result === null) return fail("Item not found");

  return { success: true, isFavorite: result };
}

export async function togglePinItem(itemId: string): Promise<TogglePinItemResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  const result = await toggleItemPin(guard.userId, itemId);
  if (result === null) return fail("Item not found");

  return { success: true, isPinned: result };
}

export async function deleteItem(itemId: string): Promise<DeleteItemResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  const result = await deleteItemById(guard.userId, itemId);
  if (!result.deleted) return fail("Item not found");

  if (result.fileUrl) {
    try {
      await deleteFromS3(keyFromUrl(result.fileUrl));
    } catch {
      // best-effort — item is already deleted from DB
    }
  }

  return { success: true, data: undefined };
}
