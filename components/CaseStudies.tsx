import Image from "next/image";
import { projects } from "@/lib/content";
import ProjectPlate from "./ProjectPlate";
import SectionHeading from "./SectionHeading";
import { ArrowUpRight, TrophyIcon } from "./icons";

export default function CaseStudies() {
  if (projects.length === 0) return null;

  return (
    <section aria-label="Projects">
      <SectionHeading
        index="04"
        label="selected work"
        title="Problems I've chased from idea to shipped."
      />

      <div className="flex flex-col">
        {projects.map((p, i) => (
          <article
            key={p.title}
            className="group border-b border-border py-10 first:border-t"
          >
            {/* meta row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="kicker">
                № {String(i + 1).padStart(2, "0")}
                {p.date && <span aria-hidden> — {p.date}</span>}
              </span>
              {p.badges?.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 border border-accent/30 bg-accent/[0.06] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent"
                >
                  {b.icon ? (
                    <span aria-hidden>{b.icon}</span>
                  ) : (
                    <TrophyIcon width={11} height={11} />
                  )}
                  {b.label}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-[1fr_300px]">
              {/* words */}
              <div>
                <h3 className="display text-3xl text-foreground sm:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-1.5 font-serif text-lg italic text-muted-strong">
                  {p.kicker}
                </p>

                {p.description && (
                  <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-muted-strong">
                    {p.description}
                  </p>
                )}

                {p.highlights && p.highlights.length > 0 && (
                  <ul className="mt-4 flex max-w-xl flex-col gap-2">
                    {p.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted-strong"
                      >
                        <span aria-hidden className="select-none text-accent">
                          —
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {p.tags && p.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-strong"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {p.links && p.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-5">
                    {p.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          l.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="draw-link inline-flex items-center gap-1 font-mono text-[12px] uppercase tracking-[0.12em] text-foreground"
                      >
                        {l.label}
                        <ArrowUpRight width={12} height={12} aria-hidden />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* numbers & picture */}
              <div className="flex flex-col gap-5">
                {p.stat && (
                  <div className="border-l-2 border-accent pl-4">
                    <p className="display text-4xl text-foreground sm:text-5xl">
                      {p.stat.value}
                    </p>
                    <p className="kicker mt-1">{p.stat.label}</p>
                  </div>
                )}
                {p.plate ? (
                  <div className="aspect-[16/10] w-full overflow-hidden border border-border bg-card transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]">
                    <ProjectPlate kind={p.plate} />
                  </div>
                ) : (
                  p.image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-card">
                      <Image
                        src={p.image}
                        alt={`${p.title} preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
