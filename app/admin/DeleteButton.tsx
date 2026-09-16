"use client";

import { useEffect, useState } from "react";

/** Two clicks to delete: the first arms it for a few seconds, the second
    submits the surrounding form. No dialogs. */
export default function DeleteButton() {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setArmed(false), 3500);
    return () => window.clearTimeout(t);
  }, [armed]);
  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="font-mono text-[11px] text-muted transition-colors hover:text-foreground"
      >
        delete
      </button>
    );
  }
  return (
    <button
      type="submit"
      className="rounded-full border border-red-500/60 bg-red-500/10 px-2.5 py-0.5 font-mono text-[11px] text-foreground transition-colors hover:bg-red-500 hover:text-white"
    >
      sure? delete
    </button>
  );
}
