"use server";

import { auth } from "@/auth";
import {
  createCollectionInDb,
  updateCollectionInDb,
  deleteCollectionInDb,
} from "@/lib/db/collections";
import type { CollectionCardData } from "@/lib/db/collections";
import {
  createCollectionSchema,
  updateCollectionSchema,
} from "@/lib/validations/collections";
import type { CreateCollectionInput, UpdateCollectionInput } from "@/lib/validations/collections";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type CreateCollectionResult = ActionResult<CollectionCardData>;
export type UpdateCollectionResult = ActionResult<CollectionCardData>;
export type DeleteCollectionResult = ActionResult;

export async function createCollection(
  input: CreateCollectionInput
): Promise<CreateCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = createCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const collection = await createCollectionInDb(session.user.id, parsed.data);
  return { success: true, data: collection };
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
