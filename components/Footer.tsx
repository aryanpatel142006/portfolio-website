import { profile, socials } from "@/lib/content";
import LogoMark from "./LogoMark";
import { ArrowUpRight } from "./icons";

export default function Footer() {
  const email = socials
    .find((s) => s.type === "email")
    ?.href.replace("mailto:", "");
  const github = socials.find((s) => s.type === "github")?.href;

  return (
    <footer aria-label="Contact" className="mt-10">
      <hr className="divider" />

      <div className="py-16 sm:py-20">
        <p className="kicker">06 / contact</p>
        <h2 className="display mt-4 text-5xl text-foreground sm:text-6xl md:text-7xl">
          Let&rsquo;s build
          <br />
          something <span className="italic text-accent">human</span>.
        </h2>

        <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted-strong">
          Open to internships, research, and interesting problems — especially
          the kind that make technology kinder to the people using it.
        </p>

        {email && (
          <a
            href={`mailto:${email}`}
            className="group mt-8 inline-flex items-center gap-3 border border-border-strong bg-surface px-6 py-4 font-mono text-[13px] text-foreground shadow-[var(--shadow)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent hover:text-accent"
          >
            {email}
            <ArrowUpRight
              width={14}
              height={14}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        )}

        {/* signed, like the end of a letter */}
        <div className="mt-14">
          <span className="sr-only">— Aryan</span>
          <div aria-hidden className="origin-left -rotate-2">
            <p className="font-serif text-[15px] italic text-muted">yours,</p>
            <p className="mt-1.5 text-4xl text-foreground">
              <LogoMark size="0.8em" className="inline-block mr-[-0.1em]" />
              <span className="font-serif italic tracking-tight">ryan</span>
            </p>
          </div>
        </div>

        <nav
          aria-label="Social links"
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2"
        >
          {socials.map((s) => (
            <a
              key={s.type + s.href}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="draw-link font-mono text-[12px] uppercase tracking-[0.12em] text-muted-strong transition-colors hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] text-muted">
          © 2026 {profile.name} · {profile.location.toLowerCase()}
        </p>
        <p className="font-mono text-[11px] text-muted">
          set in fraunces & geist mono · next.js 16
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
