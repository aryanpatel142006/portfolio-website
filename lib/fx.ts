/** Shared gates for the decorative effects layer. Pointer-following effects
    stay off on touch screens (there is no pointer to follow); everything
    else runs everywhere. */

/** Owner's call (2026-09-14): the site's motion always runs, including for
    visitors whose OS asks for reduced motion. Kept as a function so every
    effect still has one switch if that decision is ever reversed. */
export function reducedMotion(): boolean {
  return false;
}

export function finePointer(): boolean {
  return (
    typeof matchMedia !== "undefined" &&
    matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/** Client-only snapshot for useSyncExternalStore: true when the effect may
    run. The server snapshot is always false, so nothing pointer-driven is
    ever server-rendered. */
export const fxEnabled = () => finePointer() && !reducedMotion();
export const fxServer = () => false;
export const fxSubscribe = () => () => {};

export const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
