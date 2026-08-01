/* ============================================================
   Delight Studio — content / data layer
   All product & category imagery lives in /public/images and is
   PLACEHOLDER stock, to be swapped for the client's real photos.
   Contact details are the client's real details (Brand Discovery form).
   ============================================================ */

export type NavLink = { label: string; href: string };
export type NavCategory = {
  label: string;
  href: string;
  /* mega-menu columns (only for categories that have subsections) */
  columns?: { heading?: string; links: NavLink[] }[];
};

/* Navbar categories — taken verbatim from maybellindia.com (client's reference). */
export const navCategories: NavCategory[] = [
  { label: "New", href: "/new" },
  {
    label: "Ethnicwear",
    href: "/ethnicwear",
    columns: [
      {
        heading: "Shop Ethnic",
        links: [
          { label: "Kurta", href: "/ethnicwear/kurta" },
          { label: "Kurta Sets", href: "/ethnicwear/kurta-sets" },
          { label: "Anarkali", href: "/ethnicwear/anarkali" },
          { label: "Skirt Sets", href: "/ethnicwear/skirt-sets" },
        ],
      },
      {
        heading: "More Styles",
        links: [
          { label: "Mix N Match", href: "/ethnicwear/mix-n-match" },
          { label: "Tunics", href: "/ethnicwear/tunics" },
          { label: "Shirt", href: "/ethnicwear/shirt" },
          { label: "Ethnic Dresses", href: "/ethnicwear/ethnic-dresses" },
        ],
      },
    ],
  },
  {
    label: "Nightwear",
    href: "/nightwear",
    columns: [
      {
        heading: "Shop Nightwear",
        links: [
          { label: "Nighty", href: "/nightwear/nighty" },
          { label: "PJ Set", href: "/nightwear/pj-set" },
        ],
      },
    ],
  },
  { label: "Kids", href: "/kids" },
  { label: "Bottomwear", href: "/bottomwear" },
  { label: "Maternitywear", href: "/maternitywear" },
  { label: "Plus Size", href: "/plus-size" },
];

export type Product = {
  name: string;
  price: number;
  mrp?: number;
  image: string;
  hoverImage?: string;
  href: string;
  tag?: string;
  category: string;
};

/* New Arrivals — placeholder products (names/prices to be confirmed by client). */
export const newArrivals: Product[] = [
  {
    name: "Scarlet Evening Gown",
    price: 4999,
    mrp: 6499,
    image: "/images/p2.jpg",
    hoverImage: "/images/p3.jpg",
    href: "/ethnicwear/ethnic-dresses",
    tag: "New",
    category: "Gowns",
  },
  {
    name: "Rosa Floral Flared Gown",
    price: 4199,
    mrp: 5299,
    image: "/images/p3.jpg",
    hoverImage: "/images/p2.jpg",
    href: "/ethnicwear/ethnic-dresses",
    tag: "New",
    category: "Gowns",
  },
  {
    name: "Ivory Shirt & Denim Set",
    price: 1899,
    image: "/images/p1.jpg",
    hoverImage: "/images/p4.jpg",
    href: "/ethnicwear/shirt",
    category: "Sets",
  },
  {
    name: "Monochrome Blouse & Skirt",
    price: 2799,
    mrp: 3499,
    image: "/images/p4.jpg",
    hoverImage: "/images/p1.jpg",
    href: "/ethnicwear/skirt-sets",
    tag: "Bestseller",
    category: "Sets",
  },
  {
    name: "Sunlit Summer Dress",
    price: 2299,
    image: "/images/p5.jpg",
    hoverImage: "/images/p6.jpg",
    href: "/ethnicwear/ethnic-dresses",
    category: "Dresses",
  },
  {
    name: "Noir Layered Jacket",
    price: 3599,
    mrp: 4299,
    image: "/images/p6.jpg",
    hoverImage: "/images/p5.jpg",
    href: "/ethnicwear/mix-n-match",
    tag: "New",
    category: "Jackets",
  },
];

export type Category = {
  name: string;
  href: string;
  image: string;
  /* bento span — "big" is a 2x2 feature tile, "wide" spans two columns */
  span?: "big" | "wide";
};

/* Shop by Category (bento) — a curated selection of the maybell categories.
   Order matters: it drives the bento's auto-placement so the grid tiles cleanly. */
export const categories: Category[] = [
  { name: "Kurta", href: "/ethnicwear/kurta", image: "/images/cat-kurta.jpg", span: "big" },
  { name: "Kurta Sets", href: "/ethnicwear/kurta-sets", image: "/images/cat-kurta-sets.jpg" },
  { name: "Skirt Sets", href: "/ethnicwear/skirt-sets", image: "/images/cat-skirt-sets.jpg" },
  { name: "Anarkali", href: "/ethnicwear/anarkali", image: "/images/cat-anarkali.jpg" },
  { name: "Bottomwear", href: "/bottomwear", image: "/images/cat-bottomwear.jpg" },
  { name: "Ethnic Dress", href: "/ethnicwear/ethnic-dresses", image: "/images/cat-ethnic-dress.jpg" },
  { name: "Shop All", href: "/new", image: "/images/cat-shop-all.jpg" },
  { name: "Nighty", href: "/nightwear/nighty", image: "/images/cat-nighty.jpg", span: "wide" },
];

