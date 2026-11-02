import fs from "node:fs";
import path from "node:path";
import { connectDb } from "../db/connection";
import { CategoryModel } from "../modules/categories/category.model";
import { ProductModel } from "../modules/products/product.model";

type SeedFile = {
  categories: Array<{
    id: string;
    slug: string;
    name: { ar: string; en: string };
    description: { ar: string | null; en: string | null };
    sortOrder: number;
  }>;
  products: Array<{
    id: string;
    slug: string;
    categoryId: string;
    title: { ar: string; en: string };
    description: { ar: string | null; en: string | null };
    status: "unpublished" | "published" | "deleted";
    isAvailable: boolean;
    currency: "EGP";
    discountType: "none" | "percent" | "fixed";
    discountValue: number;
    defaultVariantId: string;
    variants: Array<{
      id: string;
      code: string;
      name: { ar: string; en: string };
      priceAmount: number;
      priceEgp: number;
      isImplicit: boolean;
      sortOrder: number;
      isDefault: boolean;
    }>;
    images: Array<{
      src: string;
      sourceFile?: string;
      alt?: { ar: string; en: string };
    }>;
    sortOrder: number;
    featuredOnHome: boolean;
  }>;
};

async function seed() {
  await connectDb();

  const seedPath = path.resolve(process.cwd(), "../../docs/data/menu-seed.json");
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found at ${seedPath}`);
  }

  const raw = JSON.parse(fs.readFileSync(seedPath, "utf8")) as SeedFile;

  await CategoryModel.deleteMany({});
  await ProductModel.deleteMany({});

  await CategoryModel.insertMany(
    raw.categories.map((category) => ({
      _id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      sortOrder: category.sortOrder,
    })),
  );

  await ProductModel.insertMany(
    raw.products.map((product) => ({
      _id: product.id,
      slug: product.slug,
      categoryId: product.categoryId,
      title: product.title,
      description: product.description,
      status: product.status,
      isAvailable: product.isAvailable,
      currency: product.currency,
      discountType: product.discountType,
      discountValue: product.discountValue,
      defaultVariantId: product.defaultVariantId,
      variants: product.variants,
      images: product.images,
      sortOrder: product.sortOrder,
      featuredOnHome: product.featuredOnHome,
    })),
  );

  console.log(
    `Seeded ${raw.categories.length} categories and ${raw.products.length} products`,
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
