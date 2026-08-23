import { profile, statusBadges, socials } from "@/lib/content";
import HeroPhoto from "./HeroPhoto";
import { ArrowUpRight } from "./icons";

export default function Hero() {
  return (
    <section aria-label="Introduction" className="pt-4 sm:pt-10">
      <p className="kicker">
        portfolio · {profile.location.toLowerCase()}
      </p>

      <div className="mt-6 flex flex-col-reverse items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="display text-[17vw] text-foreground sm:text-7xl md:text-8xl xl:text-[7rem]">
            Aryan
            <br />
            Patel<span className="text-accent">.</span>
          </h1>

          {profile.pronunciation && (
            <p className="mt-3 font-serif text-lg italic text-muted">
              ({profile.pronunciation})
            </p>
          )}

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-strong">
            {profile.tagline}
          </p>

          {/* currently — live roles, straight from the content file */}
          {statusBadges.length > 0 && (
            <div className="mt-8">
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
          <nav aria-label="Social links" className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((s) => (
              <a
                key={s.type + s.href}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="draw-link inline-flex items-center gap-1 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-strong transition-colors hover:text-foreground"
              >
                {s.label}
                <ArrowUpRight width={11} height={11} aria-hidden />
              </a>
            ))}
          </nav>
        </div>

        {profile.photo && (
          <HeroPhoto
            photo={profile.photo}
            photoHover={profile.photoHover}
            name={profile.name}
          />
        )}
      </div>
    </section>
  );
}
