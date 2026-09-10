"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { fxEnabled, fxServer, fxSubscribe } from "@/lib/fx";

/** A soft pool of accent light that follows the pointer across the graph
    paper, like a desk lamp swung over the page. One fixed element moved by
    transform only, so it costs the compositor and nothing else. In the
    off-duty world the tokens turn it into neon. */
export default function Spotlight() {
  const on = useSyncExternalStore(fxSubscribe, fxEnabled, fxServer);
  const x = useMotionValue(-2000);
  const y = useMotionValue(-2000);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (!on) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [on, x, y]);

  if (!on) return null;
  return <motion.div aria-hidden className="spotlight" style={{ x: sx, y: sy }} />;
}
