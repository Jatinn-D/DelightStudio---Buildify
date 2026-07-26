const MESSAGES = [
  "Complimentary shipping on all orders above ₹1,499",
  "New Festive Edit is now live",
  "Moderate price · High quality · Complete customer satisfaction",
  "Easy 7-day returns & Cash on Delivery available",
];

/* Thin scrolling notice bar that sits above the navbar (Vastrado-style).
   Collapses out of the way once the user scrolls into the page. */
export default function AnnouncementBar({ collapsed = false }: { collapsed?: boolean }) {
  // Duplicate the sequence so the marquee loops seamlessly.
  const loop = [...MESSAGES, ...MESSAGES];
  return (
    <div
      className={`overflow-hidden bg-burgundy-deep text-cream transition-[max-height,opacity] duration-500 ${
        collapsed ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
      }`}
    >
      <div className="flex w-max animate-marquee whitespace-nowrap py-2 will-change-transform">
        {loop.map((msg, i) => (
          <span
            key={i}
            className="mx-8 flex items-center gap-8 font-nav text-[11px] uppercase tracking-[0.18em] text-cream/90"
          >
            {msg}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
