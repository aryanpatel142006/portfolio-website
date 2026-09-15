"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import StageBoot from "./StageBoot";
import { DEFAULT_MODEL, STAGE_MODELS } from "@/lib/models";
import { OFFDUTY_COIN_EVENT } from "@/lib/offduty";

/* The Three.js stage (three, fiber, drei, postprocessing) loads only after
   the unlock, never on the server. */
const Stage3D = dynamic(() => import("./Stage3D"), {
  ssr: false,
  loading: () => <StageBoot />,
});

/** The unlock sweep runs 0.85s; the stage waits for it to finish and for
    the main thread to go quiet before it compiles its shaders, so the
    entrance never stutters. Capped so it still shows up within ~2s on a
    busy tab. */
function useArmed() {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    let idle = 0;
    const t = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setArmed(true), { timeout: 1000 });
      } else {
        setArmed(true);
      }
    }, 1000);
    return () => {
      window.clearTimeout(t);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);
  return armed;
}

/** A turntable for one 3D object in the off-duty world. Lit and graded like
    a proper render (HDR, rim lights in the night's neon, bloom, ambient
    occlusion). Left alone it swings slowly about its front; drag it and it
    is yours, momentum included; once it stops it eases back and the swing
    resumes. Each coin swaps the object for one of the others. */
export default function ModelStage() {
  const [id, setId] = useState(DEFAULT_MODEL);
  const armed = useArmed();
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
        {armed ? <Stage3D key={model.id} model={model} /> : <StageBoot />}
        <span aria-hidden className="model-stage-floor" />
      </div>
    </div>
  );
}
