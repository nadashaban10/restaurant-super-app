import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartLineInputSchema, type CartLineInput } from "@/lib/catalog/schema";

type CartState = {
  items: CartLineInput[];
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  itemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, variantId, quantity = 1) => {
        const parsed = cartLineInputSchema.parse({
          productId,
          variantId,
          quantity,
        });
        const items = [...get().items];
        const index = items.findIndex(
          (item) =>
            item.productId === parsed.productId &&
            item.variantId === parsed.variantId,
        );
        if (index >= 0) {
          const nextQty = Math.min(99, items[index].quantity + parsed.quantity);
          items[index] = { ...items[index], quantity: nextQty };
        } else {
          items.push(parsed);
        }
        set({ items });
      },
      setQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) {
          set({
            items: get().items.filter(
              (item) =>
                !(item.productId === productId && item.variantId === variantId),
            ),
          });
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity: Math.min(99, quantity) }
              : item,
          ),
        });
      },
      removeItem: (productId, variantId) =>
        set({
          items: get().items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId),
          ),
        }),
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "ks_cart" },
  ),
);
