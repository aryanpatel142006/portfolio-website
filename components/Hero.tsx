import { opensNewTab, profile, statusBadges, socials } from "@/lib/content";
import HeroPhoto from "./HeroPhoto";
import LogoMark from "./LogoMark";
import { ArrowUpRight } from "./icons";
import SplitText from "./fx/SplitText";
import Scramble from "./fx/Scramble";
import Tilt from "./fx/Tilt";

export default function Hero() {
  return (
    <section aria-label="Introduction" className="pt-4 sm:pt-10">
      <p className="rise kicker">
        <Scramble text={`portfolio · ${profile.location.toLowerCase()}`} />
      </p>

      <div className="mt-6 flex flex-col-reverse items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1
            data-repel-zone
            className="display text-[17vw] text-foreground sm:text-7xl md:text-8xl xl:text-[7rem]"
          >
            <span className="sr-only">Aryan Patel.</span>
            {/* visual layer: the hand-drawn glyph stands in for the first A;
                every other glyph rises out of the line's mask on its own
                beat and leans away from the pointer once it's landed */}
            <span aria-hidden>
              <span className="line-mask">
                <span className="inline-block">
                  <LogoMark size="0.74em" className="inline-block mr-[-0.1em]" />
                  <SplitText text="ryan" delay={90} stagger={45} repel />
                </span>
              </span>
              <span className="line-mask">
                <span className="inline-block">
                  <SplitText text="Patel" delay={330} stagger={45} repel />
                  <span className="dot-pop text-accent">.</span>
                </span>
              </span>
            </span>
          </h1>

          {profile.pronunciation && (
            <p className="rise rise-2 mt-3 font-serif text-lg italic text-muted">
              ({profile.pronunciation})
            </p>
          )}

          <p className="rise rise-3 mt-6 max-w-md text-[15px] leading-relaxed text-muted-strong">
            {profile.tagline}
          </p>

          {/* currently — live roles, straight from the content file */}
          {statusBadges.length > 0 && (
            <div className="rise rise-4 mt-8">
              <p className="kicker mb-2.5">currently</p>
              <ul className="flex flex-col gap-1.5">
                {statusBadges.map((b) => (
                  <li key={b.role + b.org} className="flex items-center gap-2.5">
                    <span aria-hidden className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-live" />
                    <span className="text-[14px] text-foreground">
                      {b.role}
                      <span className="text-muted"> @ {b.org}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* editorial text links instead of icon soup */}
          <nav aria-label="Social links" className="rise rise-5 mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((s) => (
              <a
                key={s.type + s.href}
                href={s.href}
                target={opensNewTab(s.href) ? "_blank" : undefined}
                rel={opensNewTab(s.href) ? "noopener noreferrer" : undefined}
                className="draw-link hitbox inline-flex items-center gap-1 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-strong transition-colors hover:text-foreground"
              >
                {s.label}
                <ArrowUpRight width={11} height={11} aria-hidden />
              </a>
            ))}
          </nav>
        </div>

        {profile.photo && (
          <div className="polaroid-in">
            <Tilt max={7} glare={false}>
              <HeroPhoto
                photo={profile.photo}
                photoHover={profile.photoHover}
                name={profile.name}
              />
            </Tilt>
          </div>
        )}
      </div>
    </section>
  );
}
