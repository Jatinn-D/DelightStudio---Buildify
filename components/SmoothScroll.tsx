"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/* Buttery-smooth page scrolling (Lenis), bound to the document root. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        // gentle ease-out for a premium, weighty feel
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}
