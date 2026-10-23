/* Image loader for next/image.

   Product photos come from Unsplash's image CDN, which resizes on the fly, so
   we ask it for exactly the width each screen needs (plus modern formats via
   auto=format) instead of routing every image through Vercel's optimiser.
   Local files in /public are served as they are. */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 72));
    url.searchParams.set("auto", "format");
    return url.toString();
  }
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
