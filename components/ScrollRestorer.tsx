"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLenis } from "lenis/react";

/* Manual scroll restoration for a Lenis app.

   On this Next, Back re-renders the destination fresh at scroll 0 and Lenis owns
   the window scroll (pulling it toward its own target). Two stores make the
   restore reliable:
     • `committed` — written only when a link is clicked (the real position we're
       leaving, snapshotted before Next resets it). Scroll events never touch it,
       so the reset-to-0 can't pollute it.
     • `live` — continuous scroll tracking, used only as a fallback.
   On a "return" navigation (Back — which does NOT emit popstate here — or arriving
   at a saved page from a product page) we restore from `committed` and re-pin the
   real window scroll whenever it drifts, bailing the moment the user scrolls. */

const committed = new Map<string, number>();
const live = new Map<string, number>();
const isProduct = (p: string | null) => !!p && p.startsWith("/product/");

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ScrollRestorer() {
  const pathname = usePathname();
  const lenis = useLenis();

  const popRef = useRef(false);
  const restoringRef = useRef(false);
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const onPop = () => {
      popRef.current = true;
    };

    // Snapshot the position we're leaving, at click time — before Next resets it.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      committed.set(window.location.pathname, window.scrollY);
    };

    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  // Continuous live tracking (fallback only).
  useEffect(() => {
    const save = () => {
      if (!restoringRef.current) live.set(pathname, window.scrollY);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [pathname]);

  // On route change, restore the saved offset for a "return" navigation.
  useIsoLayoutEffect(() => {
    const from = prevPathRef.current;
    prevPathRef.current = pathname;
    const wasPop = popRef.current;
    popRef.current = false;

    const y = committed.get(pathname) ?? live.get(pathname);
    const shouldRestore = y != null && !isProduct(pathname) && (wasPop || isProduct(from));
    if (!shouldRestore || y == null) return;

    restoringRef.current = true;
    // Set position + Lenis' target up front so it doesn't animate back to top.
    window.scrollTo(0, y);
    lenis?.scrollTo(y, { immediate: true, force: true });

    let raf = 0;
    let stop = false;
    const deadline = performance.now() + 900;

    const finish = () => {
      if (stop) return;
      stop = true;
      restoringRef.current = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onUser, true);
      window.removeEventListener("touchstart", onUser, true);
      window.removeEventListener("keydown", onUser, true);
    };
    const onUser = () => finish(); // never fight a user who scrolls
    window.addEventListener("wheel", onUser, { passive: true, capture: true });
    window.addEventListener("touchstart", onUser, { passive: true, capture: true });
    window.addEventListener("keydown", onUser, { capture: true });

    // Only correct when the scroll has actually drifted from target.
    const tick = () => {
      if (stop) return;
      if (Math.abs(window.scrollY - y) > 4) {
        window.scrollTo(0, y);
        lenis?.scrollTo(y, { immediate: true, force: true });
      }
      if (performance.now() > deadline) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return finish;
  }, [pathname, lenis]);

  return null;
}
