import { z } from "zod";

const localizedNullable = z.object({
  ar: z.string().nullable(),
  en: z.string().nullable(),
});

const localizedRequired = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
});

export const categoryIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const createCategorySchema = z.object({
  id: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: localizedRequired,
  description: localizedNullable.optional(),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field is required" },
);

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
