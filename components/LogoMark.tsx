import type { CSSProperties } from "react";

/** The hand-drawn "A" glyph (public/a-symbol.png), rendered through a CSS
    mask so it inherits the theme's ink color — ink on paper, cream on
    midnight. The favicon (app/icon.svg) embeds the same glyph. */
const ASPECT = 417 / 359; // trimmed glyph dimensions

export default function LogoMark({ size = 22 }: { size?: number }) {
  const style: CSSProperties = {
    height: size,
    width: Math.round(size * ASPECT),
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
  return <span aria-hidden className="block" style={style} />;
}
