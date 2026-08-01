"use client";

import * as React from "react";

/* React's <ViewTransition> ships in the React build Next's App Router uses
   (node_modules/next/dist/compiled/react exports it), and is what powers the
   product-card → product-detail shared-element morph. The installed *stable*
   @types/react doesn't declare it, so we read it off the runtime module through
   a cast, and fall back to rendering children plainly if it's ever unavailable
   (older browser / flag off) — the app still works, it just doesn't animate. */

type VTComponent = React.ComponentType<{ name?: string; children: React.ReactNode }>;

const RuntimeViewTransition: VTComponent | undefined =
  (React as unknown as { ViewTransition?: VTComponent }).ViewTransition ??
  (React as unknown as { unstable_ViewTransition?: VTComponent }).unstable_ViewTransition;

export default function Morph({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  if (RuntimeViewTransition) {
    return <RuntimeViewTransition name={name}>{children}</RuntimeViewTransition>;
  }
  return <>{children}</>;
}
