import Image from "next/image";

/** Renders an emoji string, an image path, or a neutral fallback dot. */
export default function BadgeIcon({
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
    return (
      <span
        className="inline-block rounded-full bg-border-strong"
        style={{ width: size, height: size }}
      />
    );
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
