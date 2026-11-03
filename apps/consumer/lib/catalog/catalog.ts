import seed from "../../data/menu-seed.json";
import { catalogSchema, type CartLineInput, type Product } from "./schema";
import {
  getDefaultVariant,
  hasMultipleVariants,
  priceVariant,
  type Money,
} from "./pricing";

const catalog = catalogSchema.parse(seed);
const MAX_PROMO_BANNERS = 3;

function resolveBannerSrc(image?: string, file?: string) {
  if (image && image.length > 0) return image;
  if (file && file.length > 0) {
    return file.replace(/^docs\/brand\/assets\//, "/brand/");
  }
  return "/brand/placeholder-banner.svg";
}

export type PromoBanner = {
  id: string;
  src: string;
  link: string;
  title: { ar: string; en: string };
  price: Money | null;
  discountType: Product["discountType"];
  discountValue: number;
};

export function getCatalog() {
  const products = catalog.products.filter((p) => p.status === "published");
  return {
    ...catalog,
    products,
    heroSrc: "/brand/banners/hero-grill.jpg",
    banners: (catalog.banners ?? []).map((b) => ({
      ...b,
      src: resolveBannerSrc(b.image, b.file),
    })),
  };
}

export function getCategories() {
  return [...getCatalog().categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Category cards for home: counts + a representative product image when available. */
export function getCategoryCards() {
  const products = getPublishedProducts();
  return getCategories().map((category) => {
    const inCategory = products.filter((p) => p.categoryId === category.id);
    const withImage = inCategory.find((p) => p.images[0]?.src);
    return {
      ...category,
      productCount: inCategory.length,
      image: withImage?.images[0]?.src ?? null,
    };
  });
}

export function getPublishedProducts(): Product[] {
  return getCatalog().products;
}

export function getFeaturedProducts(): Product[] {
  return getPublishedProducts().filter((p) => p.featuredOnHome);
}

export function getPromoBanners(): PromoBanner[] {
  const catalog = getCatalog();
  const seen = new Set<string>();
  const fromSeed: PromoBanner[] = [];

  for (const [index, banner] of catalog.banners.entries()) {
    const product = banner.productId ? getProductById(banner.productId) : undefined;
    if (banner.productId && !product) continue;

    const variant = product ? getDefaultVariant(product) : undefined;
    const price = product && variant ? priceVariant(product, variant) : null;
    if (price && price.discountAmount <= 0) continue;

    const id = product?.id ?? `banner-${index}`;
    seen.add(id);
    fromSeed.push({
      id,
      src: banner.src,
      link: product ? `/menu/${product.slug}` : banner.link,
      title: product?.title ?? banner.title,
      price,
      discountType: product?.discountType ?? "none",
      discountValue: product?.discountValue ?? 0,
    });
  }

  if (fromSeed.length >= MAX_PROMO_BANNERS) {
    return fromSeed.slice(0, MAX_PROMO_BANNERS);
  }

  const extras = getPublishedProducts()
    .filter((product) => product.isAvailable && !seen.has(product.id))
    .map((product) => {
      const variant = getDefaultVariant(product);
      const price = priceVariant(product, variant);
      return { product, price };
    })
    .filter(({ price }) => price.discountAmount > 0)
    .slice(0, MAX_PROMO_BANNERS - fromSeed.length)
    .map(({ product, price }) => ({
      id: product.id,
      src: product.images[0]?.src || "/brand/placeholder-banner.svg",
      link: `/menu/${product.slug}`,
      title: product.title,
      price,
      discountType: product.discountType,
      discountValue: product.discountValue,
    }));

  return [...fromSeed, ...extras];
}

export function getProductsByCategory(categoryId?: string): Product[] {
  const products = getPublishedProducts();
  if (!categoryId) return products;
  return products.filter((p) => p.categoryId === categoryId);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getPublishedProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getPublishedProducts().find((p) => p.id === id);
}

export function toCardPayload(product: Product) {
  const variant = getDefaultVariant(product);
  const price = priceVariant(product, variant);
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    image: product.images[0]?.src ?? null,
    isAvailable: product.isAvailable,
    hasMultipleVariants: hasMultipleVariants(product),
    defaultVariant: {
      id: variant.id,
      name: variant.name,
      price,
    },
  };
}

export type CartQuoteLine = {
  productId: string;
  variantId: string;
  slug: string;
  title: { ar: string; en: string };
  variantName: { ar: string; en: string };
  isImplicit: boolean;
  image: string | null;
  quantity: number;
  unitOriginalAmount: number;
  unitFinalAmount: number;
  lineOriginalAmount: number;
  lineFinalAmount: number;
  isAvailable: boolean;
  status: Product["status"];
};

export type CartQuote = {
  currency: "EGP";
  items: CartQuoteLine[];
  unavailableItemIds: string[];
  subtotalOriginalAmount: number;
  subtotalFinalAmount: number;
  deliveryFeeAmount: number;
  totalAmount: number;
};

export function quoteCart(items: CartLineInput[]): CartQuote {
  const quoted: CartQuoteLine[] = [];
  const unavailableItemIds: string[] = [];
  let subtotalOriginalAmount = 0;
  let subtotalFinalAmount = 0;

  for (const line of items) {
    const product = getProductById(line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (
      !product ||
      !variant ||
      product.status !== "published" ||
      !product.isAvailable
    ) {
      unavailableItemIds.push(`${line.productId}:${line.variantId}`);
      quoted.push({
        productId: line.productId,
        variantId: line.variantId,
        slug: product?.slug ?? "",
        title: product?.title ?? { ar: "", en: "" },
        variantName: variant?.name ?? { ar: "", en: "" },
        isImplicit: variant?.isImplicit ?? true,
        image: product?.images[0]?.src ?? null,
        quantity: line.quantity,
        unitOriginalAmount: 0,
        unitFinalAmount: 0,
        lineOriginalAmount: 0,
        lineFinalAmount: 0,
        isAvailable: false,
        status: product?.status ?? "deleted",
      });
      continue;
    }
    const unit = priceVariant(product, variant);
    const quantity = line.quantity;
    const lineOriginalAmount = unit.originalAmount * quantity;
    const lineFinalAmount = unit.finalAmount * quantity;
    subtotalOriginalAmount += lineOriginalAmount;
    subtotalFinalAmount += lineFinalAmount;
    quoted.push({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      title: product.title,
      variantName: variant.name,
      isImplicit: variant.isImplicit,
      image: product.images[0]?.src ?? null,
      quantity,
      unitOriginalAmount: unit.originalAmount,
      unitFinalAmount: unit.finalAmount,
      lineOriginalAmount,
      lineFinalAmount,
      isAvailable: true,
      status: product.status,
    });
  }

  return {
    currency: "EGP",
    items: quoted,
    unavailableItemIds,
    subtotalOriginalAmount,
    subtotalFinalAmount,
    deliveryFeeAmount: 0,
    totalAmount: subtotalFinalAmount,
  };
}

export const catalogQueryKey = ["catalog"] as const;
export const productQueryKey = (slug: string) => ["product", slug] as const;
