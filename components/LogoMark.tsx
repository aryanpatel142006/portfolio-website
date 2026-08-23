/** The "A." monogram — inline SVG so the A follows the theme's ink color
    while the period keeps the accent blue. Same mark as /logo.svg and the
    favicon (app/icon.svg); edit all three together. */
export default function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 72 64"
      height={size}
      width={(size * 72) / 64}
      role="img"
      aria-hidden
      className="block"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M30 8 L41 8 L60 56 L48.5 56 L44 44 L22.5 44 L18.5 56 L7 56 Z
           M33.5 21 L40 38 L27.5 38 Z"
      />
      <circle cx="66.5" cy="51" r="5" style={{ fill: "var(--accent)" }} />
    </svg>
  );
}
