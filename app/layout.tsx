import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CartProvider from "@/components/CartProvider";
import FavoritesProvider from "@/components/FavoritesProvider";

// Display serif — wordmark & section headings (editorial fashion feel)
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Geometric sans — nav links & buttons (uppercase, letter-spaced)
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Body / product text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delight Studio — Women's Fashion, Chennai",
  description:
    "Delight Studio — moderate price, high quality, complete customer satisfaction. Discover our latest women's collections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">
        <SmoothScroll>
          {/* Cart is the outer provider so the Favourites drawer (mounted inside
              FavoritesProvider) can reach useCart() for its "Add to Bag" actions. */}
          <CartProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
