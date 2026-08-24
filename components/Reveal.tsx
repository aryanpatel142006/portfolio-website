"use client";

import { useEffect, useRef, useState } from "react";

/** Scroll-reveal as a progressive enhancement.
    Server-rendered content is VISIBLE by default — if JS never runs (blocked
    dev origins, old browsers), nothing is gated. On hydration, sections still
    below the fold are hidden and observed; they fade up as they approach.
    Sections already in view at hydration stay put (no flash). */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // "static": visible, no animation (SSR default + above-fold at hydration)
  // "hidden": below fold, waiting for the observer
  // "shown": animating in
  const [phase, setPhase] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Already on screen (or nearly) when JS arrives → leave it visible.
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    setPhase("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown");
          io.disconnect();
        }
      },
      // Fire the moment the first pixel enters the viewport — the rise is
      // long and eased, and it happens where the visitor can see it.
      { threshold: 0, rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${
        phase === "shown" ? "fade-up" : phase === "hidden" ? "opacity-0" : ""
      }`}
      style={phase === "shown" ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
