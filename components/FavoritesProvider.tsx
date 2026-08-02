"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import FavoritesDrawer from "./FavoritesDrawer";

/* Site-wide wishlist state. Lives above the whole app (in the root layout) so the
   navbar heart badge and every product card's heart read and write the same list.
   Favourites are keyed by product `slug` and persisted to localStorage, so the
   demo feels real across reloads. Mirrors the CartProvider pattern — the slide-out
   drawer is mounted here once, globally, so it works on every route. */

type FavoritesContextValue = {
  favorites: string[]; // product slugs, most-recent first
  count: number;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => void;
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

export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Load persisted favourites once, after mount. Rendering [] on the server and
  // the first client paint (then hydrating) avoids an SSR/client mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      /* corrupt / unavailable storage — start empty */
    }
  }, []);

  // Persist on every explicit toggle (not via an effect, so the initial load
  // above can never be clobbered by a first-render write).
  const toggle = (slug: string) =>
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  // Explicit removal (used by the drawer's heart), persisted the same way.
  const remove = (slug: string) =>
    setFavorites((prev) => {
      const next = prev.filter((s) => s !== slug);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  const isFavorite = (slug: string) => favorites.includes(slug);

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
