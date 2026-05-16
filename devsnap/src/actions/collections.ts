"use server";

import { auth } from "@/auth";
import { createCollectionInDb } from "@/lib/db/collections";
import type { CollectionCardData } from "@/lib/db/collections";
import { createCollectionSchema } from "@/lib/validations/collections";
import type { CreateCollectionInput } from "@/lib/validations/collections";

export type CreateCollectionResult =
  | { success: true; data: CollectionCardData }
  | { success: false; error: string };

export async function createCollection(
  input: CreateCollectionInput
): Promise<CreateCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = createCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const collection = await createCollectionInDb(session.user.id, parsed.data);
  return { success: true, data: collection };
}
