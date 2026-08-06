import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";
import SectionHeading from "./SectionHeading";

/* Map a category's span to its grid placement.
   Base grid is 2 cols (mobile) → 4 cols (lg). "big" = 2x2 feature, "wide" = 2 cols. */
function spanClasses(span?: "big" | "wide") {
  if (span === "big") return "col-span-2 row-span-2";
  if (span === "wide") return "col-span-2 lg:col-span-2";
  return "";
}

export default function BentoCategories() {
  return (
    <section id="categories" className="scroll-mt-24 bg-cream pb-16 sm:pb-20 md:pb-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Find your fit"
          title="Shop by Category"
          link={{ label: "All categories", href: "/shop/new" }}
        />
      </div>

      {/* Bento — padded to align with the heading (no longer edge-to-edge). */}
      <div className="mx-auto mt-10 max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid auto-rows-[43vw] grid-cols-2 gap-[10px] sm:auto-rows-[15rem] sm:gap-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group relative overflow-hidden rounded-xl bg-taupe-soft ${spanClasses(
                cat.span
              )}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes={
                  cat.span === "big"
                    ? "(max-width: 1024px) 100vw, 50vw"
                    : "(max-width: 1024px) 50vw, 25vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Legibility gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5">
                <div>
                  <h3 className="font-display text-xl font-medium text-cream sm:text-2xl">
                    {cat.name}
                  </h3>
                  <span className="font-nav text-[11px] uppercase tracking-[0.18em] text-cream/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Shop now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
