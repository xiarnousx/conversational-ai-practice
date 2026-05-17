"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { editorPreferencesSchema } from "@/lib/validations/editor-preferences";
import type { EditorPreferences } from "@/types/editor-preferences";

export async function updateEditorPreferences(
  prefs: EditorPreferences
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = editorPreferencesSchema.safeParse(prefs);
  if (!parsed.success) return { success: false, error: "Invalid preferences" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { editorPreferences: parsed.data },
  });

  return { success: true };
}
