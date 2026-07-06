import Image from "next/image";
import { profile, statusBadges } from "@/lib/content";
import StatusBadge from "./StatusBadge";
import SocialLinks from "./SocialLinks";

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
        <div className="group relative w-40 shrink-0 cursor-pointer select-none sm:w-44">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 shadow-lg transition-shadow duration-500 group-hover:shadow-2xl">
            <Image
              src={profile.photo}
              alt={profile.name}
              fill
              priority
              sizes="(max-width: 640px) 160px, 176px"
              className="object-cover opacity-100 transition-opacity duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-50"
            />
            {profile.photoHover && (
              <Image
                src={profile.photoHover}
                alt=""
                fill
                sizes="(max-width: 640px) 160px, 176px"
                className="object-cover opacity-0 transition-opacity duration-[2500ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-80"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
