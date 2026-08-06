"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/data";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);

  return (
    <div className="group flex flex-col">
      <Link
        href={product.href}
        className="relative block aspect-[4/5] overflow-hidden rounded-md bg-taupe-soft"
      >
        {/* Primary image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
        />
        {/* Hover image */}
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          />
        )}

        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-cream-soft/95 px-3 py-1 font-nav text-[10px] uppercase tracking-[0.14em] text-burgundy">
            {product.tag}
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            setWished((w) => !w);
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cream-soft/90 text-ink shadow-sm transition-transform hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 ${wished ? "fill-burgundy text-burgundy" : ""}`}
          />
        </button>
      </Link>

      <div className="mt-3 flex flex-col gap-1">
        <Link
          href={product.href}
          className="font-sans text-[15px] text-ink transition-colors hover:text-burgundy"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-nav text-sm font-medium text-burgundy">
            {inr(product.price)}
          </span>
          {product.mrp && (
            <span className="font-sans text-xs text-ink/45 line-through">
              {inr(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
