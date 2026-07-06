import Image from "next/image";
import { awards } from "@/lib/content";

function AwardPill({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.6)]">
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={20}
          height={20}
          className="h-5 w-5 rounded object-contain"
        />
      ) : (
        <span className="h-2 w-2 shrink-0 rounded-full bg-accent/70" aria-hidden />
      )}
      <span className="whitespace-nowrap text-[13px] text-muted-strong">
        {name}
      </span>
    </div>
  );
}

export default function AwardsMarquee() {
  if (awards.length === 0) return null;

  return (
    <section aria-label="Awards">
      {/* <h2 className="mb-6 font-serif text-xl font-medium text-foreground">i&rsquo;ve won awards at</h2> */}

      {/* py + -my keeps the hover-lift from being clipped while preserving spacing */}
      <div className="marquee-group marquee-mask -my-3 overflow-hidden py-3">
        <div className="marquee-track flex gap-3">
          {/* Two identical copies produce a seamless -50% loop */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-3" aria-hidden={copy === 1}>
              {awards.map((a) => (
                <AwardPill key={copy + a.name} name={a.name} logo={a.logo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
