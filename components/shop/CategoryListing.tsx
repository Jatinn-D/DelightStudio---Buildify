"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, Check, ChevronRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { SIZE_LADDER, type CatalogProduct, type Size } from "@/lib/data";
import ShopProductCard from "./ShopProductCard";

type SortValue = "featured" | "price-asc" | "price-desc" | "discount" | "rating";

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Discount" },
  { value: "rating", label: "Top Rated" },
];

type Filters = {
  types: string[];
  sizes: Size[];
  price: [number, number];
  sort: SortValue;
};

const offOf = (p: CatalogProduct) => (p.mrp ? (p.mrp - p.price) / p.mrp : 0);

function applyFilters(list: CatalogProduct[], f: Filters, original: CatalogProduct[]) {
  const out = list.filter((p) => {
    if (f.types.length && !f.types.some((t) => p.types.includes(t))) return false;
    if (f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s))) return false;
    if (p.price < f.price[0] || p.price > f.price[1]) return false;
    return true;
  });
  switch (f.sort) {
    case "price-asc":
      return [...out].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...out].sort((a, b) => b.price - a.price);
    case "discount":
      return [...out].sort((a, b) => offOf(b) - offOf(a));
    case "rating":
      return [...out].sort((a, b) => b.rating - a.rating);
    default:
      // "featured" — keep the catalog's authored order
      return [...out].sort((a, b) => original.indexOf(a) - original.indexOf(b));
  }
}

function sameFilters(a: Filters, b: Filters) {
  return (
    a.sort === b.sort &&
    a.price[0] === b.price[0] &&
    a.price[1] === b.price[1] &&
    [...a.types].sort().join() === [...b.types].sort().join() &&
    [...a.sizes].sort().join() === [...b.sizes].sort().join()
  );
}

