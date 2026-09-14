"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DEFAULT_MODEL, STAGE_MODELS } from "@/lib/models";
import { OFFDUTY_COIN_EVENT } from "@/lib/offduty";

/* The Three.js stage (three, fiber, drei, postprocessing) loads only after
   the unlock, never on the server. */
const Stage3D = dynamic(() => import("./Stage3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center font-mono text-[11px] text-muted">
      loading the turntable…
    </div>
  ),
});

/** A turntable for one 3D object in the off-duty world. Lit and graded like
    a proper render (HDR, rim lights in the night's neon, bloom, ambient
    occlusion). Left alone it swings slowly about its front; drag it and it
    is yours, momentum included; once it stops it eases back and the swing
    resumes. Each coin swaps the object for one of the others. */
export default function ModelStage() {
  const [id, setId] = useState(DEFAULT_MODEL);
  const model = STAGE_MODELS.find((m) => m.id === id) ?? STAGE_MODELS[0];

  // a coin deals a different object onto the turntable
  useEffect(() => {
    const onCoin = () =>
      setId((cur) => {
        const others = STAGE_MODELS.filter((m) => m.id !== cur);
        return others[Math.floor(Math.random() * others.length)]?.id ?? cur;
      });
    window.addEventListener(OFFDUTY_COIN_EVENT, onCoin);
    return () => window.removeEventListener(OFFDUTY_COIN_EVENT, onCoin);
  }, []);

  return (
    <div className="model-stage-wrap">
      <div className="model-stage">
        <Stage3D key={model.id} model={model} />
        <span aria-hidden className="model-stage-floor" />
      </div>
    </div>
  );
}
