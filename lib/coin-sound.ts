/** The arcade coin blip, synthesized on the spot: two short square-wave
    notes, B5 then E6, with a quick decay. Runs only from a click, so the
    AudioContext is always allowed. Quiet by design. */
let ctx: AudioContext | null = null;

export function playCoin(): void {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const t0 = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01);
    gain.gain.setValueAtTime(0.12, t0 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.42);
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(987.77, t0); // B5
    osc.frequency.setValueAtTime(1318.51, t0 + 0.08); // E6
    osc.connect(gain);
    osc.start(t0);
    osc.stop(t0 + 0.45);
  } catch {
    // no audio, no problem
  }
}
