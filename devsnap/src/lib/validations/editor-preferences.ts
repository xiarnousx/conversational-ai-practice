import { z } from "zod";

export const editorPreferencesSchema = z.object({
  fontSize: z.number().int().min(10).max(24),
  tabSize: z.number().int().refine((v) => v === 2 || v === 4, {
    message: "tabSize must be 2 or 4",
  }),
  wordWrap: z.enum(["on", "off"]),
  minimap: z.boolean(),
  theme: z.enum(["vs-dark", "monokai", "github-dark"]),
});

export type EditorPreferencesInput = z.infer<typeof editorPreferencesSchema>;