/* ---------------- Filter panel (shared by desktop sidebar + mobile drawer) --- */
function FilterPanel({
  facetTypes,
  pending,
  setPending,
  bounds,
  pendingCount,
  applyDisabled,
  activeCount,
  onApply,
  onClear,
}: {
  facetTypes: readonly string[];
  pending: Filters;
  setPending: React.Dispatch<React.SetStateAction<Filters>>;
  bounds: [number, number];
  pendingCount: number;
  applyDisabled: boolean;
  activeCount: number;
  onApply: () => void;
  onClear: () => void;
}) {
  const [bmin, bmax] = bounds;
  const [lo, hi] = pending.price;
  const leftPct = ((lo - bmin) / (bmax - bmin)) * 100;
  const rightPct = ((hi - bmin) / (bmax - bmin)) * 100;

  const toggleType = (t: string) =>
    setPending((f) => ({
      ...f,
      types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t],
    }));
  const toggleSize = (s: Size) =>
    setPending((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));

  return (
    // The rail is a flex column: the facets scroll, but the Clear / Show-results
    // actions are pinned as a footer below, so they stay visible without having
    // to scroll the list all the way down.
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Scrollable facets — data-lenis-prevent keeps this scroll independent of
          the main page scroll. */}
      <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto pr-1">
        {/* Sort */}
        <section className="pb-6">
          <h3 className="mb-3 font-nav text-[12px] uppercase tracking-[0.16em] text-ink">Sort By</h3>
          <div className="flex flex-col gap-2">
            {SORT_OPTIONS.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name="sort"
                  checked={pending.sort === o.value}
                  onChange={() => setPending((f) => ({ ...f, sort: o.value }))}
                  className="peer sr-only"
                />
                <span className="grid h-4 w-4 place-items-center rounded-full border border-taupe/60 peer-checked:border-burgundy">
                  <span
                    className={`h-2 w-2 rounded-full transition ${
                      pending.sort === o.value ? "bg-burgundy" : "bg-transparent"
                    }`}
                  />
                </span>
                <span className="font-sans text-[13.5px] text-ink/75">{o.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Type */}
        <section className="border-t border-taupe/30 py-6">
          <h3 className="mb-3 font-nav text-[12px] uppercase tracking-[0.16em] text-ink">Type</h3>
          <div className="flex flex-col gap-2.5">
            {facetTypes.map((t) => {
              const on = pending.types.includes(t);
              return (
                <label key={t} className="flex cursor-pointer items-center gap-2.5">
                  <span
                    className={`grid h-4 w-4 place-items-center rounded border transition ${
                      on ? "border-burgundy bg-burgundy text-cream" : "border-taupe/60 text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <input type="checkbox" checked={on} onChange={() => toggleType(t)} className="sr-only" />
                  <span className="font-sans text-[13.5px] text-ink/75">{t}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Price */}
        <section className="border-t border-taupe/30 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-nav text-[12px] uppercase tracking-[0.16em] text-ink">Price</h3>
            <span className="font-sans text-[12.5px] tabular-nums text-ink/60">
              ₹{lo.toLocaleString("en-IN")} – ₹{hi.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="range-dual">
            <span className="range-base" />
            <span
              className="range-fill"
              style={{ left: `${leftPct}%`, width: `${Math.max(0, rightPct - leftPct)}%` }}
            />
            <input
              type="range"
              min={bmin}
              max={bmax}
              step={100}
              value={lo}
              aria-label="Minimum price"
              onChange={(e) =>
                setPending((f) => ({
                  ...f,
                  price: [Math.min(Number(e.target.value), f.price[1]), f.price[1]],
                }))
              }
            />
            <input
              type="range"
              min={bmin}
              max={bmax}
              step={100}
              value={hi}
              aria-label="Maximum price"
              onChange={(e) =>
                setPending((f) => ({
                  ...f,
                  price: [f.price[0], Math.max(Number(e.target.value), f.price[0])],
                }))
              }
            />
          </div>
        </section>

        {/* Size */}
        <section className="border-t border-taupe/30 py-6">
          <h3 className="mb-3 font-nav text-[12px] uppercase tracking-[0.16em] text-ink">Size</h3>
          <div className="grid grid-cols-6 gap-2">
            {SIZE_LADDER.map((s) => {
              const on = pending.sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`h-9 rounded-md border font-nav text-[11px] transition ${
                    on
                      ? "border-burgundy bg-burgundy text-cream"
                      : "border-taupe/50 text-ink/70 hover:border-burgundy"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Actions — pinned footer of the rail, so Clear / Show results stay
          visible without scrolling the facet list. */}
      <div className="flex shrink-0 items-center gap-3 border-t border-taupe/30 pt-4">
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="rounded-full border border-taupe/60 px-5 py-3 font-nav text-[12px] uppercase tracking-[0.14em] text-ink transition hover:border-burgundy hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-taupe/60 disabled:hover:text-ink"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={applyDisabled}
          className="flex-1 rounded-full bg-burgundy py-3 font-nav text-[12px] uppercase tracking-[0.14em] text-cream transition hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-burgundy"
        >
          Show {pendingCount} {pendingCount === 1 ? "result" : "results"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Category listing page ------------------------------------- */
export default function CategoryListing({
  title,
  eyebrow,
  products,
  facetTypes,
}: {
  title: string;
  eyebrow?: string;
  products: CatalogProduct[];
  facetTypes: readonly string[];
}) {
  const bounds = useMemo<[number, number]>(() => {
    const prices = products.map((p) => p.price);
    const min = Math.floor(Math.min(...prices) / 100) * 100;
    const max = Math.ceil(Math.max(...prices) / 100) * 100;
    return [min, max];
  }, [products]);

  const defaults = useMemo<Filters>(
    () => ({ types: [], sizes: [], price: [bounds[0], bounds[1]], sort: "featured" }),
    [bounds],
  );

  const [pending, setPending] = useState<Filters>(defaults);
  const [applied, setApplied] = useState<Filters>(defaults);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!drawerOpen) return;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [drawerOpen, lenis]);

  const results = useMemo(() => applyFilters(products, applied, products), [products, applied]);
  const pendingCount = useMemo(
    () => applyFilters(products, pending, products).length,
    [products, pending],
  );

  const activeCount =
    applied.types.length +
    applied.sizes.length +
    (applied.price[0] !== bounds[0] || applied.price[1] !== bounds[1] ? 1 : 0) +
    (applied.sort !== "featured" ? 1 : 0);

  const applyDisabled = sameFilters(pending, applied);

  const onApply = () => {
    setApplied(pending);
    setDrawerOpen(false);
  };
  const onClear = () => {
    setPending(defaults);
    setApplied(defaults);
  };

  const panelProps = {
    facetTypes,
    pending,
    setPending,
    bounds,
    pendingCount,
    applyDisabled,
    activeCount,
    onApply,
    onClear,
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-[112px] sm:px-6 lg:px-10 lg:pt-[150px]">
      {/* Breadcrumb + style count share one line */}
      <div className="mb-2 mt-2 flex items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center gap-1.5 font-nav text-[11px] uppercase tracking-[0.14em] text-ink/45">
          <Link href="/" className="transition-colors hover:text-burgundy">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink/70">{title}</span>
        </nav>
        <p className="shrink-0 font-sans text-[13px] text-ink/55">
          {results.length} {results.length === 1 ? "style" : "styles"}
        </p>
      </div>

      <div className="mt-3 lg:mt-4 lg:grid lg:grid-cols-[28fr_72fr] lg:gap-10">
        {/* Left column — the ENTIRE rail is fixed on desktop (sticky): the title
            and filters stay put while only the product grid on the right scrolls.
            On mobile the grid collapses, so it just stacks above the products
            (no sticky). It's a fixed-height flex column so the filter list can
            scroll within the rail if it overflows. */}
        <div className="lg:sticky lg:top-[150px] lg:flex lg:h-[calc(100vh-210px)] lg:flex-col">
          {/* Header — eyebrow + title (the style count now sits on the breadcrumb line). */}
          <div className="lg:shrink-0">
            {eyebrow && (
              <p className="font-nav text-[11px] uppercase tracking-[0.24em] text-burgundy">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl md:text-[42px]">
              {title}
            </h1>
          </div>

          {/* Mobile filter trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="mt-5 flex items-center gap-2 rounded-full border border-taupe/50 px-4 py-2.5 font-nav text-[12px] uppercase tracking-[0.14em] text-ink transition hover:border-burgundy hover:text-burgundy lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-cream">
                {activeCount}
              </span>
            )}
          </button>

          {/* Desktop filters — fill the rest of the fixed rail; the list itself
              scrolls (data-lenis-prevent) independently of the main page. */}
          <div className="mt-8 hidden min-h-0 flex-1 flex-col lg:flex">
            <FilterPanel {...panelProps} />
          </div>
        </div>

        {/* Product grid */}
        <div>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6 xl:grid-cols-3">
              {results.map((p) => (
                <ShopProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-taupe/50 py-24 text-center">
              <div>
                <p className="font-display text-2xl text-ink">No styles match your filters</p>
                <p className="mt-2 font-sans text-sm text-ink/55">
                  Try widening the price range or clearing a few filters.
                </p>
                <button
                  type="button"
                  onClick={onClear}
                  className="mt-5 rounded-full bg-burgundy px-6 py-2.5 font-nav text-[12px] uppercase tracking-[0.14em] text-cream transition hover:bg-burgundy/90"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-60 lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div
          aria-hidden
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          data-open={drawerOpen}
          data-lenis-prevent
          className="filter-drawer absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-cream-soft px-5 py-4 shadow-[0_0_60px_rgba(61,18,32,0.28)]"
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-[0.05em]">Filters</h2>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setDrawerOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full text-ink/60 transition hover:bg-taupe-soft hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <FilterPanel {...panelProps} />
        </aside>
      </div>
    </div>
  );
}
