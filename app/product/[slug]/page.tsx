import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/shop/ProductDetail";
import { catalog, getCatalogProduct } from "@/lib/data";

/* Prerender a page for every catalog product. */
export function generateStaticParams() {
  return catalog.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) return { title: "Product — Delight Studio" };
  return {
    title: `${product.name} — Delight Studio`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) notFound();

  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-cream">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
