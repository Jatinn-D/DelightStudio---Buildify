import Image from "next/image";

/*
 * HERO — full-viewport image only. No overlay text by design.
 * The client will supply a custom hero image (with any text baked in).
 * To swap: replace /public/images/hero.jpg (keep the same name), or change
 * the `src` below. Recommended asset: ~2000×1150px landscape, or taller for mobile.
 */
export default function Hero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-burgundy-900">
      <Image
        src="/images/hero.jpg"
        alt="Delight Studio — latest women's collection"
        fill
        priority={false}
        preload
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Subtle scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-cream/80">
          <span className="font-nav text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-9 w-px animate-pulse bg-cream/60" />
        </div>
      </div>
    </section>
  );
}
