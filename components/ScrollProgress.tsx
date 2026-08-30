"use client";

import { useEffect, useState } from "react";

/** Thin accent bar at the very top that tracks scroll position.
    Where the browser supports scroll-driven animations, CSS runs the bar
    off the scroll timeline (see .progress-scroll) — no listeners, no
    re-renders. The rAF/state path below exists only as a fallback. */
export default function ScrollProgress() {
  const [jsPct, setJsPct] = useState<number | null>(null);

  useEffect(() => {
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: scroll()")
    ) {
      return; // CSS drives the bar; keep the main thread out of it
    }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setJsPct(max > 0 ? el.scrollTop / max : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px]">
      <div
        className="progress-scroll h-full w-full bg-gradient-to-r from-accent/40 via-accent/80 to-accent"
        style={jsPct !== null ? { transform: `scaleX(${jsPct})` } : undefined}
      />
    </div>
  );
}
