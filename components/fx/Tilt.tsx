"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/** Pointer-driven 3D tilt with a soft glare sweep, for things that sit
    physically on the page (plates, the polaroid). Mouse-only: touch never
    tilts. Springs make a fast exit settle instead of snap. */
export default function Tilt({
  children,
  max = 9,
  className = "",
  glare = true,
}: {
  children: React.ReactNode;
  max?: number; // degrees
  className?: string;
  glare?: boolean;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const go = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22, mass: 0.5 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22, mass: 0.5 });
  const sgo = useSpring(go, { stiffness: 200, damping: 30 });
  const glareBg = useTransform(
    [gx, gy],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.26), rgba(255,255,255,0.04) 45%, transparent 70%)`,
  );

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 2 * max);
        rx.set(-(py - 0.5) * 2 * max);
        gx.set(px * 100);
        gy.set(py * 100);
        go.set(1);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        go.set(0);
      }}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ background: glareBg, opacity: sgo }}
        />
      )}
    </motion.div>
  );
}
