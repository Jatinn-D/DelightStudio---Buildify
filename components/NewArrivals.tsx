import { newArrivals } from "@/lib/data";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";

/* New Arrivals — first showcase section after the hero. */
export default function NewArrivals() {
  return (
    <section id="new-arrivals" className="scroll-mt-24 bg-cream py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Fresh off the rack"
          title="New Arrivals"
          link={{ label: "View all", href: "/new" }}
        />

        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-10 md:overflow-visible">
          {newArrivals.map((product) => (
            <div
              key={product.name}
              className="w-[74%] shrink-0 snap-start sm:w-[46%] md:w-auto"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
