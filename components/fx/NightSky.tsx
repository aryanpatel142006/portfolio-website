"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { finePointer, reducedMotion } from "@/lib/fx";

type Star = { x: number; y: number; r: number; z: number; ph: number; hue: number };

/** The off-duty world's sky: three drifting aurora blobs, a twinkling
    starfield on canvas that parallaxes with the pointer, CRT scanlines and
    a vignette. Mounted only while the section is unlocked. Blobs animate by
    transform on their own layers; the canvas redraws ~160 tiny arcs a frame
    and sleeps when the tab is hidden. */
export default function NightSky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = reducedMotion();
    const pointer = finePointer();
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let mx = 0.5;
    let my = 0.5;
    let stars: Star[] = [];

    const seed = () => {
      // "320,190,260" from the active palette; first hue is the rare one
      const hues = (getComputedStyle(document.documentElement).getPropertyValue("--star-hues") || "320,190,260")
        .split(",")
        .map((n) => parseFloat(n))
        .filter((n) => !Number.isNaN(n));
      const [rare = 320, a = 190, b = 260] = hues;
      stars = Array.from({ length: Math.round((w * h) / 9000) + 60 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.4,
        z: 0.3 + Math.random() * 0.7, // depth → parallax + brightness
        ph: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.12 ? rare : Math.random() < 0.5 ? a : b,
      }));
    };
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (still) draw(0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = still ? 0.8 : 0.55 + 0.45 * Math.sin(t / 900 + s.ph);
        const px = s.x * w + (mx - 0.5) * 40 * s.z;
        const py = s.y * h + (my - 0.5) * 24 * s.z;
        ctx.globalAlpha = tw * (0.35 + s.z * 0.65);
        ctx.fillStyle = `hsl(${s.hue} 100% ${78 + s.z * 15}%)`;
        ctx.beginPath();
        ctx.arc(px, py, s.r * (0.7 + s.z * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      if (!document.hidden) draw(t);
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      mx = e.clientX / w;
      my = e.clientY / h;
    };
    resize();
    const mo = new MutationObserver(() => { seed(); if (still) draw(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-night"] });
    window.addEventListener("resize", resize);
    if (pointer) window.addEventListener("pointermove", move, { passive: true });
    if (!still) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  // Portalled to <body>: inside the section, its overflow clip and entrance
  // filter turned the "fixed" sky into a box the size of the section.
  if (typeof document === "undefined") return null;
  return createPortal(
    <div aria-hidden className="night-sky">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="scanlines" />
      <div className="vignette" />
    </div>,
    document.body,
  );
}
