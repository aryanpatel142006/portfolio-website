/** 3D objects for the off-duty stage. GLBs live in public/models, compressed
    with Draco + WebP (1K textures). `orbit` is the opening camera. */
export type StageModel = {
  id: string;
  name: string;
  blurb: string;
  src: string;
  orbit: string;
  credit: string;
  license: string;
};

export const STAGE_MODELS: StageModel[] = [
  {
    id: "cat",
    name: "the cat",
    blurb: "the hoodie-and-chain cat from the polaroid, in the round",
    src: "/models/cat.glb",
    orbit: "-25deg 78deg 110%",
    credit: "downloaded model (FIRE CAT)",
    license: "check source license before shipping",
  },
  {
    id: "crt",
    name: "signal lost",
    blurb: "a portable CRT stuck on a test pattern",
    src: "/models/crt.glb",
    orbit: "-15deg 82deg 105%",
    credit: "downloaded model (monitor)",
    license: "check source license before shipping",
  },
  {
    id: "kiosk",
    name: "noodle kiosk",
    blurb: "a neon noodle stand, lanterns and all",
    src: "/models/kiosk.glb",
    orbit: "25deg 76deg 115%",
    credit: "downloaded model (cyberpunk noodle kiosk)",
    license: "check source license before shipping",
  },
  {
    id: "boombox",
    name: "boombox",
    blurb: "for the non-mainstream songs",
    src: "/models/boombox.glb",
    orbit: "-20deg 80deg 105%",
    credit: "Poly Haven",
    license: "CC0",
  },
  {
    id: "walkman",
    name: "walkman",
    blurb: "portable cassette player, tape out",
    src: "/models/walkman.glb",
    orbit: "-20deg 78deg 105%",
    credit: "Poly Haven",
    license: "CC0",
  },
  {
    id: "gamepad",
    name: "gamepad",
    blurb: "a retro controller, cable and all",
    src: "/models/gamepad.glb",
    orbit: "-30deg 70deg 105%",
    credit: "Poly Haven",
    license: "CC0",
  },
  {
    id: "lamp",
    name: "desk lamp",
    blurb: "the lamp that lights the graph paper",
    src: "/models/lamp.glb",
    orbit: "-30deg 78deg 105%",
    credit: "downloaded model (volumetric lamp)",
    license: "check source license before shipping",
  },
  {
    id: "reaper",
    name: "little reaper",
    blurb: "grim reaper, coffee in hand, off duty too",
    src: "/models/reaper.glb",
    orbit: "-20deg 78deg 105%",
    credit: "downloaded model (grim reaper)",
    license: "check source license before shipping",
  },
];

export const DEFAULT_MODEL = "cat";
