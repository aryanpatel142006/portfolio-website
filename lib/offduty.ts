/**
 * Shared unlock plumbing for the hidden "off-duty" section.
 * Any trigger (⌘K command, cat clicks, Konami code) calls unlockOffDuty();
 * OffDuty.tsx listens for the event and persists the state.
 */

export const OFFDUTY_STORAGE_KEY = "portfolio-offduty-unlocked";
export const OFFDUTY_UNLOCK_EVENT = "offduty:unlock";
export const OFFDUTY_ANCHOR_LABEL = "Off duty";

/** Fire from any trigger. Persists + notifies the mounted section to reveal + scroll. */
export function unlockOffDuty() {
  try {
    window.localStorage.setItem(OFFDUTY_STORAGE_KEY, "1");
  } catch {}
  window.dispatchEvent(new CustomEvent(OFFDUTY_UNLOCK_EVENT));
}

/** The Konami sequence: ↑ ↑ ↓ ↓ ← → ← → B A */
export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
