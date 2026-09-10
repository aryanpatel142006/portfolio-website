"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/fx";

const GLYPHS = "▪▫◦•/\\|-=+*#%&01";

/** Mono labels that decode into place the first time they're seen, like a
    readout settling. Runs once per label, ~600ms, letters lock in from left
    to right. Server-renders the final text. */
export default function Scramble({
  text,
  className = "",
  duration = 620,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const settled = Math.floor(t * text.length * 1.15);
          let out = "";
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === " " || i < settled) out += ch;
            else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          el.textContent = out;
          if (t < 1) raf = requestAnimationFrame(tick);
          else el.textContent = text;
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
