import { socials } from "@/lib/content";
import { SocialGlyph } from "./icons";

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <nav
      aria-label="Social links"
      className={`flex items-center gap-4 text-muted ${className}`}
    >
      {socials.map((s) => (
        <a
          key={s.type + s.href}
          href={s.href}
          target={s.href.startsWith("http") ? "_blank" : undefined}
          rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={s.label}
          title={s.label}
          className="transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:scale-110 hover:text-foreground"
        >
          <SocialGlyph type={s.type} />
        </a>
      ))}
    </nav>
  );
}
