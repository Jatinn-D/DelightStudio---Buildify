"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import CartDrawer, { initialCart, type CartLine } from "./CartDrawer";
import type { Product } from "@/lib/data";

/* Site-wide cart state. Lives above the whole app (in the root layout) so the
   navbar bag badge, the slide-out drawer, and every "Add to bag" button on
   product/detail pages all read and write the same cart. The drawer itself is
   mounted here once, globally, so it works on every route. */

type CartContextValue = {
  items: CartLine[];
  count: number;
  addItem: (product: Product, qty?: number, size?: string) => void;
  setItems: (items: CartLine[]) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(initialCart);
  const [open, setOpen] = useState(false);

  const addItem = (product: Product, qty = 1, size?: string) => {
    setItems((prev) => {
      // Same product + same size = bump the quantity; otherwise a new line.
      const i = prev.findIndex((l) => l.product.name === product.name && l.size === size);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [{ product, qty, size }, ...prev];
    });
    setOpen(true); // pop the drawer so the add is visible
  };

  const count = items.reduce((n, l) => n + l.qty, 0);

  const value = useMemo(
    () => ({ items, count, addItem, setItems, open, setOpen }),
    [items, count, open],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        onItemsChange={setItems}
      />
    </CartContext.Provider>
  );
}
