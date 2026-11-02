import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";

const idsSchema = z.array(z.string());

type WishlistState = {
  productIds: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        const current = get().productIds;
        const next = current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId];
        set({ productIds: idsSchema.parse(next) });
      },
      has: (productId) => get().productIds.includes(productId),
    }),
    { name: "ks_wishlist" },
  ),
);
