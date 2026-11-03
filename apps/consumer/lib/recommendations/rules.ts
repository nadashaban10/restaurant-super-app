/**
 * Manual pairing rules for the menu we have today.
 * `pairsWith` is tried first. Category rules fill the rest.
 * A future analytics source can replace these maps without changing the UI.
 */
export const recommendationRules = {
  /** Product id → complementary product ids, in the order to offer them. */
  pairsWith: {
    "prd_baladi-kofta": [
      "prd_tahini-salad",
      "prd_eggplant-pickles",
      "prd_green-salad",
      "prd_rice-with-vermicelli",
    ],
    "prd_flattened-kofta": [
      "prd_tahini-salad",
      "prd_eggplant-pickles",
      "prd_rice-with-vermicelli",
    ],
    "prd_mixed-grill": [
      "prd_tahini-salad",
      "prd_green-salad",
      "prd_baba-ghanoush",
      "prd_rice-with-vermicelli",
    ],
    "prd_charcoal-shish-chicken": [
      "prd_rice-with-vermicelli",
      "prd_tahini-salad",
      "prd_green-salad",
      "prd_fried-potatoes",
    ],
    "prd_chicken-tikka": [
      "prd_rice-with-vermicelli",
      "prd_tahini-salad",
      "prd_green-salad",
    ],
    "prd_boneless-shish-tawook": [
      "prd_tahini-salad",
      "prd_rice-with-vermicelli",
      "prd_green-salad",
    ],
    "prd_kofta-sandwich": ["prd_fried-potatoes", "prd_pepsi", "prd_tahini-salad"],
    "prd_kabab-sandwich": ["prd_fried-potatoes", "prd_pepsi", "prd_tahini-salad"],
    "prd_shaaban-platter-serves-8": [
      "prd_green-salad",
      "prd_tahini-salad",
      "prd_baba-ghanoush",
      "prd_pepsi",
    ],
  } as Record<string, string[]>,

  /** Category slug → complementary category slugs, most relevant first. */
  complements: {
    grills: ["salads", "kitchen-sides", "drinks"],
    grill: ["salads", "kitchen-sides", "drinks"],
    "family-platters": ["salads", "sambousak", "drinks"],
    "lamb-shank": ["salads", "kitchen-sides", "drinks"],
    sandwiches: ["kitchen-sides", "salads", "drinks"],
    hawawshi: ["salads", "kitchen-sides", "drinks"],
    sambousak: ["salads", "drinks"],
    pasta: ["salads", "drinks"],
    tagens: ["salads", "drinks"],
    mombar: ["salads", "drinks"],
    mahshi: ["salads", "drinks"],
    "kitchen-sides": ["salads", "drinks"],
    salads: ["drinks"],
    drinks: ["salads"],
  } as Record<string, string[]>,

  /** Offered first inside a category. */
  priority: {
    salads: [
      "prd_tahini-salad",
      "prd_green-salad",
      "prd_baba-ghanoush",
      "prd_eggplant-pickles",
      "prd_seasoned-tomatoes",
      "prd_pickled-potatoes",
      "prd_seasoned-cheese-salad",
    ],
    "kitchen-sides": ["prd_rice-with-vermicelli", "prd_fried-potatoes", "prd_orzo-tagine"],
    drinks: ["prd_pepsi", "prd_mineral-water", "prd_tea", "prd_coffee"],
    sambousak: ["prd_cheese-sambousak", "prd_meat-sambousak", "prd_mixed-sambousak"],
  } as Record<string, string[]>,

  /**
   * These categories mix sides with full dishes.
   * Only the priority ids are recommended, so a grill is not paired with rice-and-liver.
   */
  closedCategories: ["kitchen-sides", "sambousak"],
};

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
  cart: 6,
  detail: 4,
  checkout: 3,
} as const;
