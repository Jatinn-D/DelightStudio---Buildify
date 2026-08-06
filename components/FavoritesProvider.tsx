"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import FavoritesDrawer from "./FavoritesDrawer";

/* Site-wide wishlist state. Lives above the whole app (in the root layout) so the
   navbar heart badge and every product card's heart read and write the same list.
   Each favourite is one product (keyed by `slug`) with an optional `size` the
   customer had selected when they hearted it from the product page. Persisted to
   localStorage so the demo feels real across reloads. Mirrors CartProvider — the
   slide-out drawer is mounted here once, globally, so it works on every route. */

export type Favorite = { slug: string; size?: string };

type FavoritesContextValue = {
  favorites: Favorite[]; // most-recent first
  count: number;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string, size?: string) => void;
  remove: (slug: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}

const KEY = "ds-favorites";

/* Tolerate the old format (a plain array of slug strings) as well as the new
   array of { slug, size } objects, so existing saved favourites don't break. */
function parseFavorites(raw: string): Favorite[] {
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) return [];
  const out: Favorite[] = [];
  for (const item of data) {
    if (typeof item === "string") out.push({ slug: item });
    else if (item && typeof item === "object" && typeof (item as Favorite).slug === "string") {
      out.push({ slug: (item as Favorite).slug, size: (item as Favorite).size });
    }
  }
  return out;
}

export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [open, setOpen] = useState(false);

  // Load persisted favourites once, after mount. Rendering [] on the server and
  // the first client paint (then hydrating) avoids an SSR/client mismatch.
  useEffect(() => {
    // Defer out of the commit phase (matches SearchOverlay) so it isn't a
    // synchronous state update inside the effect body.
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) setFavorites(parseFavorites(raw));
      } catch {
        /* corrupt / unavailable storage — start empty */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Persist inside each mutation (not via an effect, so the initial load above
  // can never be clobbered by a first-render write).
  const persist = (next: Favorite[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return next;
  };

  const toggle = (slug: string, size?: string) =>
    setFavorites((prev) =>
      persist(
        prev.some((f) => f.slug === slug)
          ? prev.filter((f) => f.slug !== slug)
          : [{ slug, size }, ...prev],
      ),
    );

  // Explicit removal (used by the drawer's heart), persisted the same way.
  const remove = (slug: string) =>
    setFavorites((prev) => persist(prev.filter((f) => f.slug !== slug)));

  const isFavorite = (slug: string) => favorites.some((f) => f.slug === slug);

  const value = useMemo(
    () => ({ favorites, count: favorites.length, isFavorite, toggle, remove, open, setOpen }),
    [favorites, open],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      <FavoritesDrawer
        open={open}
        onClose={() => setOpen(false)}
        favorites={favorites}
        onRemove={remove}
      />
    </FavoritesContext.Provider>
  );
}
