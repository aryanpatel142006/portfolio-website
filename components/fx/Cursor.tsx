"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { fxEnabled, fxServer, fxSubscribe } from "@/lib/fx";

/** A hairline ring that trails the pointer on a spring and swells over
    anything clickable. The native cursor stays: this is annotation, not a
    replacement, so nobody loses their I-beam in the chat field. Mouse-only
    and off under reduced motion. */
export default function Cursor() {
  const on = useSyncExternalStore(fxSubscribe, fxEnabled, fxServer);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.35 });
  const ss = useSpring(scale, { stiffness: 320, damping: 22 });
  const [label, setLabel] = useState("");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!on) return;
    let hovering = 1;
    let pressed = false;
    const apply = () => scale.set(hovering * (pressed ? 0.8 : 1));
    const move = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shown) setShown(true);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.(
        "a, button, [role=button], input, textarea, [data-cursor]",
      );
      if (t) {
        const big = t.getAttribute("data-cursor") === "big";
        hovering = t.matches("input, textarea") ? 0.55 : big ? 3 : 1.9;
        setLabel(t.getAttribute("data-cursor-label") ?? "");
      } else {
        hovering = 1;
        setLabel("");
      }
      apply();
    };
    const down = () => {
      pressed = true;
      apply();
    };
    let lastX = 0;
    let lastY = 0;
    const retarget = () => {
      const t = document
        .elementFromPoint(lastX, lastY)
        ?.closest("a, button, [role=button], input, textarea, [data-cursor]");
      hovering = t ? (t.matches("input, textarea") ? 0.55 : 1.9) : 1;
      if (!t) setLabel("");
      apply();
    };
    const up = () => {
      pressed = false;
      apply();
      setTimeout(retarget, 120);
    };
    const leave = () => setShown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [on, x, y, scale, shown]);

  if (!on) return null;

  return (
    <motion.div
      aria-hidden
      className="cursor-ring"
      style={{ x: sx, y: sy, scale: ss, opacity: shown ? 1 : 0 }}
    >
      {label && <span className="cursor-label">{label}</span>}
    </motion.div>
  );
}
