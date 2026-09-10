/** Shared gates for the decorative effects layer. Every effect asks these
    before doing anything: no pointer-following on touch screens, nothing
    kinetic for visitors who asked the OS for less motion. */

export function reducedMotion(): boolean {
  return (
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
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
