"use client";

import Image from "next/image";
import type { CSSProperties, MouseEvent } from "react";
import type { Project } from "@/lib/content";
import { TrophyIcon } from "./icons";

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  function trackCursor(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseMove={trackCursor}
      aria-label={`Open ${project.title}`}
      style={{ "--mx": "50%", "--my": "50%" } as CSSProperties}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-left backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_18px_50px_-18px_rgba(95,178,161,0.30)]"
    >
      {/* Cursor-following spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx) var(--my), rgba(255,255,255,0.10), transparent 65%)",
        }}
      />

      <div className="relative z-10 mb-3 flex items-baseline justify-between gap-2">
        <span className="font-mono text-[14px] font-semibold text-foreground">
          {project.title}
        </span>
        {project.date && (
          <span className="shrink-0 font-mono text-[11px] text-muted">
            {project.date}
          </span>
        )}
      </div>

      <div className="relative z-10 aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-black/20">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.04] to-transparent">
            <span className="font-mono text-xs text-muted">{project.title}</span>
          </div>
        )}
      </div>

      {project.badges && project.badges.length > 0 && (
        <div className="relative z-10 mt-3 flex flex-wrap gap-2">
          {project.badges.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/20 bg-amber-400/[0.06] px-2 py-1 font-mono text-[11px] text-amber-200/90"
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
      )}
    </button>
  );
}
