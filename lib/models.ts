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
    id: "computer",
    name: "old computer",
    blurb: "a hand-painted beige box and a mug of coffee",
    src: "/models/computer.glb",
    orbit: "75deg 80deg 88%", // screen to the camera, keyboard showing
    exposure: 1.2,
    credit: "downloaded model (old computer)",
    license: "check source license before shipping",
  },
  {
    id: "reaper",
    name: "little reaper",
    blurb: "grim reaper, coffee in hand, off duty too",
    src: "/models/reaper.glb",
    orbit: "70deg 78deg 95%", // face and mug, a touch of profile
    exposure: 1.3,
    credit: "downloaded model (grim reaper)",
    license: "check source license before shipping",
  },
  {
    id: "crt",
    name: "signal lost",
    blurb: "a portable CRT stuck on a test pattern",
    src: "/models/crt.glb",
    orbit: "-10deg 84deg 100%", // screen square to the camera
    exposure: 1.05,
    credit: "downloaded model (monitor)",
    license: "check source license before shipping",
  },
  {
    id: "grog",
    name: "grog the adventurer",
    blurb: "a frog with a torch and a bedroll twice his size",
    src: "/models/grog.glb", // 2k textures kept: still under 1MB after Draco + WebP
    orbit: "0deg 78deg 95%", // face, torch and pack all in view
    exposure: 1.15,
    credit: "downloaded model (grog the adventurer)",
    license: "check source license before shipping",
  },
];

export const DEFAULT_MODEL = "computer";
