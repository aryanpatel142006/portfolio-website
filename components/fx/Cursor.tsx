"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { animate, motion, useMotionValue, useSpring } from "motion/react";
import { fxEnabled, fxServer, fxSubscribe } from "@/lib/fx";

type Mode = "ring" | "link" | "text" | "field";

const INTERACTIVE = "a, button, [role=button], input, textarea, [data-cursor]";
const TEXTUAL =
  "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dt, dd, time, label, .kicker, .folio";

/** A pointer companion. It is born out of the blue period after "Patel"
    (or the header glyph when that's off-screen): the source drains to grey,
    the ring flies to the pointer, the source gets its ink back. From then
    on it trails the pointer on a spring. Over anything clickable it swells
    into a tinted lens; over reading text it shrinks to a solid dot so it
    never sits on a word. The native cursor stays. Mouse-only, off under
    reduced motion. */
export default function Cursor() {
  const on = useSyncExternalStore(fxSubscribe, fxEnabled, fxServer);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 650, damping: 46, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 650, damping: 46, mass: 0.35 });
  const ss = useSpring(scale, { stiffness: 300, damping: 24 });
  const [mode, setMode] = useState<Mode>("ring");
  const [label, setLabel] = useState("");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!on) return;
    let lastX = 0;
    let lastY = 0;
    let mode: Mode = "ring";
    let pressed = false;
    let born = false;
    let flying = false;

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

    /* Birth: pick a source in view, drain its color, fly to the pointer. */
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
      const r = source?.getBoundingClientRect();
      const ox = r ? r.left + r.width / 2 : lastX;
      const oy = r ? r.top + r.height / 2 : lastY;
      // jump the sources AND the springs that follow them, or the ring still
      // starts its flight from wherever the spring was resting (off-screen)
      x.jump(ox);
      y.jump(oy);
      sx.jump(ox);
      sy.jump(oy);
      scale.jump(0.2);
      ss.jump(0.2);
      setShown(true);
      source?.classList.add("drained");
      flying = true;
      const ease = [0.16, 1, 0.3, 1] as const;
      const dur = Math.min(1.1, 0.5 + Math.hypot(lastX - ox, lastY - oy) / 1400);
      animate(x, lastX, { duration: dur, ease });
      animate(y, lastY, {
        duration: dur,
        ease,
        onComplete: () => {
          flying = false;
          x.set(lastX);
          y.set(lastY);
          source?.classList.remove("drained");
          setModeFor(document.elementFromPoint(lastX, lastY));
        },
      });
      scale.set(1);
    };

    const move = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!born) {
        birth();
        return;
      }
      if (flying) return; // the birth flight owns the position until it lands
      x.set(lastX);
      y.set(lastY);
      if (!shown) setShown(true);
    };
    const over = (e: PointerEvent) => {
      if (flying) return;
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
    <motion.div
      aria-hidden
      className={`cursor-ring is-${mode}`}
      style={{ x: sx, y: sy, scale: ss, opacity: shown ? 1 : 0 }}
    >
      {label && <span className="cursor-label">{label}</span>}
    </motion.div>
  );
}
