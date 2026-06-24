import { create } from "zustand";
import { menu } from "./menu";

type CartState = {
  items: Record<string, number>;
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalCount: () => number;
  totalPrice: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: {},
  add: (id) =>
    set((s) => ({ items: { ...s.items, [id]: (s.items[id] ?? 0) + 1 } })),
  remove: (id) =>
    set((s) => {
      const next = { ...s.items };
      const cur = next[id] ?? 0;
      if (cur <= 1) delete next[id];
      else next[id] = cur - 1;
      return { items: next };
    }),
  setQty: (id, qty) =>
    set((s) => {
      const next = { ...s.items };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return { items: next };
    }),
  clear: () => set({ items: {} }),
  totalCount: () =>
    Object.values(get().items).reduce((a, b) => a + b, 0),
  totalPrice: () =>
    Object.entries(get().items).reduce((sum, [id, qty]) => {
      const item = menu.find((m) => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0),
}));
