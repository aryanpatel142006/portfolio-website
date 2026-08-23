"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Moon, SunMedium } from "lucide-react";
import { profile } from "@/lib/content";
import LogoMark from "./LogoMark";

/* New Brunswick wall clock — first tick is deferred a frame so the server
   and client never disagree about the time. */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/New_York",
    });
    const tick = () => setTime(fmt.format(new Date()));
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 10_000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return (
    <span className="hidden font-mono text-[11px] tracking-[0.14em] text-muted sm:inline">
      {profile.location.toUpperCase()}
      <span aria-hidden> — </span>
      <span className="tabular-nums">{time ?? "--:--"}</span>
    </span>
  );
}

/* The <html data-theme> attribute (set pre-paint by the inline script in
   layout.tsx) is the single source of truth; this store just mirrors it. */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => "light" as const,
  );

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-strong transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:text-foreground"
    >
      {theme === "dark" ? (
        <SunMedium className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-[94%] items-center justify-between py-3 sm:w-[90%] lg:w-[82%] xl:w-[70%] 2xl:w-[58%]">
        <a
          href="#top"
          aria-label="Aryan Patel — back to top"
          className="text-foreground transition-opacity hover:opacity-70"
        >
          <LogoMark size={22} />
        </a>

        <div className="flex items-center gap-4">
          <LocalTime />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("cmdk:open"))}
            aria-label="Open command palette"
            className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:text-foreground sm:inline-flex"
          >
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
