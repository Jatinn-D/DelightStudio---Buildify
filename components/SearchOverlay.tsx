"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { catalog } from "@/lib/data";

const RECENT_KEY = "ds-recent-searches";
const MAX_RECENT = 8;
const MAX_RESULTS = 24; // cap the grid — the catalogue is large
const POPULAR = ["Saree", "Kurti", "Anarkali", "Jeans", "Top"];
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

type SortValue = "featured" | "price-asc" | "price-desc" | "newest";
type PriceValue = "all" | "u2000" | "2000-3500" | "o3500";

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];
const PRICE_OPTIONS: { value: PriceValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "u2000", label: "Under ₹1,000" },
  { value: "2000-3500", label: "₹1,000–2,500" },
  { value: "o3500", label: "Above ₹2,500" },
];
/* Derived once from the data so it stays in sync with lib/data.ts. */
const CATEGORIES = Array.from(new Set(catalog.map((p) => p.category)));

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState(""); // what's typed
  const [submitted, setSubmitted] = useState(""); // what's actually searched
  const [focused, setFocused] = useState(false); // drives the "Search" pill reveal
  const [recent, setRecent] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortValue>("featured");
  const [priceRange, setPriceRange] = useState<PriceValue>("all");
  const [category, setCategory] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  /* ---- load recent searches from localStorage once, deferred out of the
         commit phase so it isn't a synchronous state update inside an effect ---- */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(RECENT_KEY);
        if (raw) setRecent(JSON.parse(raw));
      } catch {
        /* ignore malformed storage */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* ---- autofocus the input when the panel opens ---- */
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  /* ---- lock page scroll while open (pause Lenis only — keeps the native
         scrollbar visible so it never disappears / shifts the layout) ---- */
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [open, lenis]);

  /* ---- Esc: close the filter popover first if it's open, else the search.
         (When we reach the else branch the popover is already closed, so no
         extra reset is needed here.) ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (filterOpen) setFilterOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filterOpen, onClose]);

  /* ---- click outside the filter popover closes just the popover ---- */
  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [filterOpen]);

  const persist = (list: string[]) => {
    setRecent(list);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  };

  const commitSearch = (term: string) => {
    const t = term.trim();
    if (!t) return;
    persist([t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT));
  };
  /* Run the search (only now do results appear) and record it under Recent. */
  const runSearch = (term: string) => {
    const t = term.trim();
    setSubmitted(t);
    commitSearch(t);
  };
  const submitCurrent = () => runSearch(query);
  /* Picking a recent / popular term fills the box and searches it in one tap. */
  const pickTerm = (term: string) => {
    setQuery(term);
    runSearch(term);
    inputRef.current?.focus();
  };
  const removeRecent = (term: string) => persist(recent.filter((r) => r !== term));
  const clearAll = () => persist([]);
  const clearQuery = () => {
    setQuery("");
    setSubmitted("");
    inputRef.current?.focus();
  };
  const resetFilters = () => {
    setSort("featured");
    setPriceRange("all");
    setCategory("all");
  };
  /* single close path — also tidies the popover so it never lingers on reopen */
  const closeSearch = () => {
    setFilterOpen(false);
    onClose();
  };

  const inBucket = (price: number) => {
    switch (priceRange) {
      case "u2000":
        return price < 1000;
      case "2000-3500":
        return price >= 1000 && price <= 2500;
      case "o3500":
        return price > 2500;
      default:
        return true;
    }
  };

  // Results follow the *submitted* term, not the live keystrokes — nothing is
  // searched until the Search button (or Enter) fires.
  const q = submitted.trim().toLowerCase();
  const showPill = focused || query.length > 0;
  let results = catalog.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (category !== "all" && p.category !== category) return false;
    if (!inBucket(p.price)) return false;
    return true;
  });
  if (sort === "price-asc") results = [...results].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") results = [...results].sort((a, b) => b.price - a.price);
  else if (sort === "newest")
    results = [...results].sort(
      (a, b) => (b.tag === "New" ? 1 : 0) - (a.tag === "New" ? 1 : 0),
    );

  const filtersActive =
    (sort !== "featured" ? 1 : 0) + (priceRange !== "all" ? 1 : 0) + (category !== "all" ? 1 : 0);
  const showingResults = Boolean(q) || filtersActive > 0;

  return (
    <div
      className={`fixed inset-0 z-60 flex items-start justify-center px-4 pt-[7vh] pb-4 sm:pt-[9vh] ${
        open ? "" : "pointer-events-none"
      }`}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Click-catcher backdrop — click to close */}
      <div
        aria-hidden
        onClick={closeSearch}
        className={`absolute inset-0 bg-transparent transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Centered search box — ~3/5 width on desktop, small rounded corners.
          Always mounted; the `open` prop drives the CSS transition both ways. */}
      <div
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="search-panel relative flex max-h-[84vh] w-full flex-col overflow-hidden rounded-md bg-cream-soft text-ink shadow-[0_24px_70px_rgba(61,18,32,0.28)] ring-1 ring-taupe/30 sm:w-4/5 lg:w-3/5"
      >
        {/* Sticky search header (raised above the body so the popover overlays it) */}
        <div className="relative z-30 shrink-0 border-b border-taupe/30 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center rounded-full border border-taupe/50 bg-cream py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-burgundy">
              {/* Leading magnifier — collapses away once you start typing so the
                  text runs from the very start of the bar */}
              <span
                aria-hidden
                className={`grid shrink-0 place-items-center overflow-hidden text-burgundy transition-all duration-300 ${
                  query ? "w-0 opacity-0" : "mr-2.5 w-5 opacity-100"
                }`}
              >
                <Search className="h-5 w-5" />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitCurrent();
                }}
                placeholder="Search for sarees, kurtis…"
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent font-sans text-base text-ink placeholder:text-ink/40 focus:outline-none"
              />
              {/* Clear the typed text — only shown when there is any */}
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={clearQuery}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-ink/45 transition hover:bg-taupe-soft hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              {/* "Search" pill — sweeps in when the bar is focused; runs the
                  search on click. Pill shape mirrors the bar's oval ends. */}
              <div
                className={`shrink-0 overflow-hidden transition-all duration-300 ease-out ${
                  showPill ? "ml-2 max-w-[9rem] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // keep input focus
                  onClick={submitCurrent}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-burgundy px-4 py-1.5 font-nav text-[11px] uppercase tracking-[0.14em] text-cream transition hover:bg-burgundy/90"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search
                </button>
              </div>
            </div>

            {/* Filter & sort — toggles the popover below */}
            <div ref={filterRef} className="relative">
              <button
                type="button"
                aria-label="Filter and sort"
                aria-expanded={filterOpen}
                onClick={() => setFilterOpen((v) => !v)}
                className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
                  filterOpen || filtersActive > 0
                    ? "bg-burgundy/10 text-burgundy"
                    : "text-ink/60 hover:bg-taupe-soft hover:text-ink"
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
                {filtersActive > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-burgundy px-1 font-nav text-[10px] leading-none text-cream ring-2 ring-cream-soft">
                    {filtersActive}
                  </span>
                )}
              </button>

              {/* Filter popover — always mounted; `data-open` drives the transition */}
              <div
                data-open={open && filterOpen}
                data-lenis-prevent
                inert={!(open && filterOpen)}
                className={`filter-popover absolute right-0 top-full z-10 mt-2 max-h-[min(70vh,26rem)] w-[min(84vw,17rem)] overflow-y-auto rounded-xl border border-taupe/30 bg-cream-soft p-4 shadow-[0_18px_50px_rgba(61,18,32,0.22)] ${
                  open && filterOpen ? "" : "pointer-events-none"
                }`}
              >
                <h4 className="mb-3 font-nav text-[11px] uppercase tracking-[0.2em] text-ink/60">
                  Filter &amp; Sort
                </h4>

                {/* Sort */}
                <p className="mb-1.5 font-sans text-xs font-medium text-ink/50">Sort by</p>
                <div className="mb-4 flex flex-col gap-0.5">
                  {SORT_OPTIONS.map((opt) => {
                    const active = sort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSort(opt.value)}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left font-sans text-sm transition ${
                          active ? "bg-burgundy/10 text-burgundy" : "text-ink/75 hover:bg-taupe-soft/60"
                        }`}
                      >
                        <span
                          className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border ${
                            active ? "border-burgundy" : "border-taupe"
                          }`}
                        >
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-burgundy" />}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Price */}
                <p className="mb-1.5 font-sans text-xs font-medium text-ink/50">Price</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {PRICE_OPTIONS.map((opt) => {
                    const active = priceRange === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPriceRange(opt.value)}
                        className={`rounded-full px-3 py-1 font-sans text-xs transition ${
                          active
                            ? "bg-burgundy text-cream"
                            : "bg-taupe-soft/60 text-ink/75 hover:bg-taupe-soft"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Category */}
                <p className="mb-1.5 font-sans text-xs font-medium text-ink/50">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className={`rounded-full px-3 py-1 font-sans text-xs transition ${
                      category === "all"
                        ? "bg-burgundy text-cream"
                        : "bg-taupe-soft/60 text-ink/75 hover:bg-taupe-soft"
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((c) => {
                    const active = category === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={`rounded-full px-3 py-1 font-sans text-xs transition ${
                          active
                            ? "bg-burgundy text-cream"
                            : "bg-taupe-soft/60 text-ink/75 hover:bg-taupe-soft"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-taupe/25 pt-3">
                  <span className="font-sans text-xs text-ink/55">
                    {results.length} {results.length === 1 ? "item" : "items"}
                  </span>
                  <button
                    type="button"
                    onClick={resetFilters}
                    disabled={filtersActive === 0}
                    className="font-nav text-[11px] uppercase tracking-[0.14em] text-burgundy transition hover:opacity-70 disabled:cursor-not-allowed disabled:text-ink/25 disabled:hover:opacity-100"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>

            {/* Close the whole search */}
            <button
              type="button"
              aria-label="Close search"
              onClick={closeSearch}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink/60 transition hover:bg-taupe-soft hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body (uses the same slim burgundy scrollbar as the page) */}
        <div data-lenis-prevent className="overflow-y-auto px-4 py-5 sm:px-6">
          {/* Recent searches */}
          {recent.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-nav text-[11px] uppercase tracking-[0.2em] text-ink/55">
                  Recent Searches
                </h3>
                <button
                  type="button"
                  onClick={clearAll}
                  className="font-nav text-[11px] uppercase tracking-[0.14em] text-burgundy transition hover:opacity-70"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((term) => (
                  <div
                    key={term}
                    className="group flex items-center gap-1.5 rounded-full border border-taupe/50 py-1.5 pl-3.5 pr-2 text-sm transition hover:border-burgundy/60"
                  >
                    <button
                      type="button"
                      onClick={() => pickTerm(term)}
                      className="font-sans text-ink/80 transition group-hover:text-burgundy"
                    >
                      {term}
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${term}`}
                      onClick={() => removeRecent(term)}
                      className="grid h-5 w-5 place-items-center rounded-full text-ink/40 transition hover:bg-burgundy hover:text-cream"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches (only when the box is empty) */}
          {!q && (
            <div className="mb-6">
              <h3 className="mb-3 font-nav text-[11px] uppercase tracking-[0.2em] text-ink/55">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => pickTerm(term)}
                    className="rounded-full bg-taupe-soft/70 px-3.5 py-1.5 font-sans text-sm text-ink/75 transition hover:bg-burgundy hover:text-cream"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          <h3 className="mb-4 font-nav text-[11px] uppercase tracking-[0.2em] text-ink/55">
            {showingResults ? "Results" : "Popular Right Now"}
            {results.length > 0 && <span className="text-ink/35"> · {results.length}</span>}
          </h3>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
              {results.slice(0, MAX_RESULTS).map((p) => (
                <Link
                  key={p.slug}
                  href={p.href}
                  onClick={() => {
                    commitSearch(submitted);
                    closeSearch();
                  }}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-4/5 overflow-hidden rounded-md bg-taupe-soft">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 30vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {p.tag && (
                      <span className="absolute left-2 top-2 rounded-full bg-cream-soft/95 px-2.5 py-0.5 font-nav text-[9px] uppercase tracking-[0.14em] text-burgundy">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 line-clamp-1 font-sans text-sm text-ink transition-colors group-hover:text-burgundy">
                    {p.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-nav text-sm font-medium text-burgundy">{inr(p.price)}</span>
                    {p.mrp && (
                      <span className="font-sans text-xs text-ink/45 line-through">{inr(p.mrp)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Search className="h-6 w-6 text-taupe" />
              <p className="font-sans text-sm text-ink/60">
                No products match{q ? <> &ldquo;{submitted.trim()}&rdquo;</> : " these filters"}. Try
                adjusting your {filtersActive > 0 && !q ? "filters" : "search"}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
