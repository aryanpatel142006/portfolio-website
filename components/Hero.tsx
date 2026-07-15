import { profile, statusBadges } from "@/lib/content";
import StatusBadge from "./StatusBadge";
import SocialLinks from "./SocialLinks";
import HeroPhoto from "./HeroPhoto";

export default function Hero() {
  return (
    <section className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <h1 className="font-serif text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
          {profile.name}
        </h1>
        {profile.pronunciation && (
          <p className="mt-1 font-serif text-lg italic text-muted">
            ({profile.pronunciation})
          </p>
        )}

        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-strong">
          {profile.tagline}
        </p>

        {statusBadges.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2.5">
            {statusBadges.map((b) => (
              <StatusBadge key={b.role + b.org} badge={b} />
            ))}
          </div>
        )}

        <SocialLinks className="mt-6" />
      </div>

      {profile.photo && (
        <HeroPhoto
          photo={profile.photo}
          photoHover={profile.photoHover}
          name={profile.name}
        />
      )}
    </section>
  );
}
