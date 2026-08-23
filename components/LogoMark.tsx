import type { CSSProperties } from "react";

/** The hand-drawn "A" glyph (public/a-symbol.png), rendered through a CSS
    mask so it inherits the theme's ink color — ink on paper, cream on
    midnight. Used in the header, as the hero drop cap, and (embedded) in
    the favicon at app/icon.svg.
    `size` takes px (number) or any CSS length ("0.74em" scales with type). */
export default function LogoMark({
  size = 22,
  className = "block",
}: {
  size?: number | string;
  className?: string;
}) {
  const style: CSSProperties = {
    height: size,
    aspectRatio: "417 / 359", // trimmed glyph dimensions
    backgroundColor: "currentColor",
    maskImage: "url(/a-symbol.png)",
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: "url(/a-symbol.png)",
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
  };
  return <span aria-hidden className={className} style={style} />;
}
