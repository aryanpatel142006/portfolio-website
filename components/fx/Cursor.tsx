"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { fxEnabled, fxServer, fxSubscribe } from "@/lib/fx";

type Mode = "ring" | "link" | "text" | "field";

const INTERACTIVE = "a, button, [role=button], input, textarea, [data-cursor]";
const TEXTUAL =
  "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dt, dd, time, label, .kicker, .folio";

/** A pointer companion. On the first mouse move it blooms under the pointer
    while the blue period after "Patel" (or the header glyph when that's
    off-screen) fires a ripple, as if it launched the ring. From then on it
    trails the pointer on a spring. Over anything clickable it swells
    into a tinted lens; over reading text it shrinks to a solid dot so it
    never sits on a word. The native cursor stays. Mouse-only, off under
    reduced motion. */
export default function Cursor() {
  const on = useSyncExternalStore(fxSubscribe, fxEnabled, fxServer);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(0);
  // Position is written straight from the pointer, no spring: a trailing ring
  // reads as lag and its settle reads as a snap. Only the size eases.
  const ss = useSpring(scale, { stiffness: 300, damping: 24 });
  const [mode, setMode] = useState<Mode>("ring");
  const [label, setLabel] = useState("");
  const [shown, setShown] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!on) return;
    let lastX = 0;
    let lastY = 0;
    let mode: Mode = "ring";
    let pressed = false;
    let born = false;

    const SCALE: Record<Mode, number> = { ring: 1, link: 2.1, text: 0.38, field: 0.5 };
    const apply = () => scale.set(SCALE[mode] * (pressed ? 0.82 : 1));

    const classify = (el: Element | null): Mode => {
      const t = el?.closest(INTERACTIVE);
      if (t) return t.matches("input, textarea") ? "field" : "link";
      if (el?.closest(TEXTUAL)) return "text";
      return "ring";
    };
    const setModeFor = (el: Element | null) => {
      const next = classify(el);
      const t = el?.closest(INTERACTIVE);
      setLabel(t?.getAttribute("data-cursor-label") ?? "");
      if (next !== mode) {
        mode = next;
        setMode(next);
      }
      apply();
    };

    /* Birth: the ring appears under the pointer, scaling up from nothing,
       while the blue period (or the header glyph when the hero is off-screen)
       fires a ripple and dips grey for a beat. No travel, so nothing to lag. */
    const birth = () => {
      born = true;
      const dot = document.querySelector<HTMLElement>(".dot-pop");
      const logo = document.querySelector<HTMLElement>("header .logo-scroll-spin");
      const inView = (el: HTMLElement | null) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
      };
      const source = inView(dot) ? dot : logo;
      if (source) {
        // the period's box is a whole text line tall; its ink sits near the
        // baseline, so aim the ripple there rather than at the box center
        const r = source.getBoundingClientRect();
        setRipple({
          x: r.left + r.width / 2,
          y: source === dot ? r.top + r.height * 0.84 : r.top + r.height / 2,
        });
        setTimeout(() => setRipple(null), 900);
      }
      x.jump(lastX);
      y.jump(lastY);
      scale.jump(0);
      ss.jump(0);
      setShown(true);
      source?.classList.add("launch");
      setTimeout(() => source?.classList.remove("launch"), 900);
      setModeFor(document.elementFromPoint(lastX, lastY));
    };

    const move = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!born) {
        birth();
        return;
      }
      x.set(lastX);
      y.set(lastY);
      if (!shown) setShown(true);
    };
    const over = (e: PointerEvent) => {
      setModeFor(e.target as Element | null);
    };
    const retarget = () => setModeFor(document.elementFromPoint(lastX, lastY));
    const down = () => {
      pressed = true;
      apply();
    };
    const up = () => {
      pressed = false;
      apply();
      // the thing under the pointer may have just unmounted (the off-duty teaser)
      setTimeout(retarget, 120);
    };
    const leave = () => setShown(false);
    const enter = () => {
      if (born) setShown(true);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per enable; motion values are stable
  }, [on]);

  if (!on) return null;

  return (
    <>
      {ripple && (
        <span aria-hidden className="ripple" style={{ left: ripple.x, top: ripple.y }} />
      )}
      <motion.div
        aria-hidden
        className={`cursor-ring is-${mode}`}
        style={{ x, y, scale: ss, opacity: shown ? 1 : 0 }}
      >
        {label && <span className="cursor-label">{label}</span>}
      </motion.div>
    </>
  );
}
