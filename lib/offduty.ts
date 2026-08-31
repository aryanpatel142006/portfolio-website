/**
 * Shared unlock plumbing for the hidden "off-duty" section.
 * Any trigger (⌘K command, cat clicks, Konami code) calls unlockOffDuty();
 * OffDuty.tsx listens for the event and reveals in place.
 *
 * Deliberately session-only (in-memory) — no persistence. It's an easter egg:
 * a reload puts it back to the locked teaser so it can be rediscovered.
 */

import { flushSync } from "react-dom";

export const OFFDUTY_UNLOCK_EVENT = "offduty:unlock";
export const OFFDUTY_RELOCK_EVENT = "offduty:relock";
export const OFFDUTY_ANCHOR_LABEL = "Off duty";

/** Fire from any trigger. Notifies the mounted section to reveal + scroll.
    Where the View Transition API exists, the reveal plays as a warm circle
    sweep out of the trigger point (pass the trigger's viewport coords):
    the state flip AND an instant jump to the section happen inside the
    transition, so the sweep uncovers the lamplight world already in place.
    Without the API (or when already unlocked) it's the plain event. */
export function unlockOffDuty(origin?: { x: number; y: number }) {
  const fire = () => window.dispatchEvent(new CustomEvent(OFFDUTY_UNLOCK_EVENT));

  const alreadyUnlocked = !!document.querySelector(
    `section[aria-label="${OFFDUTY_ANCHOR_LABEL}"]`,
  );
  if (alreadyUnlocked || typeof document.startViewTransition !== "function") {
    fire();
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--vt-x", `${origin?.x ?? window.innerWidth / 2}px`);
  root.style.setProperty("--vt-y", `${origin?.y ?? window.innerHeight / 2}px`);
  root.classList.add("vt-warm");
  const vt = document.startViewTransition(() => {
    // flushSync commits the React reveal before the new snapshot is taken
    flushSync(fire);
    document
      .querySelector(`section[aria-label="${OFFDUTY_ANCHOR_LABEL}"]`)
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  });
  // a skipped transition (hidden tab) still unlocks — just observe the
  // promises so nothing logs as an unhandled rejection
  vt.ready.catch(() => {});
  vt.finished
    .catch(() => {})
    .finally(() => root.classList.remove("vt-warm"));
}

/** "Back to work mode" — collapse the warm off-duty world back to the teaser. */
export function relockOffDuty() {
  window.dispatchEvent(new CustomEvent(OFFDUTY_RELOCK_EVENT));
}

/** The Konami sequence: ↑ ↑ ↓ ↓ ← → ← → B A */
export const KONAMI_SEQUENCE = [
  // "ArrowUp",
  // "ArrowUp",
  "ArrowDown",
  "ArrowDown",
];