/* Why Delight Studio — the client's own words from the Brand Discovery form. */
export const whyIntro =
  "At Delight Studio, every dress is carefully selected with attention to detail, ensuring premium quality, timely delivery, and complete customer satisfaction.";

export type Pillar = { title: string; text: string; icon: "gem" | "truck" | "heart" | "tag" };

export const whyPillars: Pillar[] = [
  {
    title: "Premium Quality",
    text: "Every piece hand-picked with attention to detail — fabric, fit and finish you can trust.",
    icon: "gem",
  },
  {
    title: "Timely Delivery",
    text: "Carefully packed and dispatched on time, so your favourites reach you when you need them.",
    icon: "truck",
  },
  {
    title: "Customer Satisfaction",
    text: "Complete customer satisfaction is at the heart of everything we do at Delight Studio.",
    icon: "heart",
  },
  {
    title: "Moderate Price",
    text: "High-quality women's fashion at moderate, honest prices — style that feels effortless.",
    icon: "tag",
  },
];

/* Real contact details (Brand Discovery form). */
export const brand = {
  name: "Delight Studio",
  wordmark: "DELIGHT STUDIO",
  phone: "+91 90948 87777",
  phoneHref: "tel:+919094887777",
  email: "delightstudio3939@gmail.com",
  instagram: "https://www.instagram.com/delightstudio_chennai/",
  instagramHandle: "@delightstudio_chennai",
  address:
    "No 45/1, Kamarajar Salai, Mathiazhagan Nagar, Shanthi Nagar, Annamalai Colony, Chennai, Tamil Nadu 600093",
};

/* Footer link columns (placeholder routes — homepage-only phase). */
export const footerShop: NavLink[] = [
  { label: "New Arrivals", href: "/new" },
  { label: "Ethnicwear", href: "/ethnicwear" },
  { label: "Nightwear", href: "/nightwear" },
  { label: "Kids", href: "/kids" },
  { label: "Plus Size", href: "/plus-size" },
];

export const footerQuick: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Track Order", href: "/track-order" },
  { label: "Store Locator", href: "/stores" },
  { label: "Contact Us", href: "/contact" },
];

export const footerPolicies: NavLink[] = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Exchange", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

/* ============================================================
   SHOP CATALOG — richer PLACEHOLDER products powering the
   category-listing (/ethnicwear/kurta …) and product-detail
   (/product/[slug]) pages. Structured so the client's backend
   dev can swap `catalog` for real data with the same shape.
   Images reuse the existing /public/images placeholders.
   ============================================================ */

/* The full size ladder the client stocks (3XS → 6XL). A product's own
   `sizes` array lists only the sizes actually IN STOCK — any ladder size
   not present renders greyed-out / "Not available" on the detail page. */
export const SIZE_LADDER = [
  "3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL",
] as const;
export type Size = (typeof SIZE_LADDER)[number];

export type CatalogProduct = Product & {
  slug: string;
  images: string[]; // gallery — [0] is the primary/card image
  types: string[]; // filter tags, e.g. ["Anarkali", "Embroidered"]
  sizes: Size[]; // sizes currently in stock (subset of SIZE_LADDER)
  stock: number; // units available
  fabric: string;
  color: string;
  description: string;
  rating: number;
  reviews: number;
};

/* Filterable "types" per shoppable category — drives the listing sidebar.
   Add a new entry here when you build out another category. */
export const KURTA_TYPES = [
  "Straight", "A-Line", "Anarkali", "V-Neck", "Embroidered", "Printed", "Chikankari", "Flared",
] as const;

export const categoryFacets: Record<string, { types: readonly string[] }> = {
  Kurta: { types: KURTA_TYPES },
};

const IMG = (n: string) => `/images/${n}.jpg`;

/* Small builder that fills the derived Product fields (image/hoverImage/href)
   and a templated description, so each entry below stays readable. */
function buildProduct(
  category: string,
  slug: string,
  name: string,
  types: string[],
  price: number,
  mrp: number,
  imgs: string[],
  sizes: Size[],
  stock: number,
  fabric: string,
  color: string,
  extra: Partial<CatalogProduct> = {},
): CatalogProduct {
  const images = imgs.map(IMG);
  return {
    slug,
    name,
    price,
    mrp,
    image: images[0],
    hoverImage: images[1],
    images,
    href: `/product/${slug}`,
    category,
    types,
    sizes,
    stock,
    fabric,
    color,
    description: `A ${types[0].toLowerCase()} kurta in ${color.toLowerCase()}, tailored from breathable ${fabric.toLowerCase()} for easy all-day wear. Finished with Delight Studio's signature attention to detail — effortless from desk to dinner.`,
    rating: 4.4,
    reviews: 48,
    ...extra,
  };
}

