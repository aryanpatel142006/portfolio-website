"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { socials, profile } from "@/lib/content";
import { unlockOffDuty } from "@/lib/offduty";
import { SocialGlyph } from "./icons";

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  run: () => void;
};

function scrollToLabel(label: string) {
  const el = document.querySelector(`[aria-label="${label}"]`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  // Reset the highlighted row whenever the search changes — done during
  // render (React's derived-state pattern) instead of an effect.
  const [lastQuery, setLastQuery] = useState(query);
  if (lastQuery !== query) {
    setLastQuery(query);
    setActive(0);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const email = useMemo(
    () => socials.find((s) => s.type === "email")?.href.replace("mailto:", ""),
    [],
  );

  const commands: Command[] = useMemo(() => {
    const nav: Command[] = [
      { id: "top", label: "Go to top", hint: "section", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
      { id: "query", label: "Ask me anything", hint: "section", run: () => scrollToLabel("Ask me anything") },
      { id: "exp", label: "Experience", hint: "section", run: () => scrollToLabel("Experiences") },
      { id: "projects", label: "Selected work", hint: "section", run: () => scrollToLabel("Projects") },
      { id: "record", label: "The record", hint: "section", run: () => scrollToLabel("Recognition") },
      { id: "contact", label: "Contact", hint: "section", run: () => scrollToLabel("Contact") },
    ];
    const links: Command[] = socials.map((s) => ({
      id: "social-" + s.type,
      label: `Open ${s.label}`,
      hint: "link",
      icon: <SocialGlyph type={s.type} width={15} height={15} />,
      run: () => window.open(s.href, s.href.startsWith("http") ? "_blank" : "_self"),
    }));
    const actions: Command[] = email
      ? [
          {
            id: "copy-email",
            label: "Copy email address",
            hint: "action",
            run: async () => {
              try {
                await navigator.clipboard.writeText(email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {}
            },
          },
        ]
      : [];
    return [...nav, ...actions, ...links];
  }, [email]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    // Secret: typing an identity word surfaces the hidden off-duty section.
    const secretWords = ["whoami", "sudo", "off-duty", "offduty", "human"];
    if (secretWords.some((w) => w.includes(q) || q.includes(w))) {
      const secret: Command = {
        id: "offduty",
        label: "whoami — the off-duty me",
        hint: "secret",
        run: () => unlockOffDuty(),
      };
      return [secret, ...commands.filter((c) => c.label.toLowerCase().includes(q))];
    }
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  // Global open shortcut + custom event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("cmdk:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", onOpen);
    };
  }, []);

  // When open: focus, lock scroll, restore focus on close
  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      prevActive?.focus();
    };
  }, [open]);

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") return close();
    // The palette is a single-input surface: trap Tab so keyboard focus
    // never escapes behind the overlay.
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) {
        cmd.run();
        if (cmd.id !== "copy-email") close();
      }
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <>
      {open && (
        <div
          className="animate-overlay-in fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[18vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onKeyDown={onListKey}
        >
          <button
            aria-label="Close"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-md"
          />
          <div className="animate-panel-in relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border-strong bg-surface/95 shadow-2xl backdrop-blur-xl">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search…"
              aria-label="Search commands"
              className="w-full border-b border-border bg-transparent px-4 py-3.5 font-mono text-[13px] text-foreground placeholder:text-muted focus:outline-none"
            />
            <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center font-mono text-[12px] text-muted">
                  no matches
                </p>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  data-idx={i}
                  onMouseMove={() => active !== i && setActive(i)}
                  onClick={() => {
                    cmd.run();
                    if (cmd.id !== "copy-email") close();
                  }}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    i === active ? "bg-card-hover" : "hover:bg-card",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-muted">{cmd.icon}</span>
                    <span className="text-[13px] text-foreground">
                      {cmd.id === "copy-email" && copied ? "Copied!" : cmd.label}
                    </span>
                  </span>
                  {cmd.hint && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {cmd.hint}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[10px] text-muted">
              <span>{profile.name}</span>
              <span>↑↓ navigate · ↵ select · esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
