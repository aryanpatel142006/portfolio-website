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
    orbit: "-20deg 80deg 105%",
    exposure: 1.2,
    credit: "downloaded model (old computer)",
    license: "check source license before shipping",
  },
];

export const DEFAULT_MODEL = "computer";
