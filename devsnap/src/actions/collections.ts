"use server";

import { auth } from "@/auth";
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

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type CreateCollectionResult = ActionResult<CollectionCardData>;
export type UpdateCollectionResult = ActionResult<CollectionCardData>;
export type DeleteCollectionResult = ActionResult;
export type ToggleFavoriteCollectionResult =
  | { success: true; isFavorite: boolean }
  | { success: false; error: string };

export async function toggleFavoriteCollection(
  collectionId: string
): Promise<ToggleFavoriteCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const result = await toggleCollectionFavorite(session.user.id, collectionId);
  if (result === null) return { success: false, error: "Collection not found" };

  return { success: true, isFavorite: result };
}

export async function createCollection(
  input: CreateCollectionInput
): Promise<CreateCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = createCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const limits = await getUserLimits(session.user.id);
  if (limits.atCollectionLimit) {
    return { success: false, error: "Free plan limit reached (3 collections). Upgrade to Pro for unlimited collections." };
  }

  try {
    const collection = await createCollectionInDb(session.user.id, parsed.data);
    return { success: true, data: collection };
  } catch {
    return { success: false, error: "Failed to create collection. Please try again." };
  }
}

export async function updateCollection(
  collectionId: string,
  input: UpdateCollectionInput
): Promise<UpdateCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = updateCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const collection = await updateCollectionInDb(session.user.id, collectionId, parsed.data);
  if (!collection) return { success: false, error: "Collection not found" };
  return { success: true, data: collection };
}

export async function deleteCollection(
  collectionId: string
): Promise<DeleteCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await deleteCollectionInDb(session.user.id, collectionId);
  return { success: true, data: undefined };
}
