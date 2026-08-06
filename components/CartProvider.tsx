"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import CartDrawer, { type CartLine } from "./CartDrawer";
import type { Product } from "@/lib/data";

/* Site-wide cart state. Lives above the whole app (in the root layout) so the
   navbar bag badge, the slide-out drawer, and every "Add to bag" button on
   product/detail pages all read and write the same cart. The drawer itself is
   mounted here once, globally, so it works on every route. Persisted to
   localStorage so the bag survives a page refresh (mirrors the favourites). */

type CartContextValue = {
  items: CartLine[];
  count: number;
  addItem: (product: Product, qty?: number, size?: string, openDrawer?: boolean) => void;
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

const KEY = "ds-cart";

/* Guard against malformed / stale storage — keep only well-formed lines. */
function parseCart(raw: string): CartLine[] {
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) return [];
  const out: CartLine[] = [];
  for (const item of data) {
    if (item && typeof item === "object") {
      const l = item as CartLine;
      if (l.product && typeof l.product.name === "string" && typeof l.qty === "number") {
        out.push({
          product: l.product,
          qty: l.qty,
          size: typeof l.size === "string" ? l.size : undefined,
        });
      }
    }
  }
  return out;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const hydrated = useRef(false);

  // Load the persisted cart once, after mount. Rendering [] on the server and
  // the first client paint (then hydrating) avoids an SSR/client mismatch.
  useEffect(() => {
    // Defer out of the commit phase so it isn't a synchronous state update in
    // the effect body (matches the favourites/search providers).
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) setItems(parseCart(raw));
      } catch {
        /* corrupt / unavailable storage — start empty */
      }
      hydrated.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Persist every change — but only after the initial load, so the empty first
  // render can never clobber a saved cart.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  // `openDrawer` defaults to true so the bag pops on a normal "Add to bag".
  // The favourites drawer passes false to quiet-add without stealing focus.
  const addItem = (product: Product, qty = 1, size?: string, openDrawer = true) => {
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
    if (openDrawer) setOpen(true); // pop the drawer so the add is visible
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
