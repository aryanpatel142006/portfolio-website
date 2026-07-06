"use client";

import { useEffect, useState } from "react";

/** Thin accent bar at the very top that tracks scroll position. */
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
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
        className="h-full bg-gradient-to-r from-accent/40 via-accent/80 to-accent"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
