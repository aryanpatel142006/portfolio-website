import { experiences } from "@/lib/content";
import { BadgeIcon } from "./StatusBadge";
import SectionHeading from "./SectionHeading";

export default function Experiences() {
  if (experiences.length === 0) return null;

  return (
    <section aria-label="Experiences">
      <SectionHeading>experiences</SectionHeading>

      <div className="flex flex-col gap-2.5">
        {experiences.map((exp) => (
          <div
            key={exp.role + exp.org}
            className={[
              "group flex min-h-[100px] items-center justify-between gap-5 rounded-xl border px-5 py-5 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]",
              exp.active
                ? "border-accent/40 bg-accent/[0.07]"
                : "border-white/[0.08] bg-white/[0.03]",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <BadgeIcon icon={exp.icon} iconUrl={exp.iconUrl} alt={exp.iconAlt ?? exp.org} size={40} />
              <div className="flex flex-col leading-tight">
                <span className="text-[14px] font-medium text-foreground">
                  {exp.role}
                </span>
                <span className="font-mono text-[12px] text-muted">
                  {exp.org}
                </span>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-2 text-right font-mono text-[11px] text-muted sm:text-[12px]">
              {exp.active && (
                <span
                  aria-hidden
                  className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent"
                />
              )}
              {exp.period}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
