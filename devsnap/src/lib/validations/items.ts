import { z } from "zod";
import { titleField, descriptionField, tagsField, collectionIdsField } from "./shared";

export const updateItemSchema = z.object({
  title: titleField,
  description: descriptionField,
  content: z.string().trim().nullable().optional(),
  language: z.string().trim().nullable().optional(),
  url: z.string().trim().url({ message: "Must be a valid URL" }).nullable().optional(),
  tags: tagsField,
  collectionIds: collectionIdsField,
});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;

const ITEM_TYPE_NAMES = ["snippet", "prompt", "command", "note", "link", "file", "image"] as const;

export const createItemSchema = z
  .object({
    title: titleField,
    typeName: z.enum(ITEM_TYPE_NAMES, { error: "Type is required" }),
    description: descriptionField,
    content: z.string().trim().nullable().optional(),
    language: z.string().trim().nullable().optional(),
    url: z
      .string()
      .trim()
      .url({ message: "Must be a valid URL" })
      .nullable()
      .optional(),
    fileUrl: z.string().trim().nullable().optional(),
    fileName: z.string().trim().nullable().optional(),
    fileSize: z.number().int().positive().nullable().optional(),
    tags: tagsField,
    collectionIds: collectionIdsField,
  })
  .refine((data) => data.typeName !== "link" || !!data.url, {
    message: "URL is required for link type",
    path: ["url"],
  })
  .refine(
    (data) =>
      (data.typeName !== "file" && data.typeName !== "image") || !!data.fileUrl,
    {
      message: "A file must be uploaded",
      path: ["fileUrl"],
    }
  );

export type CreateItemInput = z.infer<typeof createItemSchema>;
