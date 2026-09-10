/**
 * One shared <audio> for the song shelf's hover previews. Only one clip
 * plays at a time; starting another fades the first out. Volume fades in
 * and out so a pointer sweeping down the list never pops. Subscribers get
 * {url, progress, playing} so a card can spin its vinyl and draw a progress
 * ring only while its own clip is the one playing.
 */

export type PreviewState = { url: string | null; progress: number; playing: boolean };
type Listener = (s: PreviewState) => void;

const listeners = new Set<Listener>();
let audio: HTMLAudioElement | null = null;
let current: string | null = null;
let fadeRaf = 0;

const LEVEL = 0.55;

function ensure(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.preload = "none";
    audio.addEventListener("timeupdate", emit);
    audio.addEventListener("ended", () => {
      current = null;
      emit();
    });
    audio.addEventListener("error", () => {
      current = null;
      emit();
    });
  }
  return audio;
}

function emit() {
  const a = audio;
  const s: PreviewState = {
    url: current,
    progress: a && a.duration ? a.currentTime / a.duration : 0,
    playing: !!a && !a.paused && current !== null,
  };
  listeners.forEach((l) => l(s));
}

function fadeTo(target: number, ms: number, done?: () => void) {
  cancelAnimationFrame(fadeRaf);
  const a = ensure();
  const from = a.volume;
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / ms);
    a.volume = from + (target - from) * k;
    if (k < 1) fadeRaf = requestAnimationFrame(step);
    else done?.();
  };
  fadeRaf = requestAnimationFrame(step);
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export async function playPreview(url: string): Promise<void> {
  const a = ensure();
  if (current !== url) {
    a.src = url;
    a.currentTime = 0;
  }
  current = url;
  a.volume = 0;
  try {
    await a.play();
  } catch {
    // autoplay refused or the clip failed: show nothing rather than a stuck state
    if (current === url) current = null;
    emit();
    return;
  }
  if (current !== url) return; // superseded while loading
  fadeTo(LEVEL, 350);
  emit();
}

export function stopPreview(url?: string): void {
  if (!audio || current === null) return;
  if (url && current !== url) return;
  current = null;
  emit();
  fadeTo(0, 220, () => {
    if (current === null) audio?.pause();
  });
}

export function isPlaying(url: string): boolean {
  return current === url && !!audio && !audio.paused;
}
