import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryHero from "@/components/shop/CategoryHero";
import CategoryListing from "@/components/shop/CategoryListing";
import {
  shopCategories,
  getShopCategory,
  productsForShop,
  facetsForShop,
  heroSlidesFor,
} from "@/lib/data";

/* Prerender a page for every shop category (sarees, kurtis, tops, …). */
export function generateStaticParams() {
  return shopCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cfg = getShopCategory(category);
  if (!cfg) return { title: "Shop — Delight Studio" };
  return { title: `${cfg.title} — Delight Studio`, description: cfg.subtitle };
}

export default async function ShopCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cfg = getShopCategory(category);
  if (!cfg) notFound();

  const products = productsForShop(category);
  const facetTypes = facetsForShop(category);
  const showSizes = products.some((p) => !p.freeSize && p.sizes.length > 0);

  return (
    <>
      {/* Transparent-over-hero navbar (turns solid on scroll), Casio-style */}
      <Navbar />
      <main className="min-h-screen bg-cream">
        <CategoryHero
          eyebrow={cfg.eyebrow}
          title={cfg.title}
          subtitle={cfg.subtitle}
          images={heroSlidesFor(category)}
          count={products.length}
        />
        <CategoryListing
          title={cfg.title}
          eyebrow={cfg.eyebrow}
          products={products}
          facetTypes={facetTypes}
          showSizes={showSizes}
          withHero
        />
      </main>
      <Footer />
    </>
  );
}
