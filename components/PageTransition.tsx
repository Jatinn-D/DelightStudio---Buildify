"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* Light page transition: fade the new page in on section navigations using the
   Web Animations API on a persistent wrapper — no remount and no View-Transition
   snapshot, so it stays smooth on heavy pages (no lag).

   Product navigations (to or from /product/*) are skipped entirely, so the
   card ↔ detail shared-element morph (React <ViewTransition> in <Morph>) plays
   exactly as it did before, in both directions. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const from = prev.current;
    prev.current = pathname;

    if (!mounted.current) {
      mounted.current = true;
      return; // no fade on the very first load
    }
    if (from === pathname) return; // not an actual navigation

    const isProduct = (p: string | null) => !!p && p.startsWith("/product/");
    if (isProduct(pathname) || isProduct(from)) return; // let the product morph run

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    ref.current?.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
