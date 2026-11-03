import { getCategories, getPublishedProducts } from "@/lib/catalog/catalog";
import type { Product } from "@/lib/catalog/schema";
import { addonGroups, recommendationRules, riceRowLeadIn, type AddonGroupId } from "./rules";

export type RecommendationAnchor = {
  id: string;
  categorySlug: string;
};

function unique(ids: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

function categoryProductIds(
  slug: string,
  products: Product[],
  slugOf: (product: Product) => string,
): string[] {
  const preferred = recommendationRules.priority[slug] ?? [];
  if (recommendationRules.closedCategories.includes(slug)) return preferred;

  const rest = products
    .filter((product) => slugOf(product) === slug && !preferred.includes(product.id))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((product) => product.id);

  return [...preferred, ...rest];
}

function candidatesFor(anchor: RecommendationAnchor, products: Product[], slugOf: (product: Product) => string): string[] {
  const explicit = recommendationRules.pairsWith[anchor.id] ?? [];
  const categories = recommendationRules.complements[anchor.categorySlug] ?? [];
  const lists = categories.map((slug) => categoryProductIds(slug, products, slugOf));
  const mixed: string[] = [];
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const list of lists) {
      const next = list.shift();
      if (!next) continue;
      mixed.push(next);
      progressed = true;
    }
  }
  return unique([...explicit, ...mixed]);
}

/**
 * Complementary products for the dishes the customer already chose.
 * Explicit pairs come first, then category rules. Items already chosen,
 * unavailable dishes, and the anchors themselves are left out.
 * Pass the newest dish first so it leads the mix.
 */
export function recommendProducts(
  anchors: RecommendationAnchor[],
  products: Product[],
  categorySlugByProductId: Map<string, string>,
  excludeIds: Iterable<string>,
  limit: number,
): Product[] {
  if (limit < 1 || anchors.length === 0) return [];

  const slugOf = (product: Product) => categorySlugByProductId.get(product.id) ?? "";
  const lists = anchors.map((anchor) => candidatesFor(anchor, products, slugOf));
  const byId = new Map(products.map((product) => [product.id, product]));
  const seen = new Set(excludeIds);
  for (const anchor of anchors) seen.add(anchor.id);

  const picked: Product[] = [];
  let progressed = true;
  while (picked.length < limit && progressed) {
    progressed = false;
    for (const list of lists) {
      while (list.length > 0) {
        const id = list.shift() as string;
        if (seen.has(id)) continue;
        seen.add(id);
        const product = byId.get(id);
        if (!product || !product.isAvailable || product.status !== "published") continue;
        picked.push(product);
        progressed = true;
        break;
      }
      if (picked.length >= limit) break;
    }
  }

  return picked;
}

/** `productIds` are oldest first, matching the cart. The latest dish leads. */
export function recommendForProducts(productIds: string[], excludeIds: string[], limit: number): Product[] {
  const products = getPublishedProducts();
  const slugByCategory = new Map(getCategories().map((category) => [category.id, category.slug]));
  const categorySlugByProductId = new Map(
    products.map((product) => [product.id, slugByCategory.get(product.categoryId) ?? ""]),
  );
  const byId = new Map(products.map((product) => [product.id, product]));
  const anchors = [...productIds]
    .reverse()
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product))
    .map((product) => ({
      id: product.id,
      categorySlug: categorySlugByProductId.get(product.id) ?? "",
    }));

  return recommendProducts(anchors, products, categorySlugByProductId, excludeIds, limit);
}

export type AddonGroup = {
  id: AddonGroupId;
  products: Product[];
};

function catalogIndex() {
  const products = getPublishedProducts();
  const slugByCategory = new Map(getCategories().map((category) => [category.id, category.slug]));
  const categorySlugByProductId = new Map(
    products.map((product) => [product.id, slugByCategory.get(product.categoryId) ?? ""]),
  );
  const byId = new Map(products.map((product) => [product.id, product]));
  return { products, categorySlugByProductId, byId };
}

function anchorsFor(productIds: string[], byId: Map<string, Product>, categorySlugByProductId: Map<string, string>) {
  return productIds
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product))
    .map((product) => ({
      id: product.id,
      categorySlug: categorySlugByProductId.get(product.id) ?? "",
    }));
}

/** Rice, pasta, salads, and drinks as separate rows. Items already chosen are left out. */
export function recommendAddonGroups(productIds: string[], excludeIds: string[]): AddonGroup[] {
  const { byId, categorySlugByProductId } = catalogIndex();
  const anchors = anchorsFor(productIds, byId, categorySlugByProductId);
  if (anchors.length === 0) return [];

  const blocked = new Set<string>(excludeIds);
  for (const anchor of anchors) blocked.add(anchor.id);
  const leadWithPotatoes = anchors.some((anchor) => riceRowLeadIn.categories.includes(anchor.categorySlug));

  const groups: AddonGroup[] = [];
  for (const group of addonGroups) {
    const ids = group.id === "rice" && leadWithPotatoes ? [riceRowLeadIn.productId, ...group.productIds] : group.productIds;
    const products: Product[] = [];
    for (const id of ids) {
      if (blocked.has(id)) continue;
      const product = byId.get(id);
      if (!product || !product.isAvailable || product.status !== "published") continue;
      blocked.add(id);
      products.push(product);
    }
    if (products.length > 0) groups.push({ id: group.id, products });
  }

  return groups;
}

/**
 * One item from each requested row, in that row order.
 * If a row is empty, the next items in the remaining rows fill the limit.
 */
export function recommendAddonPicks(
  productIds: string[],
  excludeIds: string[],
  groupIds: readonly AddonGroupId[],
  limit: number,
): Product[] {
  if (limit < 1) return [];
  const available = recommendAddonGroups(productIds, excludeIds);
  const ordered = groupIds
    .map((id) => available.find((group) => group.id === id))
    .filter((group): group is AddonGroup => Boolean(group));

  const picked: Product[] = [];
  const seen = new Set<string>();
  const take = (product: Product) => {
    if (seen.has(product.id) || picked.length >= limit) return;
    seen.add(product.id);
    picked.push(product);
  };

  for (const group of ordered) {
    const first = group.products[0];
    if (first) take(first);
  }
  for (const group of ordered) {
    for (const product of group.products) take(product);
  }

  return picked;
}
