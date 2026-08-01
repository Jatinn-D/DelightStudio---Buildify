"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useLenis } from "lenis/react";
import { SIZE_LADDER } from "@/lib/data";

/* Placeholder body measurements (inches) — client to confirm real values. */
const CHART: Record<string, [number, number, number, number]> = {
  "3XS": [30, 24, 33, 42],
  "2XS": [32, 26, 35, 43],
  XS: [34, 28, 37, 44],
  S: [36, 30, 39, 45],
  M: [38, 32, 41, 46],
  L: [40, 34, 43, 46],
  XL: [42, 36, 45, 47],
  "2XL": [44, 38, 47, 47],
  "3XL": [46, 40, 49, 48],
  "4XL": [48, 42, 51, 48],
  "5XL": [50, 44, 53, 49],
  "6XL": [52, 46, 55, 49],
};

export default function SizeChartModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-70 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          data-open={open}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label="Size chart"
          className="sizechart-panel max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-cream-soft p-6 text-ink shadow-[0_30px_60px_rgba(61,18,32,0.28)] sm:p-7"
        >
          <div className="mb-1 flex items-start justify-between">
            <h3 className="font-display text-2xl font-semibold tracking-[0.04em]">Size Chart</h3>
            <button
              type="button"
              aria-label="Close size chart"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full text-ink/60 transition hover:bg-taupe-soft hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mb-5 font-sans text-[13px] text-ink/55">
            All measurements are in inches. For the best fit, measure your body and compare with
            the chart below.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center font-sans text-[13px]">
              <thead>
                <tr className="border-b border-taupe/40 font-nav text-[11px] uppercase tracking-[0.12em] text-burgundy/80">
                  <th className="py-2.5 text-left">Size</th>
                  <th className="py-2.5">Bust</th>
                  <th className="py-2.5">Waist</th>
                  <th className="py-2.5">Hip</th>
                  <th className="py-2.5">Length</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_LADDER.map((s) => {
                  const [bust, waist, hip, len] = CHART[s];
                  return (
                    <tr key={s} className="border-b border-taupe/20 last:border-0">
                      <td className="py-2.5 text-left font-nav font-medium tracking-[0.06em] text-ink">
                        {s}
                      </td>
                      <td className="py-2.5 text-ink/70 tabular-nums">{bust}</td>
                      <td className="py-2.5 text-ink/70 tabular-nums">{waist}</td>
                      <td className="py-2.5 text-ink/70 tabular-nums">{hip}</td>
                      <td className="py-2.5 text-ink/70 tabular-nums">{len}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
