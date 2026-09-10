"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Moon, SunMedium } from "lucide-react";
import { motion } from "motion/react";
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
      <span className="tabular-nums">{time ?? "--:--"}</span>
    </span>
  );
}

const NAV: [string, string][] = [
  ["work", "#work"],
  ["experience", "#experience"],
  ["contact", "#contact"],
];

/* Section nav with a shared ink underline that slides between items as the
   matching section crosses the middle band of the viewport. */
function SectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = NAV.map(([, h]) => document.querySelector(h)).filter(
      (el): el is Element => !!el,
    );
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    // back at the top, no section is "current"
    const hero = document.querySelector('section[aria-label="Introduction"]');
    const top = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setActive(null);
    });
    if (hero) top.observe(hero);
    return () => {
      io.disconnect();
      top.disconnect();
    };
  }, []);

  return (
    <nav aria-label="Sections" className="flex items-center gap-4 sm:gap-5">
      {NAV.map(([label, href]) => (
        <a
          key={href}
          href={href}
          aria-current={active === href ? "true" : undefined}
          className="draw-link hitbox relative font-mono text-[11px] lowercase tracking-[0.1em] text-muted transition-colors hover:text-foreground aria-[current]:text-foreground"
        >
          {label}
          {active === href && (
            <motion.span
              layoutId="nav-ink"
              aria-hidden
              className="absolute -bottom-1.5 left-0 right-0 h-px bg-accent"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
        </a>
      ))}
    </nav>
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

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };

    // Sweep the new theme out of the button in a widening circle where the
    // View Transition API exists; elsewhere, swap instantly as before.
    const root = document.documentElement;
    if (typeof document.startViewTransition === "function") {
      const r = e.currentTarget.getBoundingClientRect();
      root.style.setProperty("--vt-x", `${r.left + r.width / 2}px`);
      root.style.setProperty("--vt-y", `${r.top + r.height / 2}px`);
      root.classList.add("vt-active");
      const vt = document.startViewTransition(apply);
      // a skipped transition (hidden tab, rapid re-toggle) still applies the
      // theme but rejects `ready` — observe both promises so nothing lands
      // in the console as an unhandled rejection
      vt.ready.catch(() => {});
      vt.finished
        .catch(() => {})
        .finally(() => root.classList.remove("vt-active"));
    } else {
      apply();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="pressable hitbox inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-strong transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:text-foreground"
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
    <header className="header-in sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-[94%] items-center justify-between py-3 sm:w-[90%] lg:w-[82%] xl:w-[70%] 2xl:w-[58%]">
        <a
          href="#top"
          aria-label="Aryan Patel, back to top"
          className="hitbox text-foreground transition-opacity hover:opacity-70"
        >
          {/* the glyph turns one full revolution over the length of the page */}
          <LogoMark size={22} className="logo-scroll-spin block" />
        </a>

        <SectionNav />

        <div className="flex items-center gap-4">
          <LocalTime />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("cmdk:open"))}
            aria-label="Open command palette"
            className="pressable hitbox hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:text-foreground sm:inline-flex"
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
