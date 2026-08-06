"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { getCatalogProduct, type CatalogProduct } from "@/lib/data";
import { useCart } from "./CartProvider";
import type { Favorite } from "./FavoritesProvider";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

/* Wishlist drawer — the favourites twin of CartDrawer. Same slide-in shell
   (`.cart-panel`), same Lenis pause / Esc-to-close, themed to match. Favourites
   are a *saved* list, independent of the bag: "Add to Bag" is a quiet add that
   keeps the item here; the only way an item leaves is its heart. Each favourite
   carries the size the customer picked (if any), shown and passed on to the bag. */
export default function FavoritesDrawer({
  open,
  onClose,
  favorites,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  favorites: Favorite[];
  onRemove: (slug: string) => void;
}) {
  const lenis = useLenis();
  const { addItem, setOpen: setCartOpen } = useCart();

  // Per-slug UI state: rows animating out, and the brief "Added ✓" flash.
  const [exiting, setExiting] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});

  /* Pause Lenis while open (freezes the page underneath — no layout shift) */
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [open, lenis]);

  /* Esc to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Resolve saved favourites → catalogue products (drop any that no longer exist),
  // keeping the size the customer had chosen.
  const items = favorites
    .map((f) => ({ p: getCatalogProduct(f.slug), size: f.size }))
    .filter((x): x is { p: CatalogProduct; size: string | undefined } => Boolean(x.p));

  // Let the row collapse (CSS) before it actually leaves the list.
  const removeWithAnim = (slug: string) => {
    setExiting((e) => ({ ...e, [slug]: true }));
    window.setTimeout(() => {
      onRemove(slug);
      setExiting((e) => {
        const next = { ...e };
        delete next[slug];
        return next;
      });
    }, 320);
  };

  const flashAdded = (slug: string) => {
    setAdded((a) => ({ ...a, [slug]: true }));
    window.setTimeout(() => setAdded((a) => ({ ...a, [slug]: false })), 1500);
  };

  // Quiet add (keeps the drawer open) — carry the saved size into the bag.
  const addOne = (p: CatalogProduct, size?: string) => {
    addItem(p, 1, size, false);
    flashAdded(p.slug);
  };

  // Bulk add, then hand off to the bag so the result is visible.
  const addAll = () => {
    items.forEach(({ p, size }) => addItem(p, 1, size, false));
    onClose();
    setCartOpen(true);
  };

  return (
    <div
      className={`fixed inset-0 z-60 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Dim backdrop — click to close */}
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel — slides in from the right (shared `.cart-panel` = GPU-composited) */}
      <aside
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Favourites"
        className="cart-panel absolute right-0 top-0 flex h-full w-[88%] max-w-md flex-col bg-cream-soft text-ink shadow-[0_0_60px_rgba(61,18,32,0.28)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-taupe/30 px-5 py-4 sm:px-6">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-xl font-semibold tracking-[0.06em]">Your Favourites</h2>
            <span className="font-sans text-sm text-ink/50">{items.length} saved</span>
          </div>
          <button
            type="button"
            aria-label="Close favourites"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full text-ink/60 transition hover:bg-taupe-soft hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length > 0 ? (
          <>
            {/* Saved items */}
            <ul data-lenis-prevent className="flex-1 overflow-y-auto px-5 sm:px-6">
              {items.map(({ p, size }) => (
                <li
                  key={p.slug}
                  data-exiting={exiting[p.slug] ? "true" : "false"}
                  className="fav-row border-b border-taupe/20 last:border-0"
                >
                  <div className="flex gap-4 py-5">
                    <Link
                      href={p.href}
                      onClick={onClose}
                      className="relative h-28 w-22 shrink-0 overflow-hidden rounded-md bg-taupe-soft"
                    >
                      <Image src={p.image} alt={p.name} fill sizes="88px" className="object-cover" />
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={p.href}
                            onClick={onClose}
                            className="font-sans text-sm text-ink transition-colors hover:text-burgundy"
                          >
                            {p.name}
                          </Link>
                          <p className="mt-0.5 font-nav text-[10px] uppercase tracking-[0.16em] text-ink/40">
                            {p.category}
                            {size && (
                              <span className="text-ink/60">
                                {" · "}
                                {size === "Free Size" ? (
                                  <span className="font-medium text-burgundy">Free Size</span>
                                ) : (
                                  <>
                                    Size <span className="font-medium text-burgundy">{size}</span>
                                  </>
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${p.name} from favourites`}
                          onClick={() => removeWithAnim(p.slug)}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-burgundy transition hover:bg-taupe-soft"
                        >
                          <Heart className="h-4 w-4 fill-burgundy" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-nav text-sm font-medium text-burgundy">
                          {inr(p.price)}
                        </span>
                        {p.mrp && (
                          <span className="font-sans text-xs text-ink/40 line-through">
                            {inr(p.mrp)}
                          </span>
                        )}
                      </div>

                      {/* Add to Bag (quiet), then an explicit Remove + View row
                          so removal is spelled out (the corner heart also works). */}
                      <div className="mt-auto pt-3">
                        <button
                          type="button"
                          onClick={() => addOne(p, size)}
                          className="w-full rounded-full bg-burgundy py-2 font-nav text-[11px] uppercase tracking-[0.14em] text-cream transition hover:bg-burgundy/90"
                        >
                          {added[p.slug] ? "Added ✓" : "Add to Bag"}
                        </button>
                        <div className="mt-2 flex items-center justify-between">
                          <button
                            type="button"
                            aria-label={`Remove ${p.name} from favourites`}
                            onClick={() => removeWithAnim(p.slug)}
                            className="flex items-center gap-1 font-nav text-[11px] uppercase tracking-[0.12em] text-ink/55 transition hover:text-burgundy"
                          >
                            <X className="h-3.5 w-3.5" />
                            Remove
                          </button>
                          <Link
                            href={p.href}
                            onClick={onClose}
                            className="font-nav text-[11px] uppercase tracking-[0.12em] text-ink/70 transition hover:text-burgundy"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer — bulk action + continue */}
            <div className="shrink-0 border-t border-taupe/30 px-5 py-5 sm:px-6">
              <button
                type="button"
                onClick={addAll}
                className="w-full rounded-full bg-burgundy py-3.5 font-nav text-sm uppercase tracking-[0.16em] text-cream transition hover:bg-burgundy/90"
              >
                Add all to Bag
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full py-2 font-nav text-xs uppercase tracking-[0.14em] text-ink/55 transition hover:text-burgundy"
              >
                Continue shopping
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-taupe-soft/70">
              <Heart className="h-7 w-7 text-burgundy" />
            </div>
            <div>
              <p className="font-display text-xl text-ink">No favourites yet</p>
              <p className="mt-1 font-sans text-sm text-ink/55">
                Tap the heart on anything you love — it&rsquo;ll wait for you here.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-full bg-burgundy px-7 py-3 font-nav text-sm uppercase tracking-[0.16em] text-cream transition hover:bg-burgundy/90"
            >
              Start exploring
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
