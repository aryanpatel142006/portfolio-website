"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/fx";

/** Numbers that count up the first time they scroll into view. Takes the
    finished string ("3,463", "24 hrs", "139") and animates only its digit
    run, keeping any prefix or suffix. Server-renders the final value, so
    without JS nothing is ever stuck at zero. */
export default function CountUp({
  value,
  duration = 1300,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const m = value.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!m) return;
    const [, prefix, digits, suffix] = m;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;
    const grouped = digits.includes(",");
    const fmt = (n: number) =>
      grouped ? new Intl.NumberFormat("en-US").format(n) : String(n);

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * t); // expo-out
          el.textContent = `${prefix}${fmt(Math.round(target * eased))}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
          else el.textContent = value;
        };
        el.textContent = `${prefix}${fmt(0)}${suffix}`;
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
}
