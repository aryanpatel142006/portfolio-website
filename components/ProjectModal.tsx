"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
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

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Blurred backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="animate-panel-in relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border-strong bg-[#1b2121] p-5 shadow-2xl sm:p-6">
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
    </div>
  );
}
