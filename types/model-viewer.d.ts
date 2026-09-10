import type { DetailedHTMLProps, HTMLAttributes } from "react";

/** <model-viewer> is a custom element from @google/model-viewer; React
    passes unknown attributes straight through, so a loose declaration is
    enough for the handful we use. */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        loading?: "auto" | "lazy" | "eager";
        reveal?: "auto" | "manual";
        "camera-controls"?: boolean;
        "disable-zoom"?: boolean;
        "disable-pan"?: boolean;
        "auto-rotate"?: boolean;
        "auto-rotate-delay"?: number | string;
        "rotation-per-second"?: string;
        "camera-orbit"?: string;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        "field-of-view"?: string;
        exposure?: number | string;
        "shadow-intensity"?: number | string;
        "shadow-softness"?: number | string;
        "environment-image"?: string;
        "interaction-prompt"?: string;
        "touch-action"?: string;
      };
    }
  }
}
