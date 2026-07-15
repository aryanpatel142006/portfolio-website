"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/content";
import { TrophyIcon, ArrowUpRight } from "./icons";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Portal target only exists on the client — mount after first paint.
  useEffect(() => setMounted(true), []);

  // Close on Escape, lock body scroll, trap focus, and restore focus on close.
  useEffect(() => {
    const prevActive = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      prevActive?.focus();
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Blurred backdrop */}
      <button
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-md"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="animate-panel-in relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border-strong bg-[#1b2121] p-5 shadow-2xl sm:p-6"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          <span aria-hidden className="text-sm leading-none">
            &times;
          </span>
        </button>

        {/* Header */}
        <div className="pr-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-serif text-2xl font-medium text-foreground">
              {project.title}
            </h3>
            {project.badges?.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/20 bg-amber-400/[0.06] px-2 py-0.5 font-mono text-[11px] text-amber-200/90"
              >
                {b.icon ? (
                  <span aria-hidden>{b.icon}</span>
                ) : (
                  <TrophyIcon className="text-amber-300/80" />
                )}
                {b.label}
              </span>
            ))}
          </div>
          {project.date && (
            <p className="mt-1 font-mono text-[12px] text-muted">
              {project.date}
            </p>
          )}
        </div>

        {/* Media */}
        <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-black/25">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.05] to-transparent">
              <span className="font-mono text-xs text-muted">
                {project.title}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="mt-4 text-[13px] leading-relaxed text-muted-strong">
            {project.description}
          </p>
        )}

        {/* Tech tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-white/[0.02] px-2 py-1 font-mono text-[11px] text-muted-strong"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {project.links && project.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4">
            {project.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 font-mono text-[12px] text-muted transition-colors hover:text-foreground"
              >
                <ArrowUpRight width={13} height={13} />
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
