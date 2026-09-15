"use client";

import { useState } from "react";

/* A guest book at the bottom of the off-duty world: one note, an optional
   name, nothing else. Notes go to a private table only the owner reads;
   a few may be quoted on a future page. The card renders only when the
   server has storage configured (see lib/feedback.ts). */

const SENT_KEY = "guestbook-sent";
const NOTE_MAX = 800;

type Status = "idle" | "sending" | "sent" | "error" | "limited";

export default function GuestBook() {
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  // a visitor who already wrote this session sees the thank-you, not a
  // blank form, when they scroll back. This card only ever mounts after the
  // client-side unlock, so reading sessionStorage here cannot mismatch SSR.
  const [status, setStatus] = useState<Status>(() => {
    try {
      return sessionStorage.getItem(SENT_KEY) ? "sent" : "idle";
    } catch {
      return "idle";
    }
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = note.trim();
    if (text.length < 3 || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: text,
          name: name.trim(),
          website,
          night: document.documentElement.dataset.night ?? null,
          path: location.pathname,
        }),
      });
      if (res.status === 429) {
        setStatus("limited");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      try {
        sessionStorage.setItem(SENT_KEY, "1");
      } catch {}
    } catch {
      setStatus("error");
    }
  }

  const left = NOTE_MAX - note.length;

  return (
    <div className="mt-14">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
        guest book
        <span className="ml-2 normal-case tracking-normal text-muted/70">· leave a note</span>
      </p>

      <div className="guest-book arcade-card rounded-xl border p-5 sm:p-6">
        {status === "sent" ? (
          <div className="guest-book-thanks" role="status" aria-live="polite">
            <p className="font-arcade text-[9px] uppercase tracking-[0.18em] text-neon-2">note saved</p>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-foreground">
              thank you. it went straight to Aryan, nowhere else.
            </p>
            <button
              type="button"
              onClick={() => {
                setNote("");
                setName("");
                setStatus("idle");
              }}
              className="mt-3 font-mono text-[11px] text-muted transition-colors hover:text-foreground"
            >
              write another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <p className="max-w-lg text-[14px] leading-relaxed text-muted-strong">
              what worked, what got in the way, what you would change. read by Aryan only; a few
              notes may be quoted on a future page, first name at most.
            </p>

            <label className="sr-only" htmlFor="guest-note">
              your note
            </label>
            <div className="field-focus rounded-lg border border-border bg-surface/60">
              <textarea
                id="guest-note"
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
                placeholder="say anything. even 'the coin thing is silly' helps."
                rows={4}
                required
                minLength={3}
                maxLength={NOTE_MAX}
                className="block w-full resize-y bg-transparent px-3.5 py-3 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted"
              />
              <div className="flex items-center justify-between gap-3 border-t border-border/70 px-3.5 py-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 40))}
                  placeholder="name or handle (optional)"
                  aria-label="Name or handle, optional"
                  autoComplete="nickname"
                  maxLength={40}
                  className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-foreground placeholder:text-muted"
                />
                <span
                  aria-hidden
                  className={`shrink-0 font-mono text-[10px] tabular-nums ${left < 60 ? "text-accent" : "text-muted/70"}`}
                >
                  {left}
                </span>
              </div>
            </div>

            {/* honeypot: hidden from people, irresistible to bots */}
            <div className="guest-book-hp" aria-hidden>
              <label htmlFor="guest-website">website</label>
              <input
                id="guest-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="submit"
                disabled={note.trim().length < 3 || status === "sending"}
                className="pressable inline-flex items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-4 py-2 font-mono text-[11px] text-foreground transition-colors hover:bg-accent hover:text-accent-contrast disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent/10 disabled:hover:text-foreground"
              >
                {status === "sending" ? "posting…" : "post it"}
                <span aria-hidden className={status === "sending" ? "guest-book-dot" : ""}>
                  {status === "sending" ? "" : "↵"}
                </span>
              </button>
              {status === "error" && (
                <p role="alert" className="font-mono text-[11px] text-accent">
                  the book is closed right now. try again in a minute.
                </p>
              )}
              {status === "limited" && (
                <p role="alert" className="font-mono text-[11px] text-accent">
                  three notes an hour is the house limit. come back later.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
