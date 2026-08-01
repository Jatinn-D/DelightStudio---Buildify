"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import {
  SIZE_LADDER,
  productsByCategory,
  type CatalogProduct,
  type Size,
} from "@/lib/data";
import { useCart } from "@/components/CartProvider";
import Morph from "./Morph";
import ShopProductCard from "./ShopProductCard";
import SizeChartModal from "./SizeChartModal";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function AccordionRow({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-taupe/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left font-nav text-[13px] uppercase tracking-[0.12em] text-ink"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-ink/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* Smoothly animate height (grid-rows 0fr→1fr) + fade, both directions. */}
      <div
        className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 font-sans text-[13.5px] leading-relaxed text-ink/65">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [needSize, setNeedSize] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [wished, setWished] = useState(false);

  const off = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const inStock = new Set<Size>(product.sizes);
  const low = product.stock <= 5;
  const maxQty = Math.min(product.stock, 10);
  const related = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const addToBag = () => {
    if (!size) {
      setNeedSize(true);
      return;
    }
    addItem(product, qty, size);
  };

  return (
    <div className="mx-auto max-w-360 px-4 pb-20 pt-28 sm:px-6 lg:px-10 lg:pt-37.5">
      {/* Breadcrumb */}
      <nav className="mb-6 mt-2 flex flex-wrap items-center gap-1.5 font-nav text-[11px] uppercase tracking-[0.14em] text-ink/45">
        <Link href="/" className="transition-colors hover:text-burgundy">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/ethnicwear/kurta" className="transition-colors hover:text-burgundy">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ---------- Gallery ---------- */}
        <div>
          <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
          <div className="flex gap-3 lg:flex-col">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => setActive(i)}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg ring-1 transition ${
                  active === i ? "ring-2 ring-burgundy" : "ring-taupe/40 hover:ring-burgundy/50"
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Morph name={`product-${product.slug}`}>
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-taupe-soft shadow-sm">
                <Image
                  src={product.images[active]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                {off > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-burgundy px-2.5 py-1 font-nav text-[11px] font-semibold tracking-[0.06em] text-cream">
                    {off}% OFF
                  </span>
                )}
              </div>
            </Morph>
          </div>
          </div>

          {/* Trust badges — sit beneath the image, filling the space */}
          <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-taupe/30 py-5 text-center">
            {[
              { icon: Truck, label: "Free shipping", sub: "Over ₹1,499" },
              { icon: RotateCcw, label: "Easy returns", sub: "7-day policy" },
              { icon: ShieldCheck, label: "Secure checkout", sub: "100% protected" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <Icon className="h-5 w-5 text-burgundy" />
                <span className="font-nav text-[11px] uppercase tracking-widest text-ink">
                  {label}
                </span>
                <span className="font-sans text-[11px] text-ink/45">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Info ---------- */}
        <div className="lg:py-0">
          <p className="font-nav text-[11px] uppercase tracking-[0.2em] text-burgundy/70">
            {product.types.join(" · ")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-3.5 w-3.5 ${
                    n <= Math.round(product.rating)
                      ? "fill-gold text-gold"
                      : "fill-taupe/30 text-taupe/30"
                  }`}
                />
              ))}
            </div>
            <span className="font-sans text-[13px] text-ink/55">
              {product.rating.toFixed(1)} · {product.reviews} reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-nav text-3xl font-semibold tabular-nums text-burgundy">
              {inr(product.price)}
            </span>
            {product.mrp && (
              <span className="font-sans text-lg text-ink/40 line-through">{inr(product.mrp)}</span>
            )}
            {off > 0 && (
              <span className="rounded-full bg-emerald-700/10 px-2.5 py-1 font-nav text-[12px] font-semibold text-emerald-700">
                {off}% OFF
              </span>
            )}
          </div>
          <p className="mt-1 font-sans text-xs text-ink/45">Inclusive of all taxes.</p>

          <p className="mt-5 max-w-prose font-sans text-[14.5px] leading-relaxed text-ink/70">
            {product.description}
          </p>

          {/* Colour / fabric / stock meta */}
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-sans text-[13px] text-ink/60">
            <span>
              <span className="text-ink/40">Colour:</span> {product.color}
            </span>
            <span>
              <span className="text-ink/40">Fabric:</span> {product.fabric}
            </span>
            <span className={low ? "text-burgundy" : "text-ink/60"}>
              <span className="text-ink/40">Availability:</span>{" "}
              {low ? `Only ${product.stock} left` : `${product.stock} in stock`}
            </span>
          </div>

          {/* Sizes */}
          <div className="mt-7">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-nav text-[12px] uppercase tracking-[0.14em] text-ink">
                Select Size
              </span>
              <button
                type="button"
                onClick={() => setChartOpen(true)}
                className="flex items-center gap-1.5 font-nav text-[11px] uppercase tracking-widest text-burgundy transition hover:opacity-70"
              >
                <Ruler className="h-3.5 w-3.5" />
                Size Chart
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {SIZE_LADDER.map((s) => {
                const avail = inStock.has(s);
                if (!avail) {
                  return (
                    <div key={s} className="group/sz relative">
                      <span className="grid h-11 w-full cursor-not-allowed place-items-center rounded-md border border-taupe/40 bg-taupe-soft/40 font-nav text-xs text-ink/30 line-through">
                        {s}
                      </span>
                      <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 font-sans text-[10px] text-cream opacity-0 shadow-md transition-opacity duration-200 group-hover/sz:opacity-100">
                        Not available
                      </span>
                    </div>
                  );
                }
                const selected = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(s);
                      setNeedSize(false);
                    }}
                    className={`h-11 rounded-md border font-nav text-xs transition ${
                      selected
                        ? "border-burgundy bg-burgundy text-cream"
                        : "border-taupe/50 text-ink hover:border-burgundy hover:text-burgundy"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {needSize && (
              <p className="mt-2 font-sans text-[12.5px] text-burgundy">
                Please select a size to continue.
              </p>
            )}
          </div>

          {/* Quantity + actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-taupe/50 px-2 py-1.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-7 w-7 place-items-center rounded-full text-ink/70 transition hover:bg-taupe-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-5 text-center font-sans text-sm tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={qty >= maxQty}
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                className="grid h-7 w-7 place-items-center rounded-full text-ink/70 transition hover:bg-taupe-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={addToBag}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-burgundy px-8 py-3.5 font-nav text-sm uppercase tracking-[0.16em] text-cream transition hover:bg-burgundy/90"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Bag
            </button>

            <button
              type="button"
              aria-label="Add to wishlist"
              onClick={() => setWished((w) => !w)}
              className="grid h-13 w-13 shrink-0 place-items-center rounded-full border border-taupe/50 text-ink transition hover:border-burgundy hover:text-burgundy"
            >
              <Heart className={`h-5 w-5 ${wished ? "fill-burgundy text-burgundy" : ""}`} />
            </button>
          </div>

          {/* Details accordion */}
          <div className="mt-8">
            <AccordionRow title="Fabric & Care">
              {product.fabric}. Gentle hand-wash or dry-clean recommended. Do not bleach. Warm iron
              on reverse. Dry in shade to preserve colour.
            </AccordionRow>
            <AccordionRow title="Shipping & Returns">
              Dispatched within 24–48 hours. Free shipping on orders above ₹1,499. Easy 7-day
              returns &amp; exchange. Cash on Delivery available across India.
            </AccordionRow>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-8 font-display text-2xl font-medium text-ink sm:text-3xl">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ShopProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <SizeChartModal open={chartOpen} onClose={() => setChartOpen(false)} />
    </div>
  );
}
