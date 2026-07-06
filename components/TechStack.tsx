import { stack } from "@/lib/content";
import SectionHeading from "./SectionHeading";

export default function TechStack() {
  if (stack.length === 0) return null;

  return (
    <section aria-label="Tech stack">
      <SectionHeading>stack</SectionHeading>

      <div className="flex flex-col gap-5">
        {stack.map((group) => (
          <div key={group.label}>
            <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-muted">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="cursor-default rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[12px] text-muted-strong backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-accent/40 hover:bg-accent/[0.08] hover:text-foreground hover:shadow-[0_10px_24px_-12px_rgba(95,178,161,0.4)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
