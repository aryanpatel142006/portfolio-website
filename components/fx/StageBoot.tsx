/** "booting turntable…" over the stage: shown while the page settles after
    the unlock, while the Three.js chunk downloads, and (with a percentage,
    from Stage3D) while the object itself loads. */
export default function StageBoot({ progress }: { progress?: number }) {
  return (
    <div className="stage-loading" aria-live="polite">
      <span className="stage-loading-ring" aria-hidden />
      <span className="font-arcade text-[9px] uppercase tracking-[0.18em] text-neon-2">
        booting turntable…{progress !== undefined ? ` ${Math.round(progress)}%` : ""}
      </span>
    </div>
  );
}
