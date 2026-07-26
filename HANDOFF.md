# Delight Studio — Frontend Handoff

Women's fashion storefront (homepage) for **Delight Studio**, Chennai.
**Frontend only** — Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Backend is separate.

## Run it
```bash
cd delightstudio-web
npm install        # first time only
npm run dev        # http://localhost:3000
npm run build      # production build check
```

## Page structure (`app/page.tsx`)
Announcement bar → Navbar → **Hero** → **New Arrivals** → **Shop by Category (bento)** →
**Why Delight Studio** → **Footer**. Each section is a component in `components/`.
All editable content (nav categories, products, categories, footer, contact) lives in **`lib/data.ts`**.

## What is placeholder vs. real
- **Real** (from the Brand Discovery form): brand name, phone, email, Instagram, store address,
  the "Why Delight Studio" wording, and the burgundy brand colour `#6B2138`.
- **Placeholder** (swap for the client's own): all photos in `public/images/`, product
  names/prices, and the announcement-bar messages. Nav links point to placeholder routes.

## Swap the hero image
The hero is **image-only, no overlay text** (per the brief — the client supplies a custom image
with text baked in). Replace **`public/images/hero.jpg`** (keep the name) — recommended
~2000×1150px, or edit the `src` in `components/Hero.tsx`.

## Colour palette (defined in `app/globals.css`)
Burgundy `#6B2138` (primary) · deep `#4E1729` · cream `#F3ECE0` (base) · soft cream `#FAF6EF` ·
taupe `#C9B79C` · gold `#B08D57` · ink `#241C1A`. Fonts: Cormorant Garamond (display), Jost (nav),
Inter (body).

## Notes / decisions
- **Navbar**: Vastrado's centred-wordmark + right-icons layout is kept, but maybell has **7 long
  category names** that don't fit beside a centred wordmark on one row — so the categories sit on a
  second centred row beneath the wordmark (with hover mega-menus for Ethnicwear & Nightwear). Nav
  categories are **maybell-exact** (incl. Kids).
- **Bento** "Shop by Category" is full-bleed edge-to-edge with a ~10–14px gap (tunable in
  `components/BentoCategories.tsx` — search `gap-[10px]` / `sm:gap-3`).
- **Deferred**: `/login` (a stub link exists on the account icon; build to the client's spec) and
  all backend/cart/wishlist logic.
