"use client";

import { useEffect, useRef } from "react";
import { FX_SPARKS_EVENT, OFFDUTY_UNLOCK_EVENT } from "@/lib/offduty";
import { reducedMotion } from "@/lib/fx";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  len: number;
  color: string;
  spin: number;
};

/** A burst of sparks from the point the visitor unlocked off-duty, thrown
    on a fixed canvas above everything for under a second. Colors are read
    from the live tokens at fire time, so they're already the night world's
    neon by the time they fly. */
export default function Sparks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let raf = 0;
    const onUnlock = (e: Event) => {
      if (reducedMotion()) return;
      const d = (e as CustomEvent<{ x?: number; y?: number; count?: number } | undefined>).detail;
      const ox = d?.x ?? window.innerWidth / 2;
      const oy = d?.y ?? window.innerHeight / 2;
      const count = d?.count ?? 160;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.hidden = false;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(document.documentElement);
      const palette = [
        cs.getPropertyValue("--accent").trim() || "#ff3d9a",
        cs.getPropertyValue("--neon-2").trim() || "#33e6ff",
        cs.getPropertyValue("--neon-3").trim() || "#ffd166",
        cs.getPropertyValue("--foreground").trim() || "#fff",
      ];
      const sparks: Spark[] = Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2;
        const s = 5 + Math.random() * 13;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 3,
          life: 0,
          max: 45 + Math.random() * 40,
          len: 6 + Math.random() * 14,
          color: palette[(Math.random() * palette.length) | 0],
          spin: (Math.random() - 0.5) * 0.4,
        };
      });
      cancelAnimationFrame(raf);
      const frame = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        let alive = 0;
        for (const p of sparks) {
          if (p.life >= p.max) continue;
          alive++;
          p.life++;
          p.vy += 0.28;
          p.vx *= 0.975;
          p.vy *= 0.975;
          p.x += p.vx;
          p.y += p.vy;
          const t = p.life / p.max;
          ctx.globalAlpha = 1 - t * t;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.2 * (1 - t) + 0.6;
          ctx.lineCap = "round";
          const ang = Math.atan2(p.vy, p.vx) + p.spin * p.life;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - Math.cos(ang) * p.len * (1 - t), p.y - Math.sin(ang) * p.len * (1 - t));
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (alive) raf = requestAnimationFrame(frame);
        else {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          canvas.hidden = true;
        }
      };
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener(OFFDUTY_UNLOCK_EVENT, onUnlock);
    window.addEventListener(FX_SPARKS_EVENT, onUnlock);
    return () => {
      window.removeEventListener(OFFDUTY_UNLOCK_EVENT, onUnlock);
      window.removeEventListener(FX_SPARKS_EVENT, onUnlock);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      hidden
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] h-full w-full"
    />
  );
}
