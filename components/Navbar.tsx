"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Plus } from "lucide-react";
import { navCategories, brand } from "@/lib/data";
import AnnouncementBar from "./AnnouncementBar";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "./CartProvider";
import { useFavorites } from "./FavoritesProvider";

/* `forceSolid` keeps the navbar in its solid/light-on-cream treatment on
   interior pages (shop listings, product details) that have no hero behind it.
   The homepage leaves it off, so the nav stays transparent over the hero. */
export default function Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const { count: wishCount, setOpen: setFavOpen } = useFavorites();

  // Toggle the solid (scrolled) vs transparent (over-hero) treatment.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = scrolled || openMenu !== null || forceSolid;
  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-full transition hover:opacity-60";

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50" style={{ viewTransitionName: "site-nav" }}>
      <AnnouncementBar collapsed={scrolled} />

      <div
        onMouseLeave={() => setOpenMenu(null)}
        className={`relative transition-colors duration-300 ${
          solid
            ? "bg-cream-soft/98 text-ink shadow-[0_2px_24px_rgba(61,18,32,0.08)] backdrop-blur"
            : "text-cream"
        }`}
      >
        {/* Legibility scrim when transparent over the hero image */}
        {!solid && (
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/45 via-black/15 to-transparent" />
        )}

        <div className="relative mx-auto max-w-360 px-4 sm:px-6">
          {/* Row 1 — hamburger (mobile) · centered wordmark · utility icons */}
          <div className="flex h-16 items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center lg:justify-self-start">
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className={`${iconBtn} lg:hidden`}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <Link
              href="/"
              className="whitespace-nowrap font-display text-lg font-semibold tracking-[0.2em] sm:text-2xl sm:tracking-[0.32em] lg:justify-self-center lg:text-[26px]"
            >
              {brand.wordmark}
            </Link>

            <div className="flex items-center justify-end gap-1 sm:gap-2 lg:justify-self-end">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
                className={`${iconBtn} hidden sm:grid`}
              >
                <Search className="h-4.5 w-4.5" />
              </button>
              <Link href="/login" aria-label="Account" className={iconBtn}>
                <User className="h-4.5 w-4.5" />
              </Link>
              <button
                aria-label="Wishlist"
                onClick={() => setFavOpen(true)}
                className={`${iconBtn} relative hidden sm:grid`}
              >
                <Heart className="h-4.5 w-4.5" />
                {wishCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-cream">
                    {wishCount}
                  </span>
                )}
              </button>
              <button
                aria-label="Cart"
                onClick={() => setCartOpen(true)}
                className={`${iconBtn} relative`}
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-cream">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Row 2 — centered category links with mega-menus (desktop) */}
          <ul
            className={`hidden justify-center gap-8 border-t py-3.5 lg:flex ${
              solid ? "border-taupe/30" : "border-cream/20"
            }`}
          >
            {navCategories.map((cat) => (
              <li key={cat.label} onMouseEnter={() => setOpenMenu(cat.columns ? cat.label : null)}>
                <Link
                  href={cat.href}
                  onFocus={() => setOpenMenu(cat.columns ? cat.label : null)}
                  className="flex items-center gap-1 font-nav text-[12.5px] font-medium uppercase tracking-[0.16em]"
                >
                  <span className="nav-underline">{cat.label}</span>
                  {cat.columns && <ChevronDown className="h-3.5 w-3.5 opacity-70" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mega-menu panel */}
        {navCategories.map((cat) =>
          cat.columns && openMenu === cat.label ? (
            <div
              key={cat.label}
              onMouseEnter={() => setOpenMenu(cat.label)}
              className="absolute inset-x-0 top-full hidden border-t border-taupe/40 bg-cream-soft/98 text-ink shadow-[0_20px_40px_rgba(61,18,32,0.12)] lg:block"
            >
              <div className="mx-auto grid max-w-360 grid-cols-[repeat(2,minmax(0,220px))_1fr] gap-10 px-8 py-8">
                {cat.columns.map((col, i) => (
                  <div key={i}>
                    {col.heading && (
                      <p className="mb-3 font-nav text-[11px] uppercase tracking-[0.2em] text-burgundy/70">
                        {col.heading}
                      </p>
                    )}
                    <ul className="space-y-2.5">
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <Link
                            href={l.href}
                            className="font-display text-lg text-ink/80 transition-colors hover:text-burgundy"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="flex items-end justify-end">
                  <Link
                    href={cat.href}
                    className="font-nav text-[12px] uppercase tracking-[0.16em] text-burgundy underline-offset-4 hover:underline"
                  >
                    View all {cat.label} →
                  </Link>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-cream-soft text-ink shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-taupe/40 px-5 py-4">
            <span className="font-display text-lg font-semibold tracking-[0.28em]">
              {brand.wordmark}
            </span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className={iconBtn}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            {/* Search trigger — opens the same panel on phones */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
              className="mb-3 flex w-full items-center gap-3 rounded-full border border-taupe/50 px-4 py-3 text-left font-sans text-sm text-ink/60 transition hover:border-burgundy/60 hover:text-burgundy"
            >
              <Search className="h-4.5 w-4.5 shrink-0" />
              Search for kurtas, gowns…
            </button>

            <ul className="divide-y divide-taupe/30">
              {navCategories.map((cat) => (
                <li key={cat.label} className="py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={cat.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 py-3 font-nav text-sm uppercase tracking-[0.14em]"
                    >
                      {cat.label}
                    </Link>
                    {cat.columns && (
                      <button
                        aria-label={`Toggle ${cat.label}`}
                        onClick={() =>
                          setMobileSection((s) => (s === cat.label ? null : cat.label))
                        }
                        className="grid h-9 w-9 place-items-center"
                      >
                        <Plus
                          className={`h-4 w-4 transition-transform ${
                            mobileSection === cat.label ? "rotate-45" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {cat.columns && mobileSection === cat.label && (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-3 pl-1">
                      {cat.columns.flatMap((col) =>
                        col.links.map((l) => (
                          <li key={l.label}>
                            <Link
                              href={l.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1.5 font-display text-base text-ink/75"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-taupe/40 px-5 py-4 font-sans text-sm text-ink/70">
            <a href={brand.phoneHref} className="block">
              {brand.phone}
            </a>
            <a href={`mailto:${brand.email}`} className="block">
              {brand.email}
            </a>
          </div>
        </aside>
      </div>
    </header>

    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
