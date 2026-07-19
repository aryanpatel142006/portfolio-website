/**
 * Shared unlock plumbing for the hidden "off-duty" section.
 * Any trigger (⌘K command, cat clicks, Konami code) calls unlockOffDuty();
 * OffDuty.tsx listens for the event and reveals in place.
 *
 * Deliberately session-only (in-memory) — no persistence. It's an easter egg:
 * a reload puts it back to the locked teaser so it can be rediscovered.
 */

export const OFFDUTY_UNLOCK_EVENT = "offduty:unlock";
export const OFFDUTY_RELOCK_EVENT = "offduty:relock";
export const OFFDUTY_ANCHOR_LABEL = "Off duty";

/** Fire from any trigger. Notifies the mounted section to reveal + scroll. */
export function unlockOffDuty() {
  window.dispatchEvent(new CustomEvent(OFFDUTY_UNLOCK_EVENT));
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
