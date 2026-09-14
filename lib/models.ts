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
    id: "reaper",
    name: "little reaper",
    blurb: "grim reaper, coffee in hand, off duty too",
    src: "/models/reaper.glb",
    orbit: "-20deg 78deg 105%",
    exposure: 1.3,
    credit: "downloaded model (grim reaper)",
    license: "check source license before shipping",
  },
  {
    id: "lamp",
    name: "desk lamp",
    blurb: "the lamp that lights the graph paper",
    src: "/models/lamp.glb",
    orbit: "-30deg 78deg 105%",
    exposure: 1.2,
    credit: "downloaded model (volumetric lamp)",
    license: "check source license before shipping",
  },
  {
    id: "computer",
    name: "old computer",
    blurb: "a hand-painted beige box and a mug of coffee",
    src: "/models/computer.glb",
    orbit: "-25deg 78deg 105%",
    exposure: 1.2,
    credit: "downloaded model (old computer)",
    license: "check source license before shipping",
  },
  {
    id: "standby",
    name: "stand by",
    blurb: "a wood-grain CRT waiting for a signal",
    src: "/models/standby.glb",
    orbit: "-15deg 82deg 105%",
    exposure: 1.1,
    credit: "downloaded model (monitor ii)",
    license: "check source license before shipping",
  },
  {
    id: "subway",
    name: "subway",
    blurb: "a low-poly street corner with an underground entrance",
    src: "/models/subway.glb",
    orbit: "30deg 70deg 110%",
    exposure: 1.2,
    credit: "downloaded model (low poly subway entrance)",
    license: "check source license before shipping",
  },
  {
    id: "nebula",
    name: "nebula core",
    blurb: "a white machine of some kind",
    src: "/models/nebula.glb",
    orbit: "-25deg 78deg 105%",
    exposure: 1.0,
    credit: "downloaded model (nebula core)",
    license: "check source license before shipping",
  },
];

export const DEFAULT_MODEL = "crt";
