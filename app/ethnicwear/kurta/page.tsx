import { permanentRedirect } from "next/navigation";

/* The old /ethnicwear/kurta route was replaced by the real stock-driven shop
   pages. Kurtis now live at /shop/kurtis — redirect any old links there. */
export default function LegacyKurtaPage() {
  permanentRedirect("/shop/kurtis");
}
