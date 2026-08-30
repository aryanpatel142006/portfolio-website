import { opensNewTab, profile, socials } from "@/lib/content";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import { ArrowUpRight } from "./icons";

export default function Footer() {
  const email = socials
    .find((s) => s.type === "email")
    ?.href.replace("mailto:", "");
  const github = socials.find((s) => s.type === "github")?.href;

  return (
    <footer id="contact" aria-label="Contact" className="mt-10 scroll-mt-20">
      <hr className="divider divider-draw" />

      <Reveal className="py-16 sm:py-20">
        <p className="kicker">06 / contact</p>
        <h2 className="display mt-4 text-5xl text-foreground sm:text-6xl md:text-7xl">
          Let&rsquo;s build
          <br />
          something <span className="draw-word italic text-accent">human</span>.
        </h2>

        <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted-strong">
          Open to internships, research, and interesting problems — especially
          the kind that make technology kinder to the people using it.
        </p>

        {email && (
          <Magnetic className="mt-8 inline-block" strength={0.25}>
            <a
              href={`mailto:${email}`}
              className="group pressable inline-flex items-center gap-3 border border-border-strong bg-surface px-6 py-4 font-mono text-[13px] text-foreground shadow-[var(--shadow)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent hover:text-accent"
            >
              {email}
              <ArrowUpRight
                width={14}
                height={14}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Magnetic>
        )}

        <nav
          aria-label="Social links"
          className="mt-10 flex flex-wrap gap-x-6 gap-y-2"
        >
          {socials.map((s) => (
            <a
              key={s.type + s.href}
              href={s.href}
              target={opensNewTab(s.href) ? "_blank" : undefined}
              rel={opensNewTab(s.href) ? "noopener noreferrer" : undefined}
              className="draw-link hitbox font-mono text-[12px] uppercase tracking-[0.12em] text-muted-strong transition-colors hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </Reveal>

      <div className="flex flex-col gap-1.5 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] text-muted">
          © 2026 {profile.name}
        </p>
        <p className="font-mono text-[11px] text-muted">
          next.js 16
          {github && (
            <>
              {" · "}
              <a
                href={`${github}/portfolio-website`}
                target="_blank"
                rel="noopener noreferrer"
                className="draw-link text-muted-strong hover:text-foreground"
              >
                view source
              </a>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