export const catalog: CatalogProduct[] = [
  buildProduct("Kurta", "sapphire-straight-kurta", "Sapphire Straight Kurta",
    ["Straight"], 999, 1499, ["p1", "p2", "cat-kurta"],
    ["3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"], 30,
    "Pure Cotton", "Sapphire",
    { tag: "Bestseller", rating: 4.8, reviews: 312 }),

  buildProduct("Kurta", "ivory-chikankari-straight-kurta", "Ivory Chikankari Straight Kurta",
    ["Chikankari", "Straight"], 1699, 2499, ["p4", "p1", "cat-kurta-sets"],
    ["XS", "S", "M", "L", "XL", "2XL", "3XL"], 8,
    "Cotton Mul", "Ivory",
    { rating: 4.7, reviews: 176 }),

  buildProduct("Kurta", "marigold-aline-printed-kurta", "Marigold A-Line Printed Kurta",
    ["A-Line", "Printed"], 1299, 1999, ["p5", "p6", "cat-kurta-sets"],
    ["S", "M", "L", "XL", "2XL", "3XL", "4XL"], 3,
    "Rayon", "Marigold",
    { rating: 4.5, reviews: 94 }),

  buildProduct("Kurta", "emerald-anarkali-kurta", "Emerald Anarkali Kurta",
    ["Anarkali"], 2799, 3799, ["p3", "p2", "cat-anarkali"],
    ["XS", "S", "M", "L", "XL", "2XL"], 12,
    "Georgette", "Emerald",
    { tag: "New", rating: 4.6, reviews: 58 }),

  buildProduct("Kurta", "rosewood-vneck-kurta", "Rosewood V-Neck Kurta",
    ["V-Neck", "Straight"], 1499, 2199, ["p2", "p3", "cat-ethnic-dress"],
    ["2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"], 20,
    "Cotton Blend", "Rosewood",
    { rating: 4.4, reviews: 130 }),

  buildProduct("Kurta", "indigo-blockprint-kurta", "Indigo Block-Print Kurta",
    ["Printed", "Straight"], 1099, 1599, ["p6", "p4", "cat-kurta"],
    ["S", "M", "L", "XL"], 5,
    "Cotton", "Indigo",
    { rating: 4.3, reviews: 71 }),

  buildProduct("Kurta", "blush-embroidered-kurta", "Blush Embroidered Kurta",
    ["Embroidered", "A-Line"], 2299, 3299, ["p1", "p5", "cat-kurta-sets"],
    ["XS", "S", "M", "L", "XL", "2XL", "3XL"], 9,
    "Chanderi", "Blush",
    { rating: 4.7, reviews: 205 }),

  buildProduct("Kurta", "saffron-flared-kurta", "Saffron Flared Kurta",
    ["Flared", "Printed"], 1799, 2599, ["p5", "p3", "cat-anarkali"],
    ["S", "M", "L", "XL", "2XL"], 2,
    "Rayon", "Saffron",
    { rating: 4.5, reviews: 63 }),

  buildProduct("Kurta", "wine-embroidered-anarkali", "Wine Embroidered Anarkali",
    ["Anarkali", "Embroidered"], 3299, 4599, ["p3", "p6", "cat-anarkali"],
    ["XS", "S", "M", "L", "XL", "2XL", "3XL"], 6,
    "Silk Blend", "Wine",
    { tag: "Editor's Pick", rating: 4.9, reviews: 88 }),

  buildProduct("Kurta", "mint-chikankari-aline-kurta", "Mint Chikankari A-Line Kurta",
    ["Chikankari", "A-Line"], 1899, 2699, ["p4", "p5", "cat-kurta-sets"],
    ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"], 14,
    "Cotton Mul", "Mint",
    { rating: 4.6, reviews: 121 }),

  buildProduct("Kurta", "onyx-vneck-straight-kurta", "Onyx V-Neck Straight Kurta",
    ["V-Neck", "Straight"], 1399, 1999, ["p2", "p1", "cat-ethnic-dress"],
    ["XS", "S", "M", "L", "XL"], 7,
    "Cotton Blend", "Onyx",
    { rating: 4.4, reviews: 82 }),

  buildProduct("Kurta", "coral-printed-flared-kurta", "Coral Printed Flared Kurta",
    ["Printed", "Flared"], 1599, 2399, ["p6", "p4", "cat-kurta"],
    ["2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL"], 11,
    "Rayon", "Coral",
    { rating: 4.5, reviews: 99 }),

  buildProduct("Kurta", "amber-embroidered-anarkali-kurta", "Amber Embroidered Anarkali Kurta",
    ["Anarkali", "Embroidered"], 2499, 3499, ["p3", "p5", "cat-anarkali"],
    ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"], 10,
    "Georgette", "Amber",
    { rating: 4.6, reviews: 74 }),
];

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return catalog.find((p) => p.slug === slug);
}

export function productsByCategory(category: string): CatalogProduct[] {
  return catalog.filter((p) => p.category === category);
}
