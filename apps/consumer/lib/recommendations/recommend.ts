import { getCategories, getPublishedProducts } from "@/lib/catalog/catalog";
import type { Product } from "@/lib/catalog/schema";
import { addonGroups, riceRowLeadIn, type AddonGroupId } from "./rules";

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
  return { categorySlugByProductId, byId };
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
    const ids = group.id === "rice" && leadWithPotatoes ? [riceRowLeadIn.productId, ...group.productIds] : [...group.productIds];
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
