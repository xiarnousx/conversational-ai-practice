import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().trim().max(500, "Description is too long").nullable().optional(),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
