import Image from "next/image";
import Link from "next/link";
import { newArrivals } from "@/lib/data";
import SectionHeading from "./SectionHeading";

/* New Arrivals — a continuously moving slider (right → left). Images keep their
   rectangular 4:5 shape with soft rounded corners and a little space between
   them; a "Shop Now →" chip sits on the bottom-right of each image. The list is
   duplicated for a seamless loop (spacing lives in each slide's padding so the
   half-width wrap stays perfectly aligned), and it pauses on hover for clicking. */
export default function NewArrivals() {
  const loop = [...newArrivals, ...newArrivals];

  return (
    <section id="new-arrivals" className="scroll-mt-24 bg-cream py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading eyebrow="Fresh off the rack" title="New Arrivals" />
      </div>

      {/* Full-bleed moving track — slow, right → left. The left/right edges are
          blurred so images emerge from the right blur and dissolve into the left. */}
      <div className="full-bleed relative mt-10 overflow-hidden">
        <div className="flex w-max animate-marquee-slow motion-reduce:[animation-play-state:paused]">
          {loop.map((product, i) => (
            <Link
              key={`${product.name}-${i}`}
              href={product.href}
              aria-hidden={i >= newArrivals.length}
              tabIndex={i >= newArrivals.length ? -1 : undefined}
              className="group block w-[64vw] shrink-0 px-2 sm:w-[40vw] md:w-80 lg:w-86"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-taupe-soft">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 64vw, (max-width: 768px) 40vw, 344px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-cream-soft/90 px-3.5 py-1.5 font-nav text-[11px] uppercase tracking-[0.14em] text-ink shadow-sm backdrop-blur-sm transition group-hover:bg-burgundy group-hover:text-cream">
                  Shop Now
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Faded edges — cream (same as the section bg) gradients so images emerge
            from and dissolve into the background. A solid gradient rather than a
            backdrop blur, so nothing flickers as images move behind it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-cream to-transparent sm:w-28 lg:w-44"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-cream to-transparent sm:w-28 lg:w-44"
        />
      </div>
    </section>
  );
}
