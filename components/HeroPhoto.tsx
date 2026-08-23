"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { unlockOffDuty } from "@/lib/offduty";

const CLICKS_TO_UNLOCK = 5;

/** The portrait, pasted on like a photo in a zine — tape, tilt, caption.
    Secret: tap it 5× to unlock off-duty; hovering crossfades to the cat. */
export default function HeroPhoto({
  photo,
  photoHover,
  name,
}: {
  photo: string;
  photoHover?: string;
  name: string;
}) {
  const count = useRef(0);
  const [purring, setPurring] = useState(false);

  function onClick() {
    count.current += 1;
    if (count.current >= CLICKS_TO_UNLOCK) {
      count.current = 0;
      setPurring(true);
      unlockOffDuty();
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${name} — portrait`}
      className="group relative w-44 shrink-0 rotate-2 cursor-pointer select-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 sm:w-52"
    >
      {/* tape strip */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 border border-border bg-surface/80 opacity-90 shadow-sm backdrop-blur-[1px]"
      />
      <div className="border border-border-strong bg-surface p-2 pb-8 shadow-[var(--shadow)]">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={photo}
            alt={name}
            fill
            priority
            sizes="(max-width: 640px) 176px, 208px"
            className="object-cover opacity-100 transition-opacity duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-50"
          />
          {photoHover && (
            <Image
              src={photoHover}
              alt=""
              fill
              sizes="(max-width: 640px) 176px, 208px"
              className={`object-cover transition-opacity duration-[2500ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-80 ${
                purring ? "opacity-80" : "opacity-0"
              }`}
            />
          )}
        </div>
        <p className="mt-2.5 text-center font-serif text-[12px] italic text-muted">
          the author, probably debugging
        </p>
      </div>
    </button>
  );
}
