import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Instagram, Facebook, Youtube } from "./SocialIcons";
import {
  brand,
  footerShop,
  footerQuick,
  footerPolicies,
  type NavLink,
} from "@/lib/data";

function LinkColumn({ heading, links }: { heading: string; links: NavLink[] }) {
  return (
    <div>
      <h4 className="mb-4 font-nav text-[11px] uppercase tracking-[0.2em] text-cream/60">
        {heading}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="font-sans text-sm text-cream/85 transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-burgundy-deep text-cream">
      {/* Full-width brand watermark — SVG scales to fit the viewport edge-to-edge
          on every screen size (textLength forces the word to span the full width). */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 select-none">
        <svg
          viewBox="0 0 1000 150"
          preserveAspectRatio="xMidYMax meet"
          className="block w-full"
        >
          <text
            x="500"
            y="134"
            textAnchor="middle"
            textLength="972"
            lengthAdjust="spacingAndGlyphs"
            className="font-display"
            fontSize="150"
            style={{ fill: "rgba(243, 236, 224, 0.08)", fontWeight: 600 }}
          >
            {brand.wordmark}
          </text>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-360 px-4 sm:px-6 lg:px-10">
        {/* Top grid */}
        <div className="grid gap-10 py-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr] lg:py-16">
          {/* Brand + newsletter + social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-2xl font-semibold tracking-[0.28em]">
              {brand.wordmark}
            </p>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-cream/70">
              Women&rsquo;s fashion from Chennai — moderate price, high quality and complete
              customer satisfaction, in every piece.
            </p>

            <form className="mt-6 max-w-xs">
              <label className="mb-2 block font-nav text-[11px] uppercase tracking-[0.2em] text-cream/60">
                Join our list
              </label>
              <div className="flex items-center border-b border-cream/30 focus-within:border-gold">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent py-2 font-sans text-sm text-cream placeholder:text-cream/40 focus:outline-none"
                />
                <button aria-label="Subscribe" type="button" className="p-2 text-cream hover:text-gold">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 flex gap-3">
              {[
                { Icon: Instagram, href: brand.instagram, label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn heading="Shop" links={footerShop} />
          <LinkColumn heading="Quick Links" links={footerQuick} />
          <LinkColumn heading="Policies" links={footerPolicies} />

          {/* Contact */}
          <div id="contact" className="scroll-mt-24">
            <h4 className="mb-4 font-nav text-[11px] uppercase tracking-[0.2em] text-cream/60">
              Visit / Contact
            </h4>
            <ul className="space-y-4 font-sans text-sm text-cream/85">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="leading-relaxed">{brand.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href={brand.phoneHref} className="hover:text-gold">
                  {brand.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${brand.email}`} className="break-all hover:text-gold">
                  {brand.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Instagram className="h-4 w-4 shrink-0 text-gold" />
                <a
                  href={brand.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold"
                >
                  {brand.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-cream/15 pt-16 pb-16 text-cream/60 sm:flex-row sm:items-center sm:justify-between lg:pb-24">
          <p className="font-sans text-xs">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="font-nav text-[11px] uppercase tracking-[0.16em]">
            Visa · Mastercard · UPI · Cash on Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
