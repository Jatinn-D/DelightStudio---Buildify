"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* Casio-style category hero SLIDER — a full-bleed banner that auto-advances
   through a few images (arrows + dots to navigate), with the category title
   overlaid. The (transparent) navbar sits over it; content is bottom-aligned so
   it's never hidden behind the bar. Placeholder imagery for now. */
export default function CategoryHero({
  eyebrow,
  title,
  subtitle,
  images,
  count,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  images: string[];
  count?: number;
}) {
  const [i, setI] = useState(0);
  const n = images.length;
  const prev = () => setI((c) => (c - 1 + n) % n);
  const next = () => setI((c) => (c + 1) % n);

  // Auto-advance every 5s (paused for reduced-motion users and single-image sets).
  useEffect(() => {
    if (n <= 1) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((c) => (c + 1) % n), 5000);
    return () => clearInterval(id);
  }, [n]);

  return (
    <section className="full-bleed relative h-[52vh] min-h-[340px] max-h-[560px] overflow-hidden bg-ink">
      {/* Slides — crossfade + slow ken-burns on the active one */}
      {images.map((src, idx) => (
        <div
          key={src + idx}
          aria-hidden={idx !== i}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
              idx === i ? "scale-105" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Legibility gradient — dark at the bottom where the text sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/25" />

      {/* Copy */}
      {/* Extra left padding so the text clears the ‹ slider arrow. */}
      <div className="relative z-10 mx-auto flex h-full max-w-360 flex-col justify-end pb-9 pl-16 pr-4 sm:pl-20 sm:pr-6 lg:pb-12 lg:pl-24 lg:pr-10">
        <p className="font-nav text-[11px] uppercase tracking-[0.28em] text-cream/85">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-cream/80 sm:text-[15px]">
          {subtitle}
        </p>
        {typeof count === "number" && (
          <p className="mt-4 font-nav text-[11px] uppercase tracking-[0.2em] text-cream/70">
            {count} {count === 1 ? "style" : "styles"}
          </p>
        )}
      </div>

      {/* Slider controls */}
      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink/25 text-cream backdrop-blur-sm transition hover:bg-ink/45 sm:left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink/25 text-cream backdrop-blur-sm transition hover:bg-ink/45 sm:right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 right-4 z-20 flex items-center gap-2 sm:right-6 lg:right-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === i}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === i ? "w-6 bg-cream" : "w-1.5 bg-cream/50 hover:bg-cream/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
