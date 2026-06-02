import { z } from "zod";

export const titleField = z.string().trim().min(1, "Title is required");
export const descriptionField = z.string().trim().nullable().optional();
export const tagsField = z.array(z.string().trim().min(1)).default([]);
export const collectionIdsField = z.array(z.string()).default([]);

export const collectionBaseFields = {
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().trim().max(500, "Description is too long").nullable().optional(),
};
