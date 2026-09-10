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
export const OFFDUTY_TEASER_ID = "offduty";

/** How the unlock happened. Deliberate routes (the teaser button, the ⌘K
    command) need no explanation; the two that can fire by accident (arrow
    keys while scrolling, repeated taps on the photo) get a toast that says
    what just happened and how to get back. */
export type UnlockVia = "click" | "palette" | "keys" | "photo";
export type UnlockDetail = { x?: number; y?: number; via: UnlockVia };

/* ── Mood: the whole page changes theme the moment off-duty opens ──────
   html[data-mood="offduty"] re-tints every token (see globals.css) and the
   theme is forced to dark — after hours. The visitor's saved preference in
   localStorage is never touched; "back to work" restores what they had. */
const MOOD = "offduty";
let themeBeforeOffDuty: string | undefined;

function enterMood() {
  const root = document.documentElement;
  if (root.dataset.mood === MOOD) return;
  themeBeforeOffDuty = root.dataset.theme;
  root.dataset.mood = MOOD;
  root.dataset.theme = "dark";
}

function leaveMood() {
  const root = document.documentElement;
  if (root.dataset.mood !== MOOD) return;
  delete root.dataset.mood;
  // Restore the pre-unlock theme unless they re-toggled while off duty.
  if (root.dataset.theme === "dark" && themeBeforeOffDuty) {
    root.dataset.theme = themeBeforeOffDuty;
  }
  themeBeforeOffDuty = undefined;
}

/** Shared circle-sweep view transition out of a viewport point; `warm`
    picks the slower lamplight timing. Falls back to running `change`
    directly where the API is missing. */
function sweep(
  change: () => void,
  origin: { x: number; y: number } | undefined,
  warm: boolean,
) {
  if (typeof document.startViewTransition !== "function") {
    change();
    return;
  }
  const root = document.documentElement;
  const cls = warm ? "vt-warm" : "vt-active";
  root.style.setProperty("--vt-x", `${origin?.x ?? window.innerWidth / 2}px`);
  root.style.setProperty("--vt-y", `${origin?.y ?? window.innerHeight / 2}px`);
  root.classList.add(cls);
  const vt = document.startViewTransition(change);
  // a skipped transition (hidden tab) still applies the change — observe
  // both promises so nothing logs as an unhandled rejection
  vt.ready.catch(() => {});
  vt.finished
    .catch(() => {})
    .finally(() => root.classList.remove(cls));
}

/** Fire from any trigger. Notifies the mounted section to reveal + scroll.
    Where the View Transition API exists, the reveal plays as a warm circle
    sweep out of the trigger point (pass the trigger's viewport coords):
    the state flip AND an instant jump to the section happen inside the
    transition, so the sweep uncovers the lamplight world already in place.
    Without the API (or when already unlocked) it's the plain event. */
export function unlockOffDuty(
  origin?: { x: number; y: number },
  via: UnlockVia = "click",
) {
  const fire = () => {
    enterMood();
    // the origin rides along so the spark burst can start where the click
    // was; `via` lets the section explain an accidental unlock
    const detail: UnlockDetail = { ...origin, via };
    window.dispatchEvent(new CustomEvent(OFFDUTY_UNLOCK_EVENT, { detail }));
  };

  const alreadyUnlocked = !!document.querySelector(
    `section[aria-label="${OFFDUTY_ANCHOR_LABEL}"]`,
  );
  if (alreadyUnlocked) {
    fire();
    return;
  }

  sweep(
    () => {
      // flushSync commits the React reveal (and the mood flip) before the
      // new snapshot is taken, so the sweep uncovers the finished world
      flushSync(fire);
      document
        .querySelector(`section[aria-label="${OFFDUTY_ANCHOR_LABEL}"]`)
        ?.scrollIntoView({ block: "start", behavior: "instant" });
    },
    origin,
    true,
  );
}

/** "Back to work mode" — collapse the warm off-duty world back to the
    teaser and hand the page its daytime theme back, sweeping out of the
    button that was pressed. */
export function relockOffDuty(origin?: { x: number; y: number }) {
  const fire = () => {
    leaveMood();
    window.dispatchEvent(new CustomEvent(OFFDUTY_RELOCK_EVENT));
  };

  sweep(
    () => {
      flushSync(fire);
      document
        .getElementById(OFFDUTY_TEASER_ID)
        ?.scrollIntoView({ block: "center", behavior: "instant" });
    },
    origin,
    false,
  );
}

/** The Konami sequence: ↑ ↑ ↓ ↓ ← → ← → B A */
export const KONAMI_SEQUENCE = [
  // "ArrowUp",
  // "ArrowUp",
  "ArrowDown",
  "ArrowDown",
];
