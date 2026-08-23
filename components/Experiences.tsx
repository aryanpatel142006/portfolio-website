import { experiences } from "@/lib/content";
import BadgeIcon from "./BadgeIcon";
import SectionHeading from "./SectionHeading";

export default function Experiences() {
  if (experiences.length === 0) return null;

  return (
    <section aria-label="Experiences">
      <SectionHeading
        index="03"
        label="experience"
        title="Where I've been useful."
      />

      {/* epigraph — a wink above the receipts */}
      <p className="-mt-4 mb-8 max-w-md font-serif text-[15px] italic leading-relaxed text-muted">
        &ldquo;experience is the name everyone gives to their mistakes.&rdquo;
        <span className="ml-2 whitespace-nowrap font-mono text-[10px] uppercase not-italic tracking-[0.12em]">
          &mdash; oscar wilde
        </span>
      </p>

      <div className="flex flex-col">
        {experiences.map((exp, i) => (
          <article
            key={exp.role + exp.org}
            className="group grid grid-cols-1 gap-x-8 gap-y-3 border-b border-border py-8 first:border-t sm:grid-cols-[56px_1fr_auto]"
          >
            {/* index */}
            <span className="kicker pt-1.5 sm:pt-2">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* body */}
            <div>
              <h3 className="display text-2xl text-foreground transition-colors duration-300 group-hover:text-accent sm:text-3xl">
                {exp.role}
              </h3>
              <p className="mt-1.5 flex items-center gap-2 font-mono text-[12px] text-muted-strong">
                <BadgeIcon
                  icon={exp.icon}
                  iconUrl={exp.iconUrl}
                  alt={exp.iconAlt ?? exp.org}
                  size={18}
                />
                {exp.org}
                {exp.location && (
                  <span className="text-muted"> · {exp.location}</span>
                )}
              </p>

              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-4 flex max-w-xl flex-col gap-2">
                  {exp.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted-strong"
                    >
                      <span aria-hidden className="select-none text-accent">
                        —
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* period */}
            <span className="flex h-fit shrink-0 items-center gap-2 font-mono text-[11px] text-muted sm:pt-2.5 sm:text-[12px]">
              {exp.active && (
                <span
                  aria-hidden
                  className="pulse-dot h-1.5 w-1.5 rounded-full bg-live"
                />
              )}
              {exp.period}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
