import { AppError } from "../../common/http/AppError";
import { withId, withIds } from "../../common/http/serialize";
import { CategoryModel } from "../categories/category.model";
import { ProductModel } from "./product.model";
import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from "./product.schema";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeVariants(variants: CreateProductInput["variants"], defaultVariantId?: string) {
  const withPrices = variants.map((variant) => ({
    ...variant,
    priceEgp: variant.priceEgp ?? variant.priceAmount / 100,
  }));

  let resolvedDefault = defaultVariantId;
  if (!resolvedDefault) {
    const marked = withPrices.find((v) => v.isDefault);
    resolvedDefault = marked?.id ?? withPrices[0].id;
  }

  return {
    defaultVariantId: resolvedDefault,
    variants: withPrices.map((variant) => ({
      ...variant,
      isDefault: variant.id === resolvedDefault,
    })),
  };
}

async function assertCategoryExists(categoryId: string) {
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw new AppError(400, "INVALID_CATEGORY", "categoryId does not exist");
  }
}

export async function listProducts(query: ListProductsQuery) {
  const filter: Record<string, unknown> = {};

  if (query.ids) {
    filter._id = { $in: query.ids.split(",").map((id) => id.trim()).filter(Boolean) };
  }
  if (query.categoryId) filter.categoryId = query.categoryId;
  if (typeof query.featuredOnHome === "boolean") filter.featuredOnHome = query.featuredOnHome;

  if (query.status) {
    filter.status = query.status;
  } else if (!query.includeDeleted) {
    filter.status = { $ne: "deleted" };
  }

  const docs = await ProductModel.find(filter).sort({ sortOrder: 1, "title.en": 1 }).lean();
  return withIds(docs as Array<Record<string, unknown> & { _id: string }>);
}

export async function getProductById(id: string) {
  const product = await ProductModel.findById(id).lean();
  if (!product || product.status === "deleted") {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  return withId(product as Record<string, unknown> & { _id: string });
}

export async function getProductBySlug(slug: string) {
  const product = await ProductModel.findOne({ slug, status: { $ne: "deleted" } }).lean();
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  return withId(product as Record<string, unknown> & { _id: string });
}

export async function createProduct(input: CreateProductInput) {
  await assertCategoryExists(input.categoryId);

  const id = input.id ?? `prod_${slugify(input.slug)}`;
  const existingById = await ProductModel.findById(id);
  const existingBySlug = await ProductModel.findOne({ slug: input.slug });
  if (existingById || existingBySlug) {
    throw new AppError(409, "PRODUCT_EXISTS", "Product id or slug already exists");
  }

  const { defaultVariantId, variants } = normalizeVariants(input.variants, input.defaultVariantId);

  const created = await ProductModel.create({
    _id: id,
    slug: input.slug,
    categoryId: input.categoryId,
    title: input.title,
    description: input.description ?? { ar: null, en: null },
    status: input.status ?? "unpublished",
    isAvailable: input.isAvailable ?? true,
    currency: "EGP",
    discountType: input.discountType ?? "none",
    discountValue: input.discountValue ?? 0,
    defaultVariantId,
    variants,
    images: input.images ?? [],
    sortOrder: input.sortOrder ?? 0,
    featuredOnHome: input.featuredOnHome ?? false,
  });

  return created.toJSON();
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const product = await ProductModel.findById(id);
  if (!product || product.status === "deleted") {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }

  if (input.categoryId) {
    await assertCategoryExists(input.categoryId);
    product.categoryId = input.categoryId;
  }

  if (input.slug && input.slug !== product.slug) {
    const clash = await ProductModel.findOne({ slug: input.slug, _id: { $ne: id } });
    if (clash) {
      throw new AppError(409, "PRODUCT_SLUG_EXISTS", "Product slug already exists");
    }
    product.slug = input.slug;
  }

  if (input.title) product.title = input.title;
  if (input.description) product.description = input.description;
  if (input.status) product.status = input.status;
  if (typeof input.isAvailable === "boolean") product.isAvailable = input.isAvailable;
  if (input.discountType) product.discountType = input.discountType;
  if (typeof input.discountValue === "number") product.discountValue = input.discountValue;
  if (typeof input.sortOrder === "number") product.sortOrder = input.sortOrder;
  if (typeof input.featuredOnHome === "boolean") product.featuredOnHome = input.featuredOnHome;
  if (input.images) product.images = input.images as typeof product.images;

  if (input.variants) {
    const { defaultVariantId, variants } = normalizeVariants(
      input.variants as CreateProductInput["variants"],
      input.defaultVariantId ?? String(product.defaultVariantId),
    );
    product.variants = variants as typeof product.variants;
    product.defaultVariantId = defaultVariantId;
  } else if (input.defaultVariantId) {
    const exists = product.variants.some((v) => v.id === input.defaultVariantId);
    if (!exists) {
      throw new AppError(400, "INVALID_DEFAULT_VARIANT", "defaultVariantId must match a variant id");
    }
    product.defaultVariantId = input.defaultVariantId;
    product.variants.forEach((variant) => {
      variant.isDefault = variant.id === input.defaultVariantId;
    });
  }

  await product.save();
  return product.toJSON();
}

export async function softDeleteProduct(id: string) {
  const product = await ProductModel.findById(id);
  if (!product || product.status === "deleted") {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  product.status = "deleted";
  product.isAvailable = false;
  await product.save();
  return { id, deleted: true };
}
