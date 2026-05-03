"use server";

import { auth } from "@/auth";
import { updateItem as dbUpdateItem, deleteItemById } from "@/lib/db/items";
import type { ItemDetail } from "@/lib/db/items";
import { updateItemSchema } from "@/lib/validations/items";
import type { UpdateItemInput } from "@/lib/validations/items";

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

  const updated = await dbUpdateItem(session.user.id, itemId, parsed.data);
  if (!updated) {
    return { success: false, error: "Item not found" };
  }

  return { success: true, data: updated };
}

export type DeleteItemResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteItem(itemId: string): Promise<DeleteItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const deleted = await deleteItemById(session.user.id, itemId);
  if (!deleted) {
    return { success: false, error: "Item not found" };
  }

  return { success: true };
}
