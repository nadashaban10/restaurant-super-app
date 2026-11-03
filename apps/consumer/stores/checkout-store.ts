import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckoutInput } from "@/lib/checkout/validate";

export const emptyCheckoutDraft: CheckoutInput = {
  fullName: "",
  phone: "",
  email: "",
  district: "",
  address: "",
  whatsapp: "",
  notes: "",
};

type CheckoutState = {
  draft: CheckoutInput;
  setField: <K extends keyof CheckoutInput>(field: K, value: CheckoutInput[K]) => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      draft: emptyCheckoutDraft,
      setField: (field, value) =>
        set((state) => ({ draft: { ...state.draft, [field]: value } })),
    }),
    { name: "ks_checkout" },
  ),
);
