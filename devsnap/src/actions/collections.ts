"use server";

import { requireUserId } from "@/lib/auth-guard";
import {
  createCollectionInDb,
  updateCollectionInDb,
  deleteCollectionInDb,
  toggleCollectionFavorite,
} from "@/lib/db/collections";
import type { CollectionCardData } from "@/lib/db/collections";
import {
  createCollectionSchema,
  updateCollectionSchema,
} from "@/lib/validations/collections";
import type { CreateCollectionInput, UpdateCollectionInput } from "@/lib/validations/collections";
import { getUserLimits } from "@/lib/db/limits";
import type { ActionResult } from "@/types/action-result";
import { fail } from "@/types/action-result";

export type CreateCollectionResult = ActionResult<CollectionCardData>;
export type UpdateCollectionResult = ActionResult<CollectionCardData>;
export type DeleteCollectionResult = ActionResult;
export type ToggleFavoriteCollectionResult =
  | { success: true; isFavorite: boolean }
  | { success: false; error: string };

export async function toggleFavoriteCollection(
  collectionId: string
): Promise<ToggleFavoriteCollectionResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  const result = await toggleCollectionFavorite(guard.userId, collectionId);
  if (result === null) return fail("Collection not found");

  return { success: true, isFavorite: result };
}

export async function createCollection(
  input: CreateCollectionInput
): Promise<CreateCollectionResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  const parsed = createCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const limits = await getUserLimits(guard.userId);
  if (limits.atCollectionLimit) {
    return fail("Free plan limit reached (3 collections). Upgrade to Pro for unlimited collections.");
  }

  try {
    const collection = await createCollectionInDb(guard.userId, parsed.data);
    return { success: true, data: collection };
  } catch {
    return fail("Failed to create collection. Please try again.");
  }
}

export async function updateCollection(
  collectionId: string,
  input: UpdateCollectionInput
): Promise<UpdateCollectionResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  const parsed = updateCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const collection = await updateCollectionInDb(guard.userId, collectionId, parsed.data);
  if (!collection) return fail("Collection not found");
  return { success: true, data: collection };
}

export async function deleteCollection(
  collectionId: string
): Promise<DeleteCollectionResult> {
  const guard = await requireUserId();
  if (!guard.ok) return fail(guard.error);

  await deleteCollectionInDb(guard.userId, collectionId);
  return { success: true, data: undefined };
}
