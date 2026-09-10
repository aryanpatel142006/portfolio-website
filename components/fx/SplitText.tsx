"use client";

import { useEffect, useRef } from "react";
import { finePointer, reducedMotion } from "@/lib/fx";

/** Display type set one glyph at a time. Each letter rises out of the
    baseline on its own delay, and on desktop the letters lean away from
    the pointer like type on a page you're leafing through. The full string
    stays in the DOM for screen readers and search; the glyphs are hidden
    from the accessibility tree. */
export default function SplitText({
  text,
  className = "",
  stagger = 26,
  delay = 0,
  repel = true,
  radius = 150,
  strength = 18,
}: {
  text: string;
  className?: string;
  stagger?: number; // ms between letters
  delay?: number; // ms before the first letter
  repel?: boolean;
  radius?: number; // px of pointer influence
  strength?: number; // max px a glyph moves
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !repel || !finePointer() || reducedMotion()) return;
    const chars = [...root.querySelectorAll<HTMLElement>("[data-char]")];
    let raf = 0;
    let px = 0;
    let py = 0;
    const paint = () => {
      raf = 0;
      for (const c of chars) {
        const r = c.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const d = Math.hypot(dx, dy);
        if (d > radius || d === 0) {
          c.style.transform = "";
          continue;
        }
        const f = (1 - d / radius) ** 1.6;
        const tx = (-dx / d) * f * strength;
        const ty = (-dy / d) * f * strength;
        const rot = (dx > 0 ? -1 : 1) * f * 7;
        c.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
      }
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      for (const c of chars) c.style.transform = "";
    };
    // Listen a little wider than the word itself so letters start leaning
    // before the pointer is on top of them.
    const zone = root.closest("[data-repel-zone]") ?? root;
    zone.addEventListener("pointermove", move as EventListener, { passive: true });
    zone.addEventListener("pointerleave", leave);
    return () => {
      zone.removeEventListener("pointermove", move as EventListener);
      zone.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [repel, radius, strength]);

  return (
    <span ref={ref} className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {[...text].map((ch, i) => (
          <span
            key={i}
            data-char
            className="char"
            style={{ animationDelay: `${delay + i * stagger}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
