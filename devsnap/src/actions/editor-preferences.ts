"use server";

import { requireUserId } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { editorPreferencesSchema } from "@/lib/validations/editor-preferences";
import type { EditorPreferences } from "@/types/editor-preferences";

export async function updateEditorPreferences(
  prefs: EditorPreferences
): Promise<{ success: boolean; error?: string }> {
  const guard = await requireUserId();
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = editorPreferencesSchema.safeParse(prefs);
  if (!parsed.success) return { success: false, error: "Invalid preferences" };

  await prisma.user.update({
    where: { id: guard.userId },
    data: { editorPreferences: parsed.data },
  });

  return { success: true };
}
