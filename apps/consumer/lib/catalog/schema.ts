import { z } from "zod";

const localized = z.object({
  ar: z.string().nullable(),
  en: z.string().nullable(),
});

export const variantSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.object({ ar: z.string(), en: z.string() }),
  priceAmount: z.number().int().nonnegative(),
  priceEgp: z.number().nonnegative(),
  isImplicit: z.boolean(),
  sortOrder: z.number().int(),
  isDefault: z.boolean(),
});

export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  categoryId: z.string(),
  title: z.object({ ar: z.string(), en: z.string() }),
  description: localized,
  status: z.enum(["unpublished", "published", "deleted"]),
  isAvailable: z.boolean(),
  currency: z.literal("EGP"),
  discountType: z.enum(["none", "percent", "fixed"]),
  discountValue: z.number(),
  defaultVariantId: z.string(),
  variants: z.array(variantSchema).min(1),
  images: z.array(
    z.object({
      src: z.string(),
      sourceFile: z.string().optional(),
      alt: z.object({ ar: z.string(), en: z.string() }).optional(),
    }),
  ),
  sortOrder: z.number().int(),
  featuredOnHome: z.boolean(),
});

export const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.object({ ar: z.string(), en: z.string() }),
  description: localized,
  sortOrder: z.number().int(),
});

export const catalogSchema = z.object({
  restaurantId: z.string(),
  currency: z.literal("EGP"),
  categories: z.array(categorySchema),
  products: z.array(productSchema),
  hero: z
    .object({
      file: z.string(),
      source: z.string().optional(),
      why: z.string().optional(),
    })
    .optional(),
  banners: z
    .array(
      z.object({
        image: z.string().optional(),
        file: z.string().optional(),
        link: z.string(),
        title: z.object({ ar: z.string(), en: z.string() }),
        productId: z.string().optional(),
      }),
    )
    .optional(),
});

export const cartLineInputSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().min(1).max(99),
});

export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Variant = z.infer<typeof variantSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export type CartLineInput = z.infer<typeof cartLineInputSchema>;
