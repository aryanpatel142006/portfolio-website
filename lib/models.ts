/** 3D objects for the off-duty stage. GLBs live in public/models, compressed
    with Draco + WebP (1K textures). `orbit` is the opening camera. */
export type StageModel = {
  id: string;
  name: string;
  blurb: string;
  src: string;
  orbit: string;
  exposure: number; // scene brightness; dark objects need more
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
    exposure: 1.7, // black hoodie on a dark stage needs the extra light
    credit: "downloaded model (FIRE CAT)",
    license: "check source license before shipping",
  },
  {
    id: "crt",
    name: "signal lost",
    blurb: "a portable CRT stuck on a test pattern",
    src: "/models/crt.glb",
    orbit: "-15deg 82deg 105%",
    exposure: 1.05,
    credit: "downloaded model (monitor)",
    license: "check source license before shipping",
  },
  {
    id: "boombox",
    name: "boombox",
    blurb: "for the non-mainstream songs",
    src: "/models/boombox.glb",
    orbit: "-20deg 80deg 105%",
    exposure: 1.2,
    credit: "Poly Haven",
    license: "CC0",
  },
];

export const DEFAULT_MODEL = "cat";
