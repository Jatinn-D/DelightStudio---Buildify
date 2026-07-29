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
