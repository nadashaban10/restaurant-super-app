/**
 * Add-on rows shown with a dish: rice, pasta, salads, and drinks.
 * Product ids are listed in the order they should appear.
 */

/** Labeled add-on rows, in the order they appear on the dish page and in the cart. */
export const addonGroups = [
  {
    id: "rice",
    productIds: ["prd_rice-with-vermicelli", "prd_rice-with-liver", "prd_rice-with-sausage"],
  },
  {
    id: "pasta",
    productIds: [
      "prd_plain-pasta",
      "prd_pasta-with-sausage",
      "prd_pasta-with-liver",
      "prd_pasta-with-minced-meat",
      "prd_pasta-with-shish-tawook",
      "prd_bechamel-pasta-with-minced-meat",
    ],
  },
  {
    id: "salads",
    productIds: [
      "prd_tahini-salad",
      "prd_green-salad",
      "prd_baba-ghanoush",
      "prd_eggplant-pickles",
      "prd_seasoned-tomatoes",
      "prd_pickled-potatoes",
      "prd_seasoned-cheese-salad",
    ],
  },
  {
    id: "drinks",
    productIds: ["prd_pepsi", "prd_mineral-water", "prd_tea", "prd_coffee"],
  },
] as const;

export type AddonGroupId = (typeof addonGroups)[number]["id"];

export const trayAddonGroups: readonly AddonGroupId[] = addonGroups.map((group) => group.id);

/** Checkout stays a short row: rice, a salad, and a drink. */
export const checkoutAddonGroups: readonly AddonGroupId[] = ["rice", "salads", "drinks"];

/** Shown at the front of the rice row for these categories. */
export const riceRowLeadIn: { categories: readonly string[]; productId: string } = {
  categories: ["sandwiches"],
  productId: "prd_fried-potatoes",
};

export const recommendationLimits = {
  tray: 4,
  checkout: 3,
} as const;
