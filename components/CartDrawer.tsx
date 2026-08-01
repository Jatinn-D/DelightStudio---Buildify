"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { useLenis } from "lenis/react";
import { newArrivals, type Product } from "@/lib/data";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export type CartLine = { product: Product; qty: number; size?: string };

/* Seeded so the drawer looks real on first open (matches the bag badge). */
export const initialCart: CartLine[] = [
  { product: newArrivals[0], qty: 1 }, // Scarlet Evening Gown
  { product: newArrivals[1], qty: 1 }, // Rosa Floral Flared Gown
  { product: newArrivals[2], qty: 2 }, // Ivory Shirt & Denim Set
  { product: newArrivals[3], qty: 1 }, // Monochrome Blouse & Skirt
  { product: newArrivals[4], qty: 1 }, // Sunlit Summer Dress
];

export default function CartDrawer({
  open,
  onClose,
  items,
  onItemsChange,
}: {
  open: boolean;
  onClose: () => void;
  items: CartLine[];
  onItemsChange: (items: CartLine[]) => void;
}) {
  const lenis = useLenis();

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

  const setQty = (idx: number, qty: number) =>
    onItemsChange(items.map((l, i) => (i === idx ? { ...l, qty } : l)));
  const remove = (idx: number) => onItemsChange(items.filter((_, i) => i !== idx));

  const count = items.reduce((n, l) => n + l.qty, 0);
  const subtotal = items.reduce((s, l) => s + l.product.price * l.qty, 0);
  const savings = items.reduce(
    (s, l) => s + (l.product.mrp ? (l.product.mrp - l.product.price) * l.qty : 0),
    0,
  );

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

      {/* Panel — slides in from the right (transform-only = GPU-composited) */}
      <aside
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="cart-panel absolute right-0 top-0 flex h-full w-[88%] max-w-md flex-col bg-cream-soft text-ink shadow-[0_0_60px_rgba(61,18,32,0.28)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-taupe/30 px-5 py-4 sm:px-6">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-xl font-semibold tracking-[0.06em]">Your Bag</h2>
            <span className="font-sans text-sm text-ink/50">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            type="button"
            aria-label="Close bag"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full text-ink/60 transition hover:bg-taupe-soft hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length > 0 ? (
          <>
            {/* Line items */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <ul className="flex flex-col gap-5">
                {items.map((l, idx) => (
                  <li key={`${l.product.name}-${l.size ?? ""}`} className="flex gap-4">
                    <Link
                      href={l.product.href}
                      onClick={onClose}
                      className="relative h-28 w-22 shrink-0 overflow-hidden rounded-md bg-taupe-soft"
                    >
                      <Image
                        src={l.product.image}
                        alt={l.product.name}
                        fill
                        sizes="88px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={l.product.href}
                            onClick={onClose}
                            className="font-sans text-sm text-ink transition-colors hover:text-burgundy"
                          >
                            {l.product.name}
                          </Link>
                          <p className="mt-0.5 font-nav text-[10px] uppercase tracking-[0.16em] text-ink/40">
                            {l.product.category}
                            {l.size && (
                              <span className="text-ink/55"> · Size {l.size}</span>
                            )}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${l.product.name}`}
                          onClick={() => remove(idx)}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/40 transition hover:bg-taupe-soft hover:text-burgundy"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-nav text-sm font-medium text-burgundy">
                          {inr(l.product.price)}
                        </span>
                        {l.product.mrp && (
                          <span className="font-sans text-xs text-ink/40 line-through">
                            {inr(l.product.mrp)}
                          </span>
                        )}
                      </div>

                      {/* Quantity stepper + line total */}
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center gap-3 rounded-full border border-taupe/50 px-1.5 py-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={l.qty <= 1}
                            onClick={() => setQty(idx, l.qty - 1)}
                            className="grid h-6 w-6 place-items-center rounded-full text-ink/70 transition hover:bg-taupe-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-4 text-center font-sans text-sm tabular-nums">
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(idx, l.qty + 1)}
                            className="grid h-6 w-6 place-items-center rounded-full text-ink/70 transition hover:bg-taupe-soft hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-sans text-sm text-ink/70">
                          {inr(l.product.price * l.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer / order summary */}
            <div className="shrink-0 border-t border-taupe/30 px-5 py-5 sm:px-6">
              {savings > 0 && (
                <div className="mb-1.5 flex items-center justify-between font-sans text-sm">
                  <span className="text-ink/60">You save</span>
                  <span className="text-burgundy">−{inr(savings)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-nav text-sm uppercase tracking-[0.12em] text-ink/70">
                  Subtotal
                </span>
                <span className="font-nav text-xl font-medium tabular-nums text-ink">
                  {inr(subtotal)}
                </span>
              </div>
              <p className="mt-1 font-sans text-xs text-ink/45">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-burgundy py-3.5 font-nav text-sm uppercase tracking-[0.16em] text-cream transition hover:bg-burgundy/90"
              >
                Checkout
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
              <ShoppingBag className="h-7 w-7 text-burgundy" />
            </div>
            <div>
              <p className="font-display text-xl text-ink">Your bag is empty</p>
              <p className="mt-1 font-sans text-sm text-ink/55">
                Add something you love — it&rsquo;ll show up here.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-full bg-burgundy px-7 py-3 font-nav text-sm uppercase tracking-[0.16em] text-cream transition hover:bg-burgundy/90"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
