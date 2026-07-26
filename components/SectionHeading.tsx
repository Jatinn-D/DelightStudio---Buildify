import Link from "next/link";

/* Shared editorial section heading with an optional "view all" link. */
export default function SectionHeading({
  eyebrow,
  title,
  link,
  align = "left",
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const textColor = tone === "light" ? "text-cream" : "text-ink";
  const accent = tone === "light" ? "text-cream/70" : "text-burgundy";
  return (
    <div
      className={`flex flex-wrap items-end gap-4 ${
        align === "center" ? "flex-col text-center" : "justify-between"
      }`}
    >
      <div className={align === "center" ? "" : "max-w-2xl"}>
        {eyebrow && (
          <p className={`mb-2 font-nav text-[11px] uppercase tracking-[0.24em] ${accent}`}>
            {eyebrow}
          </p>
        )}
        <h2 className={`font-display text-3xl font-medium sm:text-4xl md:text-[42px] ${textColor}`}>
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className={`font-nav text-[12px] uppercase tracking-[0.16em] underline-offset-4 hover:underline ${accent}`}
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
