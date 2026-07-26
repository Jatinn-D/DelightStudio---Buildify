import { Gem, Truck, Heart, Tag } from "lucide-react";
import { whyIntro, whyPillars } from "@/lib/data";

const ICONS = { gem: Gem, truck: Truck, heart: Heart, tag: Tag } as const;

/* Why Delight Studio — value proposition in the client's own words. */
export default function WhyDelightStudio() {
  return (
    <section id="why" className="scroll-mt-24 bg-cream-soft py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="mb-3 font-nav text-[11px] uppercase tracking-[0.24em] text-burgundy">
          Why Delight Studio
        </p>
        <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl md:text-[44px]">
          Thoughtfully chosen, beautifully made
        </h2>
        {/* The client's exact words from the Brand Discovery form. */}
        <p className="mx-auto mt-6 max-w-2xl font-display text-xl leading-relaxed text-ink/70 sm:text-2xl">
          “{whyIntro}”
        </p>
        <div className="mx-auto mt-8 h-px w-16 bg-gold/60" />
      </div>

      <div className="mx-auto mt-12 grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-10 px-4 sm:px-6 lg:grid-cols-4">
        {whyPillars.map((p) => {
          const Icon = ICONS[p.icon];
          return (
            <div key={p.title} className="flex flex-col items-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-burgundy/25 bg-cream text-burgundy">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 font-display text-lg font-medium text-ink">{p.title}</h3>
              <p className="mt-2 max-w-[15rem] font-sans text-sm leading-relaxed text-ink/60">
                {p.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
