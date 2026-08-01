import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryListing from "@/components/shop/CategoryListing";
import { productsByCategory, categoryFacets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kurta — Delight Studio",
  description: "Shop the Delight Studio kurta edit — straight, A-line, Anarkali, embroidered and more.",
};

export default function KurtaPage() {
  const products = productsByCategory("Kurta");
  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-cream">
        <CategoryListing
          title="Kurta"
          eyebrow="Ethnicwear"
          products={products}
          facetTypes={categoryFacets.Kurta.types}
        />
      </main>
      <Footer />
    </>
  );
}
