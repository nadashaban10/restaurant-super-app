import { z } from "zod";

const localizedNullable = z.object({
  ar: z.string().nullable(),
  en: z.string().nullable(),
});

const localizedRequired = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
});

export const variantInputSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  name: localizedRequired,
  priceAmount: z.number().int().nonnegative(),
  priceEgp: z.number().nonnegative().optional(),
  isImplicit: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  isDefault: z.boolean().default(false),
});

export const productImageSchema = z.object({
  src: z.string().min(1),
  sourceFile: z.string().optional(),
  alt: localizedRequired.optional(),
});

export const productIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const productSlugParamsSchema = z.object({
  slug: z.string().min(1),
});

export const listProductsQuerySchema = z.object({
  status: z.enum(["unpublished", "published", "deleted"]).optional(),
  categoryId: z.string().optional(),
  featuredOnHome: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  ids: z.string().optional(),
  includeDeleted: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

const productFieldsSchema = z.object({
  id: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().min(1),
  title: localizedRequired,
  description: localizedNullable.optional(),
  status: z.enum(["unpublished", "published", "deleted"]).default("unpublished"),
  isAvailable: z.boolean().default(true),
  currency: z.literal("EGP").default("EGP"),
  discountType: z.enum(["none", "percent", "fixed"]).default("none"),
  discountValue: z.number().default(0),
  defaultVariantId: z.string().min(1).optional(),
  variants: z.array(variantInputSchema).min(1),
  images: z.array(productImageSchema).default([]),
  sortOrder: z.number().int().default(0),
  featuredOnHome: z.boolean().default(false),
});

function refineProductVariants(
  value: {
    variants: Array<{ id: string; isDefault: boolean }>;
    defaultVariantId?: string;
  },
  ctx: z.RefinementCtx,
) {
  const variantIds = value.variants.map((v) => v.id);
  if (new Set(variantIds).size !== variantIds.length) {
    ctx.addIssue({ code: "custom", message: "Variant ids must be unique", path: ["variants"] });
  }
  const defaults = value.variants.filter((v) => v.isDefault);
  if (defaults.length > 1) {
    ctx.addIssue({
      code: "custom",
      message: "Only one variant can be default",
      path: ["variants"],
    });
  }
  if (value.defaultVariantId && !variantIds.includes(value.defaultVariantId)) {
    ctx.addIssue({
      code: "custom",
      message: "defaultVariantId must match a variant id",
      path: ["defaultVariantId"],
    });
  }
}

export const createProductSchema = productFieldsSchema.superRefine(refineProductVariants);

export const updateProductSchema = productFieldsSchema
  .partial()
  .superRefine((value, ctx) => {
    if (Object.keys(value).length === 0) {
      ctx.addIssue({ code: "custom", message: "At least one field is required" });
    }
    if (value.variants) {
      refineProductVariants(
        {
          variants: value.variants,
          defaultVariantId: value.defaultVariantId,
        },
        ctx,
      );
    }
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
