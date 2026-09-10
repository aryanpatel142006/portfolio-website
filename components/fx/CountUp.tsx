"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/fx";
import { OFFDUTY_COIN_EVENT } from "@/lib/offduty";

/** Numbers that count up the first time they scroll into view, and again
    whenever the pointer enters the nearest [data-replay-host] (or the number
    itself). Takes the finished string ("3,463", "24 hrs", "139") and
    animates only its digit run, keeping any prefix or suffix. Server-renders
    the final value, so without JS nothing is ever stuck at zero. */
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
    const run = (ms: number) => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        const eased = 1 - Math.pow(2, -10 * t); // expo-out
        el.textContent = `${prefix}${fmt(Math.round(target * eased))}${suffix}`;
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = value;
      };
      el.textContent = `${prefix}${fmt(0)}${suffix}`;
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run(duration);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    // hover replay, a touch quicker than the first run
    const host = el.closest<HTMLElement>("[data-replay-host]") ?? el;
    const replay = () => run(Math.min(duration, 900));
    host.addEventListener("pointerenter", replay);
    window.addEventListener(OFFDUTY_COIN_EVENT, replay);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      host.removeEventListener("pointerenter", replay);
      window.removeEventListener(OFFDUTY_COIN_EVENT, replay);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
}
