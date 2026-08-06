"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { SIZE_LADDER, type CatalogProduct } from "@/lib/data";
import { useFavorites } from "@/components/FavoritesProvider";
import Morph from "./Morph";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

/* Compact "S–XXL" style range from the sizes actually in stock. */
function sizeRange(product: CatalogProduct) {
  if (product.freeSize) return "Free Size";
  const sizes = product.sizes;
  if (!sizes.length) return "—";
  const idx = sizes.map((s) => SIZE_LADDER.indexOf(s)).sort((a, b) => a - b);
  const lo = SIZE_LADDER[idx[0]];
  const hi = SIZE_LADDER[idx[idx.length - 1]];
  return lo === hi ? lo : `${lo}–${hi}`;
}

export default function ShopProductCard({ product }: { product: CatalogProduct }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(product.slug);
  const [pop, setPop] = useState(false);
  const off = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= 5;

  const onWish = (e: MouseEvent) => {
    e.preventDefault(); // don't follow the card's link
    if (!fav) setPop(true); // burst only when adding, not when removing
    toggle(product.slug);
  };

  return (
    <div className="group relative">
      {/* The card lifts gently above its neighbours on hover. Kept subtle so a
          dense grid of cards stays smooth while scrolling. */}
      <div className="relative origin-center transition-transform duration-300 ease-out group-hover:z-20 group-hover:scale-[1.05]">
        <Link href={product.href} className="block">
          {/* Image frame — this element morphs into the detail hero. Squarer
              corners (rounded-md) for a crisper, more editorial look. */}
          <Morph name={`product-${product.slug}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-taupe-soft">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                className={`object-cover ${soldOut ? "opacity-60" : ""}`}
              />
              {product.hoverImage && !soldOut && (
                <Image
                  src={product.hoverImage}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                  className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              )}

              {soldOut ? (
                <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/70 px-2 py-0.5 font-nav text-[10px] font-semibold uppercase tracking-[0.08em] text-cream">
                  Out of Stock
                </span>
              ) : (
                off > 0 && (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-burgundy px-2 py-0.5 font-nav text-[10px] font-semibold tracking-[0.06em] text-cream">
                    {off}% OFF
                  </span>
                )
              )}
              {product.tag && !soldOut && (
                <span className="absolute bottom-2.5 left-2.5 rounded-full bg-cream-soft/95 px-2 py-0.5 font-nav text-[9px] uppercase tracking-[0.14em] text-burgundy">
                  {product.tag}
                </span>
              )}

              <button
                type="button"
                aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={fav}
                data-pop={pop}
                onClick={onWish}
                onAnimationEnd={() => setPop(false)}
                className="wish-btn absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-cream-soft/90 text-ink shadow-sm transition hover:scale-110"
              >
                <span className="wish-ring" aria-hidden />
                <Heart
                  className={`wish-heart h-3.5 w-3.5 transition-colors ${
                    fav ? "fill-burgundy text-burgundy" : ""
                  }`}
                />
              </button>
            </div>
          </Morph>
        </Link>

        <div className="mt-2.5 flex flex-col gap-1 px-0.5">
          <Link
            href={product.href}
            className="line-clamp-1 font-sans text-[13.5px] text-ink transition-colors hover:text-burgundy"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="font-nav text-sm font-semibold text-burgundy">{inr(product.price)}</span>
            {product.mrp && (
              <span className="font-sans text-xs text-ink/40 line-through">{inr(product.mrp)}</span>
            )}
            {off > 0 && (
              <span className="font-nav text-[11px] font-medium text-emerald-700">{off}% off</span>
            )}
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <span className="font-nav text-[10px] uppercase tracking-[0.12em] text-ink/45">
              {sizeRange(product)}
            </span>
            <span
              className={`font-nav text-[10px] uppercase tracking-[0.1em] ${
                soldOut ? "text-ink/40" : low ? "text-burgundy" : "text-ink/45"
              }`}
            >
              {soldOut ? "Out of stock" : low ? `Only ${product.stock} left` : "In stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
