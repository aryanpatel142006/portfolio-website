import Image from "next/image";
import type { StatusBadge as StatusBadgeType } from "@/lib/content";

/** Renders an emoji string, an image path, or a neutral fallback dot. */
export function BadgeIcon({
  icon,
  iconUrl,
  alt,
  size = 28,
}: {
  icon?: string;
  iconUrl?: string;
  alt: string;
  size?: number;
}) {
  const imageSrc = iconUrl ?? icon;

  if (!imageSrc) {
    return <span className="inline-block rounded-full bg-border-strong" style={{ width: size, height: size }} />;
  }
  if (imageSrc.startsWith("/") || imageSrc.startsWith("http")) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={size}
        height={size}
        className="rounded object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span className="leading-none" aria-hidden style={{ fontSize: size }}>
      {icon}
    </span>
  );
}

export default function StatusBadge({ badge }: { badge: StatusBadgeType }) {
  return (
    <div className="inline-flex cursor-pointer items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-3 backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
      <BadgeIcon icon={badge.icon} iconUrl={badge.iconUrl} alt={badge.iconAlt ?? badge.org} size={badge.size ?? 18} />
      <span className="flex flex-col leading-tight">
        <span className="text-[13px] font-medium text-foreground">
          {badge.role}
        </span>
        <span className="text-[11px] text-muted">{badge.org}</span>
      </span>
    </div>
  );
}
