import { z } from "zod";
import { collectionBaseFields } from "./shared";

export const createCollectionSchema = z.object(collectionBaseFields);
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;

export const updateCollectionSchema = z.object(collectionBaseFields);
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
