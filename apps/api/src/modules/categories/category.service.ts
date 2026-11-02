import { AppError } from "../../common/http/AppError";
import { withId, withIds } from "../../common/http/serialize";
import { CategoryModel } from "./category.model";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";
import { ProductModel } from "../products/product.model";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function listCategories() {
  const docs = await CategoryModel.find().sort({ sortOrder: 1, "name.en": 1 }).lean();
  return withIds(docs as Array<Record<string, unknown> & { _id: string }>);
}

export async function getCategoryById(id: string) {
  const category = await CategoryModel.findById(id).lean();
  if (!category) {
    throw new AppError(404, "CATEGORY_NOT_FOUND", "Category not found");
  }
  return withId(category as Record<string, unknown> & { _id: string });
}

export async function createCategory(input: CreateCategoryInput) {
  const id = input.id ?? `cat_${slugify(input.slug)}`;
  const existingById = await CategoryModel.findById(id);
  const existingBySlug = await CategoryModel.findOne({ slug: input.slug });
  if (existingById || existingBySlug) {
    throw new AppError(409, "CATEGORY_EXISTS", "Category id or slug already exists");
  }

  const created = await CategoryModel.create({
    _id: id,
    slug: input.slug,
    name: input.name,
    description: input.description ?? { ar: null, en: null },
    sortOrder: input.sortOrder ?? 0,
  });

  return created.toJSON();
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const category = await CategoryModel.findById(id);
  if (!category) {
    throw new AppError(404, "CATEGORY_NOT_FOUND", "Category not found");
  }

  if (input.slug && input.slug !== category.slug) {
    const clash = await CategoryModel.findOne({ slug: input.slug, _id: { $ne: id } });
    if (clash) {
      throw new AppError(409, "CATEGORY_SLUG_EXISTS", "Category slug already exists");
    }
    category.slug = input.slug;
  }

  if (input.name) category.name = input.name;
  if (input.description) category.description = input.description;
  if (typeof input.sortOrder === "number") category.sortOrder = input.sortOrder;

  await category.save();
  return category.toJSON();
}

export async function deleteCategory(id: string) {
  const productCount = await ProductModel.countDocuments({
    categoryId: id,
    status: { $ne: "deleted" },
  });
  if (productCount > 0) {
    throw new AppError(
      409,
      "CATEGORY_HAS_PRODUCTS",
      "Cannot delete a category that still has products",
    );
  }

  const deleted = await CategoryModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(404, "CATEGORY_NOT_FOUND", "Category not found");
  }
  return { id, deleted: true };
}
