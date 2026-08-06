"use client";

import * as React from "react";

/* Wraps the whole page in React's <ViewTransition> so EVERY route navigation
   runs a smooth crossfade — not only the product-card → detail morph. The
   crossfade timing is tuned by `::view-transition-old/new(root)` in globals.css;
   the still navbar (viewTransitionName: "site-nav") and the product morph
   (named <Morph> boundaries) keep working as shared elements inside it.

   Mirrors components/shop/Morph.tsx: the stable @types/react doesn't declare
   ViewTransition, so we read it off the runtime module and fall back to plain
   children if it's unavailable (older browser / flag off) — no animation, but
   the app still works. */
type VTComponent = React.ComponentType<{ children: React.ReactNode }>;

const RuntimeViewTransition: VTComponent | undefined =
  (React as unknown as { ViewTransition?: VTComponent }).ViewTransition ??
  (React as unknown as { unstable_ViewTransition?: VTComponent }).unstable_ViewTransition;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  if (RuntimeViewTransition) {
    return <RuntimeViewTransition>{children}</RuntimeViewTransition>;
  }
  return <>{children}</>;
}
