"use client";

import { useEffect } from "react";
import { clamp, reducedMotion } from "@/lib/fx";

/** The toolkit belt takes its speed from the scroll wheel: flick down and
    it races, scroll back up and it runs in reverse, then it eases back to
    its lazy default. Drives the existing CSS animation's playbackRate
    through the Web Animations API, so it stays compositor-only. */
export default function MarqueeSpeed() {
  useEffect(() => {
    if (reducedMotion()) return;
    let raf = 0;
    let lastY = window.scrollY;
    let velocity = 0; // px per frame, smoothed
    let rate = 1;
    const tick = () => {
      const y = window.scrollY;
      velocity = velocity * 0.88 + (y - lastY) * 0.12;
      lastY = y;
      const target = clamp(1 + velocity / 9, -4, 7);
      rate += (target - rate) * 0.15;
      if (Math.abs(rate - 1) < 0.01) rate = 1;
      for (const a of document.getAnimations()) {
        if ((a as CSSAnimation).animationName === "marquee") a.playbackRate = rate;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}
