/** The night world's palettes. Each id matches a CSS block in globals.css
    (html[data-mood="offduty"][data-night="<id>"]) that overrides the tokens,
    the sky gradient, the aurora colors and the star hues. `swatch` is what
    the picker shows: accent, secondary, background. */
export type NightPalette = {
  id: string;
  name: string;
  blurb: string;
  swatch: [string, string, string];
};

export const NIGHT_PALETTES: NightPalette[] = [
  {
    id: "synth",
    name: "synthwave",
    blurb: "violet sky, hot pink and cyan neon, gold scores",
    swatch: ["#ff3d9a", "#33e6ff", "#08040f"],
  },
  {
    id: "arcade",
    name: "arcade",
    blurb: "black CRT, phosphor green, amber warnings",
    swatch: ["#39ff14", "#ffb000", "#050705"],
  },
  {
    id: "izakaya",
    name: "izakaya",
    blurb: "one neon only: lantern red on a rainy blue-black street",
    swatch: ["#ff3b3b", "#ffd9a0", "#0a0c14"],
  },
  {
    id: "abyss",
    name: "abyss",
    blurb: "deep-sea navy, bioluminescent teal, violet jellyfish",
    swatch: ["#2ef2c8", "#8b7cff", "#04101c"],
  },
  {
    id: "ember",
    name: "ember",
    blurb: "charcoal and lava: orange embers, magma yellow",
    swatch: ["#ff6a1f", "#ffd23f", "#120c0a"],
  },
  {
    id: "vapor",
    name: "vapor",
    blurb: "dusk purple with soft lavender, peach and mint pastels",
    swatch: ["#c5a3ff", "#ffb6a3", "#1b1436"],
  },
  {
    id: "ice",
    name: "ice",
    blurb: "near-monochrome: ice blue and white on deep blue-black",
    swatch: ["#9ad7ff", "#ffffff", "#0b1020"],
  },
  {
    id: "luxe",
    name: "luxe",
    blurb: "champagne gold and ivory on black, a ruby for the second voice",
    swatch: ["#e7c26b", "#d6455d", "#0c0a08"],
  },
];

export const DEFAULT_NIGHT = "synth";
export const NIGHT_KEY = "night";

export function isNight(id: string | null | undefined): id is string {
  return !!id && NIGHT_PALETTES.some((p) => p.id === id);
}
