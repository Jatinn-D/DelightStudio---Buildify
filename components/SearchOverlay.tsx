"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { newArrivals } from "@/lib/data";

const RECENT_KEY = "ds-recent-searches";
const MAX_RECENT = 8;
const POPULAR = ["Kurta", "Anarkali", "Kurta Sets", "Nighty", "Bottomwear"];
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
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

  /* ---- Esc to close ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
  const removeRecent = (term: string) => persist(recent.filter((r) => r !== term));
  const clearAll = () => persist([]);
  const clearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const q = query.trim().toLowerCase();
  const results = q ? newArrivals.filter((p) => p.name.toLowerCase().includes(q)) : newArrivals;

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
        onClick={onClose}
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
        {/* Sticky search header */}
        <div className="shrink-0 border-b border-taupe/30 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2.5 rounded-full border border-taupe/50 bg-cream px-4 py-2.5 transition-colors focus-within:border-burgundy">
              <Search className="h-5 w-5 shrink-0 text-burgundy" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitSearch(query);
                }}
                placeholder="Search for kurtas, gowns…"
                aria-label="Search products"
                className="w-full bg-transparent font-sans text-base text-ink placeholder:text-ink/40 focus:outline-none"
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
            </div>
            {/* Close the whole search */}
            <button
              type="button"
              aria-label="Close search"
              onClick={onClose}
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
                      onClick={() => setQuery(term)}
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
                    onClick={() => setQuery(term)}
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
            {q ? "Products" : "Popular Right Now"}
          </h3>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
              {results.map((p) => (
                <Link
                  key={p.name}
                  href={p.href}
                  onClick={() => {
                    commitSearch(query);
                    onClose();
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
                No results for &ldquo;{query.trim()}&rdquo;. Try another search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
