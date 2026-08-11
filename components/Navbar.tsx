"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, Plus, Sparkles, Phone } from "lucide-react";
import { useLenis } from "lenis/react";
import { navCategories, brand, type NavCategory } from "@/lib/data";
import AnnouncementBar from "./AnnouncementBar";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "./CartProvider";
import { useFavorites } from "./FavoritesProvider";

/* One navbar for every page: brand pinned left, category links centered, utility
   icons right (a 1fr / auto / 1fr grid keeps the links optically centered).
   `forceSolid` keeps it in the solid cream treatment on pages with no hero behind
   it (product detail); otherwise it stays see-through over the hero and turns
   solid on scroll — unchanged from before. `autoHide` (homepage only) slides the
   whole bar up when scrolling down and back in when scrolling up. */
export default function Navbar({
  forceSolid = false,
  autoHide = false,
}: {
  forceSolid?: boolean;
  autoHide?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [mobileSubSection, setMobileSubSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const { count: wishCount, setOpen: setFavOpen } = useFavorites();
  const lenis = useLenis();

  // Mobile menu shortcuts → close the drawer, then smooth-scroll to the section.
  const goToContact = () => {
    setMobileOpen(false);
    requestAnimationFrame(() => lenis?.scrollTo("#contact", { offset: -80 }));
  };
  const goToWhy = () => {
    setMobileOpen(false);
    requestAnimationFrame(() => lenis?.scrollTo("#why", { offset: -80 }));
  };

  // Toggle the solid (scrolled) vs transparent (over-hero) treatment.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-hide (homepage): reveal on scroll-up, hide on scroll-down, always show
  // near the very top. Direction tracked without re-subscribing each render.
  const lastY = useRef(0);
  useEffect(() => {
    if (!autoHide) return;
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 90) setHidden(false);
      else if (y > lastY.current + 6) setHidden(true);
      else if (y < lastY.current - 6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [autoHide]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = scrolled || openMenu !== null || forceSolid;
  // Icon buttons run a touch smaller on phones so the left/right clusters stay
  // narrow — the [1fr auto 1fr] grid then pads the centered wordmark on both
  // sides (icons no longer hug the brand). Full size returns at ≥sm.
  const iconBtn =
    "grid h-8 w-8 place-items-center rounded-full transition hover:opacity-60 sm:h-9 sm:w-9";

  // Utility icons — shared cluster.
  const iconCluster = (
    <>
      <button
        aria-label="Search"
        onClick={() => setSearchOpen((v) => !v)}
        className={`${iconBtn} hidden sm:grid`}
      >
        <Search className="h-4.5 w-4.5" />
      </button>
      <Link href="/login" aria-label="Account" className={`${iconBtn} hidden lg:grid`}>
        <User className="h-4.5 w-4.5" />
      </Link>
      <button
        aria-label="Wishlist"
        onClick={() => setFavOpen(true)}
        className={`${iconBtn} relative`}
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
    </>
  );

  // One desktop nav item — a link, plus a chevron when it opens a mega-menu.
  const renderDesktopItem = (cat: NavCategory) => (
    <li key={cat.label} onMouseEnter={() => setOpenMenu(cat.columns ? cat.label : null)}>
      <Link
        href={cat.href}
        onFocus={() => setOpenMenu(cat.columns ? cat.label : null)}
        className="flex items-center gap-1 whitespace-nowrap font-nav text-[12px] font-medium uppercase tracking-[0.08em]"
      >
        <span className="nav-underline">{cat.label}</span>
        {cat.columns && <ChevronDown className="h-3.5 w-3.5 opacity-70" />}
      </Link>
    </li>
  );

  // Mobile drawer: "New" sits alone at the top; the four "main" categories
  // (Sarees · Ethnicwear · Western · Innerwear) appear both inside the
  // "All Categories" accordion and as standalone links below it.
  const newCat = navCategories.find((c) => c.label === "New");
  const otherCats = navCategories.filter((c) => c.label !== "New");

  // Desktop "All Categories" mega-menu columns — each main category with its
  // subcategories (or a single "all" link when it has none).
  const allCatColumns = otherCats.map((cat) => ({
    heading: cat.label,
    href: cat.href,
    links: cat.columns
      ? cat.columns.flatMap((col) => col.links)
      : [{ label: `All ${cat.label}`, href: cat.href }],
  }));

  // One drawer row: a plain link, or link + Plus accordion for grouped cats.
  const renderMobileCat = (cat: NavCategory) => (
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
            onClick={() => setMobileSection((s) => (s === cat.label ? null : cat.label))}
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
      {cat.columns && (
        <div
          className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
            mobileSection === cat.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
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
                )),
              )}
            </ul>
          </div>
        </div>
      )}
    </li>
  );

  return (
    <>
      <header
        data-hidden={autoHide && hidden}
        className="site-nav-header fixed inset-x-0 top-0 z-50"
        style={{ viewTransitionName: "site-nav" }}
      >
        <AnnouncementBar collapsed={scrolled} />

        <div
          onMouseLeave={() => setOpenMenu(null)}
          className={`relative transition-colors duration-300 ${
            solid
              ? "bg-cream-soft/98 text-ink shadow-[0_2px_24px_rgba(61,18,32,0.08)] backdrop-blur"
              : "text-cream"
          }`}
        >
          {/* Legibility scrim when transparent over a hero image */}
          {!solid && (
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/45 via-black/15 to-transparent" />
          )}

          {/* Single row. Desktop: brand left · links centered · icons right.
              Mobile: hamburger left · brand centered · icons right. */}
          <div className="relative mx-auto max-w-360 px-2 sm:px-6">
            <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-4 lg:flex lg:justify-between lg:gap-0">
              {/* Left — hamburger (mobile) · wordmark (desktop) */}
              <div className="flex items-center justify-self-start">
                <button
                  aria-label="Open menu"
                  onClick={() => setMobileOpen(true)}
                  className={`${iconBtn} lg:hidden`}
                >
                  <Menu className="h-4.5 w-4.5" />
                </button>
                <Link
                  href="/"
                  className="hidden whitespace-nowrap font-display text-lg font-semibold tracking-[0.2em] sm:text-xl lg:block"
                >
                  {brand.wordmark}
                </Link>
              </div>

              {/* Center — wordmark (mobile) · category links (desktop) */}
              <div className="justify-self-center">
                <Link
                  href="/"
                  className="block whitespace-nowrap font-display text-[22px] font-semibold tracking-[0.14em] lg:hidden"
                >
                  {brand.wordmark}
                </Link>
                <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
                  {newCat && renderDesktopItem(newCat)}
                  <li onMouseEnter={() => setOpenMenu(null)}>
                    <Link
                      href="/shop/all"
                      className="flex items-center gap-1 whitespace-nowrap font-nav text-[12px] font-medium uppercase tracking-[0.08em]"
                    >
                      <span className="nav-underline">All Products</span>
                    </Link>
                  </li>
                  <li onMouseEnter={() => setOpenMenu("All Categories")}>
                    <Link
                      href="/shop/all"
                      onFocus={() => setOpenMenu("All Categories")}
                      className="flex items-center gap-1 whitespace-nowrap font-nav text-[12px] font-medium uppercase tracking-[0.08em]"
                    >
                      <span className="nav-underline">All Categories</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    </Link>
                  </li>
                  {otherCats.map((cat) => renderDesktopItem(cat))}
                </ul>
              </div>

              {/* Right — utility icons (even gap so they breathe, not touch) */}
              <div className="flex items-center gap-0.5 justify-self-end sm:gap-2">{iconCluster}</div>
            </div>
          </div>
        </div>

        {/* Mega-menu panel */}
        {navCategories.map((cat) =>
          cat.columns && openMenu === cat.label ? (
            <div
              key={cat.label}
              onMouseEnter={() => setOpenMenu(cat.label)}
              onMouseLeave={() => setOpenMenu(null)}
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

        {/* Mega-menu panel — All Categories (every main category + its subs) */}
        {openMenu === "All Categories" && (
          <div
            onMouseEnter={() => setOpenMenu("All Categories")}
            onMouseLeave={() => setOpenMenu(null)}
            className="absolute inset-x-0 top-full hidden border-t border-taupe/40 bg-cream-soft/98 text-ink shadow-[0_20px_40px_rgba(61,18,32,0.12)] lg:block"
          >
            <div className="mx-auto max-w-360 px-8 py-8">
              <div className="grid grid-cols-4 gap-10">
                {allCatColumns.map((col) => (
                  <div key={col.heading}>
                    <Link
                      href={col.href}
                      className="mb-3 block font-nav text-[11px] uppercase tracking-[0.2em] text-burgundy/70 transition-colors hover:text-burgundy"
                    >
                      {col.heading}
                    </Link>
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
              </div>
            </div>
          </div>
        )}

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
            {/* Search bar + close on a single line */}
            <div className="flex items-center gap-3 border-b border-taupe/40 px-5 py-3.5">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="flex flex-1 items-center gap-3 rounded-full border border-taupe/50 px-4 py-2.5 text-left font-sans text-sm text-ink/60 transition hover:border-burgundy/60 hover:text-burgundy"
              >
                <Search className="h-4.5 w-4.5 shrink-0" />
                Search for sarees, kurtis…
              </button>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className={`${iconBtn} shrink-0`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-2">
              <ul className="divide-y divide-taupe/30">
                {/* New — only the tagged new-arrival items */}
                {newCat && renderMobileCat(newCat)}

                {/* All Products — the entire store (/shop/all) */}
                <li className="py-1">
                  <Link
                    href="/shop/all"
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-nav text-sm uppercase tracking-[0.14em]"
                  >
                    All Products
                  </Link>
                </li>

                {/* All Categories — accordion of the 4 mains; Ethnicwear &
                    Western nest one level further into their subcategories */}
                <li className="py-1">
                  <button
                    type="button"
                    aria-expanded={mobileSection === "All Categories"}
                    onClick={() =>
                      setMobileSection((s) => (s === "All Categories" ? null : "All Categories"))
                    }
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="flex-1 py-3 font-nav text-sm uppercase tracking-[0.14em]">
                      All Categories
                    </span>
                    <span className="grid h-9 w-9 place-items-center">
                      <Plus
                        className={`h-4 w-4 transition-transform ${
                          mobileSection === "All Categories" ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                      mobileSection === "All Categories"
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="pl-1">
                        {otherCats.map((cat) => (
                          <li key={cat.label}>
                            {cat.columns ? (
                              <>
                                <div className="flex items-center justify-between">
                                  <Link
                                    href={cat.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex-1 py-2.5 font-display text-base text-ink/80"
                                  >
                                    {cat.label}
                                  </Link>
                                  <button
                                    aria-label={`Toggle ${cat.label}`}
                                    onClick={() =>
                                      setMobileSubSection((s) =>
                                        s === cat.label ? null : cat.label,
                                      )
                                    }
                                    className="grid h-8 w-8 place-items-center"
                                  >
                                    <Plus
                                      className={`h-3.5 w-3.5 transition-transform ${
                                        mobileSubSection === cat.label ? "rotate-45" : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                                <div
                                  className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                                    mobileSubSection === cat.label
                                      ? "grid-rows-[1fr] opacity-100"
                                      : "grid-rows-[0fr] opacity-0"
                                  }`}
                                >
                                  <div className="overflow-hidden">
                                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-2 pl-3">
                                      {cat.columns.flatMap((col) =>
                                        col.links.map((l) => (
                                          <li key={l.label}>
                                            <Link
                                              href={l.href}
                                              onClick={() => setMobileOpen(false)}
                                              className="block py-1.5 font-display text-sm text-ink/70"
                                            >
                                              {l.label}
                                            </Link>
                                          </li>
                                        )),
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <Link
                                href={cat.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2.5 font-display text-base text-ink/80"
                              >
                                {cat.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>

                {/* Existing standalone category links */}
                {otherCats.map((cat) => renderMobileCat(cat))}
              </ul>
            </nav>

            {/* Pinned at the bottom — My Account (link) sits above Why Choose Us
                and Contact Us (which close the drawer and scroll to their sections). */}
            <div className="mt-auto shrink-0 border-t border-taupe/40 px-4 py-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center gap-3 py-3 text-left font-nav text-sm uppercase tracking-[0.14em]"
              >
                <User className="h-4.5 w-4.5 shrink-0" strokeWidth={1.5} />
                My Account
              </Link>
              <button
                type="button"
                onClick={goToWhy}
                className="flex w-full items-center gap-3 border-t border-taupe/30 py-3 text-left font-nav text-sm uppercase tracking-[0.14em]"
              >
                <Sparkles className="h-4.5 w-4.5 shrink-0" strokeWidth={1.5} />
                Why Choose Us
              </button>
              <button
                type="button"
                onClick={goToContact}
                className="flex w-full items-center gap-3 border-t border-taupe/30 py-3 text-left font-nav text-sm uppercase tracking-[0.14em]"
              >
                <Phone className="h-4.5 w-4.5 shrink-0" strokeWidth={1.5} />
                Contact Us
              </button>
            </div>
          </aside>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
