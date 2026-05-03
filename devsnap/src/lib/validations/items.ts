import { z } from "zod";

export const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().nullable().optional(),
  content: z.string().trim().nullable().optional(),
  language: z.string().trim().nullable().optional(),
  url: z.string().trim().url({ message: "Must be a valid URL" }).nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
